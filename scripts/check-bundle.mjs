#!/usr/bin/env node
// Static gates for this bundle, run by CI on every pull request.
//
// This repository is content only: nothing compiles and no suite executes it, so without these checks
// the first thing to discover a broken file is the Antigravity CLI, on a developer's machine, often
// silently. Each check below exists because its failure mode is invisible in normal use.
//
//   node scripts/check-bundle.mjs
//
// Exit 0 when clean, 1 on any finding.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const findings = [];
const IGNORED_DIRS = new Set(['.git', 'node_modules']);

function fail(file, message, line) {
  findings.push({ file, message, line });
}

function walk(dir, predicate, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      walk(join(dir, entry.name), predicate, out);
    } else if (predicate(entry.name)) {
      out.push(join(dir, entry.name));
    }
  }
  return out;
}

const rel = (p) => relative(root, p).replace(/\\/g, '/');
const read = (p) => readFileSync(p, 'utf8');

const jsonFiles = walk(root, (n) => n.endsWith('.json'));
const mdFiles = walk(root, (n) => n.endsWith('.md'));

// ---------------------------------------------------------------------------
// 1. Every JSON file parses.
// ---------------------------------------------------------------------------
for (const file of jsonFiles) {
  try {
    JSON.parse(read(file));
  } catch (err) {
    fail(rel(file), `invalid JSON: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// 2. The plugin manifest.
//
// This host validates `name` and reads no version field, so a `version` here would be a second source
// of truth that nothing checks and that would silently drift from CHANGELOG.md.
// ---------------------------------------------------------------------------
const manifestPath = join(root, 'plugin.json');
if (!existsSync(manifestPath)) {
  fail('plugin.json', 'missing: the CLI cannot install a bundle without it');
} else {
  let manifest;
  try {
    manifest = JSON.parse(read(manifestPath));
  } catch {
    manifest = null; // already reported above
  }
  if (manifest) {
    if (manifest.name !== 'neural-seam') {
      fail('plugin.json', `name must be "neural-seam", found ${JSON.stringify(manifest.name)}`);
    }
    if (typeof manifest.description !== 'string' || manifest.description.trim() === '') {
      fail('plugin.json', 'description must be a non-empty string');
    }
    if ('version' in manifest) {
      fail(
        'plugin.json',
        'remove "version": this host does not read it, and CHANGELOG.md is the version of record',
      );
    }
    // No official, publicly reachable JSON Schema for this host's plugin manifest is known: the URL
    // that used to sit here answered 404, and the CLI binary ships no schema URL of its own. A
    // `$schema` that does not resolve is worse than none, because editors and reviewers treat it as
    // validated. If an official one is ever published, add it to OFFICIAL_SCHEMAS below with the
    // evidence, rather than relaxing this check.
    const OFFICIAL_SCHEMAS = [];
    if ('$schema' in manifest && !OFFICIAL_SCHEMAS.includes(manifest.$schema)) {
      fail(
        'plugin.json',
        `"$schema" is not a verified official schema URL (${JSON.stringify(manifest.$schema)}); ` +
          'remove it, or add the official URL to OFFICIAL_SCHEMAS once it is confirmed to resolve',
      );
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Frontmatter on every skill and rule.
//
// This host rejects a rule or skill file whose `---` block is malformed, and it does so silently in
// normal use: the file simply never loads. The parser cares about the block, not the vocabulary, so
// this check does the same and does not validate `trigger` values.
// ---------------------------------------------------------------------------
function frontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return null;
  const end = lines.indexOf('---', 1);
  if (end === -1) return null;
  return lines.slice(1, end);
}

for (const dir of ['skills', 'rules']) {
  const abs = join(root, dir);
  if (!existsSync(abs)) continue;
  for (const file of walk(abs, (n) => n.endsWith('.md'))) {
    const block = frontmatter(read(file));
    if (block === null) {
      fail(rel(file), 'missing or unterminated YAML frontmatter block, so this host will not load it');
      continue;
    }
    const keys = block
      .map((l) => /^([A-Za-z_][\w-]*)\s*:/.exec(l))
      .filter(Boolean)
      .map((m) => m[1]);
    if (!keys.includes('description')) {
      fail(rel(file), 'frontmatter needs a `description`: on this host it is the activation trigger');
    }
    if (dir === 'skills') {
      if (!keys.includes('name')) {
        fail(rel(file), 'skill frontmatter needs a `name`');
      } else {
        const declared = /^name\s*:\s*"?([^"\n]+?)"?\s*$/m.exec(block.join('\n'))?.[1];
        const folder = rel(dirname(file)).split('/').pop();
        if (declared && declared !== folder) {
          fail(rel(file), `frontmatter name "${declared}" does not match its folder "${folder}"`);
        }
      }
    }
  }
}

const skillCount = existsSync(join(root, 'skills'))
  ? readdirSync(join(root, 'skills'), { withFileTypes: true }).filter((e) => e.isDirectory()).length
  : 0;

// ---------------------------------------------------------------------------
// 4. Skills and rules use the namespaced invocation form.
//
// The short form `/ns-<name>` is not expanded by this CLI: it reaches the model as literal text, with
// no error. Measured on 2026-09-04 with agy 1.1.13. Scoped to skills/ and rules/ on purpose, because
// README.md documents the wrong form deliberately, as the thing not to type.
// ---------------------------------------------------------------------------
for (const dir of ['skills', 'rules']) {
  const abs = join(root, dir);
  if (!existsSync(abs)) continue;
  for (const file of walk(abs, (n) => n.endsWith('.md'))) {
    read(file)
      .split(/\r?\n/)
      .forEach((line, i) => {
        if (/(?<![\w:/])\/ns-[a-z]/.test(line)) {
          fail(rel(file), 'uses `/ns-*`; this host only expands the namespaced `/neural-seam:ns-*`', i + 1);
        }
      });
  }
}

// ---------------------------------------------------------------------------
// 5. No credentials.
//
// Screening for references that belong only to the repository this content is authored in runs
// there, before anything reaches this repository, and deliberately not here: a checker that
// enumerates what it is hiding publishes it. This file checks what is safe to state in the open.
// ---------------------------------------------------------------------------
const SECRETS = [
  { name: 'GitHub token', re: /\b(?:ghp|gho|ghs|ghu|ghr)_[A-Za-z0-9]{16,}\b/ },
  { name: 'GitHub fine-grained token', re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/ },
  { name: 'OpenAI-style key', re: /\bsk-[A-Za-z0-9]{20,}\b/ },
  { name: 'AWS access key id', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'Google API key', re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: 'Slack token', re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: 'private key block', re: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/ },
];

// Built from code points so this file never carries the byte sequences it looks for.
const MOJIBAKE = [
  [0x00c3, 0x00a9], // "e acute" read as latin-1
  [0x00c3, 0x00a7], // "c cedilla" read as latin-1
  [0x00c3, 0x00a3], // "a tilde" read as latin-1
  [0x00e2, 0x0080, 0x0099], // right single quote read as latin-1
  [0x00ef, 0x00bf, 0x00bd], // replacement character, already lossy
].map((points) => String.fromCharCode(...points));

// Every text file, not just the ones the CLI loads. Scoping this to markdown and JSON is what let a
// workflow file and this script itself go unscanned.
const textFiles = walk(root, (n) => /\.(md|json|ya?ml|mjs|js|txt)$/.test(n) || /^(LICENSE|CODEOWNERS)$/.test(n));

for (const file of textFiles) {
  const relPath = rel(file);
  const isMeta = relPath === 'scripts/check-bundle.mjs';
  read(file)
    .split(/\r?\n/)
    .forEach((line, i) => {
      for (const p of SECRETS) {
        if (p.re.test(line)) fail(relPath, `looks like a ${p.name}`, i + 1);
      }
      if (!isMeta) {
        for (const m of MOJIBAKE) {
          if (line.includes(m)) fail(relPath, 'mojibake: this file was written with the wrong encoding', i + 1);
        }
      }
    });
}

// ---------------------------------------------------------------------------
// 7. Local links resolve, including their anchors.
//
// A dead link in a README is the cheapest defect to ship and one of the most visible.
// ---------------------------------------------------------------------------
function anchorsOf(text) {
  const set = new Set();
  for (const line of text.split(/\r?\n/)) {
    const m = /^#{1,6}\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    set.add(
      m[1]
        .replace(/`/g, '')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-'),
    );
  }
  return set;
}

const anchorCache = new Map();
function anchorsFor(absPath) {
  if (!anchorCache.has(absPath)) anchorCache.set(absPath, anchorsOf(read(absPath)));
  return anchorCache.get(absPath);
}

for (const file of mdFiles) {
  const text = read(file);
  const relPath = rel(file);
  for (const m of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^(?:https?:|mailto:|#)/.test(target)) {
      if (target.startsWith('#') && !anchorsFor(file).has(target.slice(1))) {
        fail(relPath, `link to "${target}" has no matching heading in this file`);
      }
      continue;
    }
    const [pathPart, anchor] = target.split('#');
    const abs = resolve(dirname(file), pathPart);
    if (!existsSync(abs)) {
      fail(relPath, `broken link: "${target}" does not exist`);
    } else if (anchor && abs.endsWith('.md') && !anchorsFor(abs).has(anchor)) {
      fail(relPath, `link to "${target}" has no matching heading in that file`);
    }
  }
}

// ---------------------------------------------------------------------------
// 8. The documents an external reader is promised.
// ---------------------------------------------------------------------------
for (const required of [
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  'SECURITY.md',
  'SUPPORT.md',
  'PRIVACY.md',
  'CONTRIBUTING.md',
  'TRADEMARKS.md',
  'mcp_config.json',
  'hooks.json',
]) {
  if (!existsSync(join(root, required))) fail(required, 'missing');
}

// ---------------------------------------------------------------------------
// 9. Every hook declares a timeout.
//
// A hook without one inherits whatever default the CLI happens to use, which is not part of any
// contract and has changed between releases. Declaring it keeps the worst case bounded by something
// this repository states out loud rather than by something a future CLI version decides.
// ---------------------------------------------------------------------------
const hooksPath = join(root, 'hooks.json');
if (existsSync(hooksPath)) {
  let hooksDoc = null;
  try {
    hooksDoc = JSON.parse(read(hooksPath));
  } catch {
    /* already reported by check 1 */
  }
  const checkHook = (h, where) => {
    if (!h || typeof h !== 'object') return;
    if (typeof h.command !== 'string' || h.command.trim() === '') {
      fail('hooks.json', `${where}: hook has no command`);
    }
    if (typeof h.timeout !== 'number' || !(h.timeout > 0)) {
      fail('hooks.json', `${where}: hook declares no positive \`timeout\` (seconds)`);
    }
  };
  for (const [bundleName, bundle] of Object.entries(hooksDoc ?? {})) {
    if (!bundle || typeof bundle !== 'object') continue;
    for (const [event, entries] of Object.entries(bundle)) {
      if (event === 'enabled' || !Array.isArray(entries)) continue;
      entries.forEach((entry, i) => {
        const where = `${bundleName}.${event}[${i}]`;
        // PreToolUse / PostToolUse wrap their hooks in a matcher object; the rest are hooks directly.
        if (Array.isArray(entry?.hooks)) {
          entry.hooks.forEach((h, j) => checkHook(h, `${where}.hooks[${j}]`));
        } else {
          checkHook(entry, where);
        }
      });
    }
  }
}

// ---------------------------------------------------------------------------
// 10. No operational addresses baked into the loaded content.
//
// The runtime reports the address it is actually serving on, and that address is not fixed. A skill
// that prints a remembered host and port sends the developer to a page that is not there, and does it
// confidently. Documentation may show an example; the content the CLI loads may not.
// ---------------------------------------------------------------------------
const ADDRESS_PATTERNS = [
  { name: 'a hardcoded loopback address', re: /\b(?:127\.0\.0\.1|localhost|0\.0\.0\.0|\[::1\])\b/i },
  { name: 'a hardcoded http(s) endpoint', re: /\bhttps?:\/\/(?!(?:neuralseam\.cloud|app\.neuralseam\.cloud|github\.com))/i },
  { name: 'a hardcoded port number', re: /:\d{4,5}\b/ },
];
for (const dir of ['skills', 'rules']) {
  const abs = join(root, dir);
  if (!existsSync(abs)) continue;
  for (const file of walk(abs, (n) => n.endsWith('.md'))) {
    read(file)
      .split(/\r?\n/)
      .forEach((line, i) => {
        for (const p of ADDRESS_PATTERNS) {
          if (p.re.test(line)) {
            fail(rel(file), `${p.name}; ask the runtime for the address instead`, i + 1);
          }
        }
      });
  }
}

// ---------------------------------------------------------------------------
// 11. Nothing is looked up by a literal title.
//
// Matching a record by the exact text of its title couples this bundle to a string it does not own.
// Whoever owns that string is free to reword it, and the lookup then silently finds nothing.
// ---------------------------------------------------------------------------
const TITLE_LOOKUP = /\b(?:title is exactly|whose title is|by its (?:exact )?title|matched? (?:it )?verbatim|exact title)\b/i;
for (const dir of ['skills', 'rules']) {
  const abs = join(root, dir);
  if (!existsSync(abs)) continue;
  for (const file of walk(abs, (n) => n.endsWith('.md'))) {
    read(file)
      .split(/\r?\n/)
      .forEach((line, i) => {
        if (TITLE_LOOKUP.test(line)) {
          fail(rel(file), 'looks up a record by a literal title; use the identifier the runtime returns', i + 1);
        }
      });
  }
}

// ---------------------------------------------------------------------------
// 12. Skills do not re-derive the product's flow.
//
// The runtime owns the states a project can be in and returns a message written for the developer.
// A skill that keeps its own copy of that table drifts from it, and the copy in the bundle is the one
// nobody updates. One state literal is a worked example; several is a second implementation.
// ---------------------------------------------------------------------------
const STATE_LITERAL = /\bneeds_[a-z][a-z_]*\b/g;
for (const dir of ['skills', 'rules']) {
  const abs = join(root, dir);
  if (!existsSync(abs)) continue;
  for (const file of walk(abs, (n) => n.endsWith('.md'))) {
    const distinct = new Set(read(file).match(STATE_LITERAL) ?? []);
    if (distinct.size > 1) {
      fail(
        rel(file),
        `names ${distinct.size} of the product's states (${[...distinct].join(', ')}); ` +
          'present what the runtime returns rather than keeping a copy of its flow',
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Report.
// ---------------------------------------------------------------------------
if (findings.length === 0) {
  console.log(`check-bundle: OK (${skillCount} skills, ${mdFiles.length} markdown, ${jsonFiles.length} json)`);
  process.exit(0);
}

console.error(`check-bundle: ${findings.length} finding(s)\n`);
for (const f of findings) {
  console.error(`  ${f.file}${f.line ? `:${f.line}` : ''}  ${f.message}`);
}
process.exit(1);

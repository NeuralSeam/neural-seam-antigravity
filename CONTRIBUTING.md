# Contributing

Thanks for looking. This repository is small and unusually constrained, so it is worth two minutes to
read what it is before proposing a change.

## What this repository is

A **host adapter**, shipped as an Antigravity CLI plugin bundle. It is content only: markdown and JSON.
Nothing here compiles, and no test suite runs against it. The first thing to discover a broken file is
otherwise the CLI, on a developer's machine, which is why the checks in `scripts/check-bundle.mjs` exist
and why CI runs them on every pull request.

It is also deliberately **thin**. Product logic lives in the `neural-seam` runtime and the backend, not
here. A change that teaches this bundle a rule the runtime should own will be declined, however well it
is written, because the same rule would then have to be re-implemented for every other host.

## What belongs here, and what does not

**Yes:**

- Fixing a command, a description or a documented fact that is wrong or out of date.
- Something that is genuinely specific to the Antigravity CLI: its invocation form, its hook shape, its
  manifest, its permission model.
- Documentation: clarity, accuracy, translation of the short Portuguese guide.

**No:**

- Hardcoded ports, URLs, environment names or card titles. The runtime reports these; read them from it.
- Duplicating the product's flow. The runtime returns the state and a message written for the
  developer; present that. A table of states and transitions kept here is a second implementation,
  and it is the one nobody updates.
- Literals belonging to another agent CLI. This bundle names no other host's commands or marketplaces.
- Bundling the `neural-seam` binary, or anything that installs, replaces or works around
  `neural-seam login` / `connect`.
- Anything that makes the CLI look like it is doing something the developer did not start.

## Ground rules for content

- **Claims are measured, not assumed.** This bundle's documentation states host behaviour with the `agy`
  version it was measured on and how. If you assert what the CLI does, say how you know. "It should work
  like X" belongs in an issue, not in the README.
- **A comment or a sentence that a change made false is part of that change.** Fix it in the same
  commit.
- **Every skill and rule file needs well formed YAML frontmatter.** This host rejects a rule file with a
  malformed frontmatter block, and it does so silently in normal use, so the file simply never loads.
  `scripts/check-bundle.mjs` enforces the block.
- **Write for someone outside the team.** No internal design document names, no internal ticket
  paths, no internal source symbols. That screening runs upstream, before content reaches this
  repository, and deliberately not here: a public check whose pattern list *is* the thing it hides
  publishes it. The checks in this repository are the ones that are safe to state out loud.
- **Version lives in `CHANGELOG.md`**, not in `plugin.json`. This host's manifest validates `name` and
  `description` and reads no version field, so a version there would be a second source of truth that
  nothing checks.

## Making a change

1. Open an issue first for anything behavioural. For a typo or a broken link, just send the pull
   request.
2. Run the checks locally:

   ```sh
   node scripts/check-bundle.mjs
   agy plugin validate .        # if you have the CLI
   ```

3. Test it for real when you have touched a skill, a hook or the MCP registration. `agy plugin install
   <path>` accepts a local directory. Note that installing from a local git checkout copies `.git` too,
   which can break the next install over it; delete the installed plugin directory before reinstalling.
4. One logical change per commit, with a `type(scope): imperative subject` message
   (`fix(skills): ...`, `docs: ...`).
5. Add a `CHANGELOG.md` entry whenever the published content changes meaning. Say what changed and why,
   and include the evidence if the reason is a measurement.

## Review

Maintainers are listed in [.github/CODEOWNERS](./.github/CODEOWNERS). This bundle is kept in lockstep
with the `neural-seam` runtime's host adapter, so a change to its wiring may need a matching runtime
change before it can be merged. If that applies to your pull request, we will say so on the pull request
rather than leaving it open without explanation.


## How this bundle relates to the runtime

Useful when judging whether a change belongs here at all.

On this host **the bundle is the wiring, and the wiring is global.** The CLI reads the MCP
registration and the hooks from inside the installed plugin directory, and there is no global MCP
configuration file the runtime could write instead. What the runtime materializes inside a project is
therefore a fallback for machines without the bundle; with the bundle installed, `neural-seam connect`
skips and cleans up that per project wiring, so nothing is ever wired twice.

That is why a change teaching this bundle a product rule is declined: the rule would then exist twice,
and the copy here is the one that goes stale.

## Before a release

Some of what this repository claims can only be checked by running the Antigravity CLI, and the CLI
cannot be installed and authenticated reproducibly in CI: `agy plugin validate` needs the binary, and
anything that exercises a command needs a signed in CLI, which a public runner does not have. So these
are **not** in CI, and they are **mandatory before tagging**. Run them on a machine with `agy`
installed and record the versions.

```sh
node scripts/check-bundle.mjs                  # the static gates CI also runs
agy --version                                  # record it; claims below are version specific
agy plugin validate .
agy plugin uninstall neural-seam || true
agy plugin install .
agy plugin list                                # `neural-seam` present, components: skills, mcpServers, hooks
```

Then, in a scratch directory:

1. **All 11 commands load.** Send every `/neural-seam:ns-*` command in one prompt with
   `agy -p "<text>" --output-format stream-json` and confirm the `init` event's `expanded_commands`
   lists all 11 with `"type":"skill"`.
2. **The short form still does not expand.** Send `/ns-help` the same way and confirm
   `expanded_commands` is absent.
3. **The hooks behave as SECURITY.md says.** Re-run the cases in the table there against the `agy`
   version you are about to claim: a working hook, a hook that exits in error, a missing binary, a
   hook that exceeds its timeout, and a hook that prints something that is not JSON. This host's
   behaviour here **has changed between CLI releases**, so it is re-measured every release rather than
   inherited.
4. **The runtime contract the commands rely on.** The commands present the state and message that
   `check_setup` returns and the prompts that `next_job` and `exec_activity` return. Confirm against
   the **published** runtime, not a development build, and do not document a behaviour that only a
   development build has.

Record the results in the changelog entry when a claim in the documentation depends on them.

By contributing, you agree that your contribution is licensed under the repository's
[MIT license](./LICENSE).

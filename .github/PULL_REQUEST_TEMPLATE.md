# What this changes

<!-- One or two sentences. What is different for someone who installs the bundle after this? -->

Closes #

## Why

<!--
If this rests on how the Antigravity CLI behaves, say how you know and on which `agy` version.
This bundle documents host behaviour as measured fact, and "it should work like X" is the one thing
reviewers cannot check for you.
-->

## Checklist

- [ ] `node scripts/check-bundle.mjs` passes.
- [ ] `agy plugin validate .` passes, if I have the CLI.
- [ ] I tested it against a real `agy` session, if I touched a skill, a hook or `mcp_config.json`.
- [ ] `CHANGELOG.md` has an entry, if the published content changed meaning.
- [ ] No sentence anywhere in the repository was left false by this change.
- [ ] Nothing here hardcodes a port, URL, environment name or card title that the runtime reports.
- [ ] No version field was added to `plugin.json`. The version of record is `CHANGELOG.md`.
- [ ] The text reads for someone outside the team: no internal design document names, ticket paths or
      source symbols.

## Runtime lockstep

<!--
Delete this section if it does not apply.
Changes to plugin.json, mcp_config.json or hooks.json are part of a contract with the runtime's
Antigravity host adapter. Say which runtime version carries the matching change, or note that none is
needed.
-->

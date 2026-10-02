# Changelog

Notable changes to the Neural Seam bundle for the Antigravity CLI. Format based on
[Keep a Changelog](https://keepachangelog.com/); independent semantic versioning.

> [!NOTE]
> This host's plugin manifest validates `name` and `description` and declares no version field.
> **This file is the version of record** for the bundle, and the base for its release tag.

To update an installed bundle: `agy plugin uninstall neural-seam`, then install again from the
repository URL.

## [0.7.0] - 2026-10-01

### Added

- **`/neural-seam:ns-generate` can regenerate a backlog.** When a previous generation left cards tagged
  `generated` that are still in `BACKLOG`, the skill lists them (title, id, board, status) and asks
  whether to keep them or regenerate. Regenerating deletes exactly those cards, after a dry run and
  your explicit confirmation, and then generates a new batch. Cards you created by hand, or already
  picked up, are never touched. This needs a `neural-seam` runtime that provides the
  `delete_activities` tool; on an older runtime the skill says so and generates as before.
- **Regenerating a backlog that has EPICs asks before deleting their sub-activities.** The dry run
  refuses an EPIC with sub-activities unless `cascade` is set, so the command now shows those
  EPICs and their children and repeats the dry run with `cascade: true` only if you agree.

### Changed

- **`/neural-seam:ns-generate` no longer creates the cards one by one after saving.** The runtime's
  `save_insumos` now creates the backlog cards itself, in one batch, so the skill stopped telling the
  model to create each one again with `create_activity`.

## [0.6.0] - 2026-09-29

`/neural-seam:ns-start` now binds the project, and the rule points frontend work at the project's
design system.

### Added

- **Design system reminder in the rule.** `rules/neural-seam.md` asks the agent to call
  `get_design_system` on the `neural-seam-runtime` server before writing frontend code, and to follow
  what it returns. The rule carries no design data: the design always comes from the tool. This host
  has no event that sees both the file being edited and a channel into the session, so an instruction
  that always loads is the coverage available here.

### Fixed

- **`ns-start` binds an unbound directory itself.** It used to name the next command and stop, so the
  start flow could end with the directory still unbound. It now takes the guided path the runtime
  returns, or runs `neural-seam connect <projectId>` after you confirm, and checks the state again
  before moving on.
- **`ns-start` follows a bind refusal to `/neural-seam:ns-clone`.** When the runtime refuses to bind
  because the directory is not a clone of the project's repository, the refusal is shown as it came
  and the flow continues with the clone, then asks you to reopen the session in the cloned folder.

### Changed

- **`ns-start` waits for your confirmation before binding.** This host has no setting that keeps a
  skill away from the model's own initiative, so the confirmation is written into the skill itself.

## [0.5.0] - 2026-09-05

### Removed

- **The `PreToolUse` hook.** On current Antigravity CLI versions a hook that fails on this event
  **blocks the tool call** instead of being skipped. With the hook shipped, a missing `neural-seam`
  binary would have stopped your CLI from doing things unrelated to Neural Seam. It carried no
  advisory content on this host, so it was removed rather than kept and warned about. `PreInvocation`
  and `Stop` remain; both were measured to fail open. Evidence in
  [SECURITY.md](./SECURITY.md#what-the-hooks-were-measured-to-do).
- **`$schema` from the manifest.** The URL it pointed at answered 404, and no official schema for this
  host's plugin manifest is published. A `$schema` that does not resolve reads as validation that
  never happened. The bundle still passes `agy plugin validate .`.
- **The first-run branch for a project whose code is not yet in the folder** (added in 0.2.3). It
  depended on runtime behaviour that has never appeared in a published release, so it could not fire
  for anyone.

### Changed

- **The commands are thin again.** `ns-start` and `ns-status` no longer keep their own table of the
  product's states and transitions: they present the state and the message the runtime returns, so a
  state they have never seen is handled like any other. `ns-generate` presents the prompt the runtime
  composes instead of restating what to generate. The rules of the product live in one place, and it
  is not here.
- **No addresses are baked into the commands.** They show the address the runtime reports rather than
  a remembered host and port, which is the difference between a link that works and a confident link
  to nothing.
- **Nothing is looked up by a literal title any more.** Matching a record by the exact text of its
  title couples this bundle to a string it does not own; the owner rewords it and the lookup silently
  finds nothing.
- **Both remaining hooks declare an explicit `timeout`.** Without one the CLI applies a default that
  is not part of any contract, and it is much longer: a hook hanging for 60 seconds was cut off at
  about 5 seconds with the timeout declared, and ran far longer without it.
- The documentation was rewritten for the person installing this, with maintenance detail moved to
  [CONTRIBUTING.md](./CONTRIBUTING.md), which now also carries the validation that has to be run
  before a release.

### Fixed

- **[PRIVACY.md](./PRIVACY.md) said nothing leaves your machine unless you enable telemetry.** That
  was wrong, and in the reassuring direction. Signing in, identifying your machine at sign in, and
  your project's coordination data are sent whether telemetry is on or off; telemetry is the optional
  part. The page now separates them.
- **The instructions for deleting your data were incomplete.** Deleting `~/.neural-seam/` does not
  remove credentials held in your operating system's credential store. Local files and credentials are
  now documented as separate steps, with `neural-seam logout` for the second.
- **[SECURITY.md](./SECURITY.md) claimed a hook cannot block your CLI.** One measurement on one CLI
  version had been generalised into a guarantee. It is now a table of the cases actually tested, with
  the version and the method, and nothing beyond them.
- **The compatibility matrix listed a runtime capability that has never been published.** It now
  states which published runtime each part of the bundle needs, and nothing here needs an unreleased
  one.
- **How to verify a release is now documented**, with the signing key's fingerprint, the
  allowed-signers line, and a plain statement of what GitHub currently does and does not confirm. See
  [Release signing](./SECURITY.md#release-signing).

### Notes

- The commands still call the same MCP tools, and the MCP registration is unchanged. If your setup
  works today, this changes what the commands say, not what they connect to.
- Measured with `agy` **1.1.26**, re-run unchanged on **1.1.27**, and the published runtime **0.15.1**.

## [0.4.0] - 2026-09-04

### Changed

- The 11 commands and the project rule are now written in English, matching the rest of the
  repository.
- `ns-help` states that commands must be written with the namespace, because the short form is not
  expanded by this CLI.

### Added

- A link to where the `neural-seam` binary comes from, in the header and the requirements table.

### Fixed

- The Antigravity CLI version cited for the namespace measurement was wrong. Corrected, and the
  measurement re-run.

## [0.3.1] - 2026-09-04

0.3.0 was withdrawn and replaced by this release. If you installed it, reinstall from the repository
URL. Nothing about the bundle's behaviour changed between the two.

### Fixed

- The pull request checks named things that had no business being in a public repository. Screening
  for those now happens before content reaches here, and what remains is what is safe to state in the
  open: the manifest, frontmatter, the invocation form, credentials, links and anchors, encoding.
- The credential and encoding scans now cover every text file, not only markdown and JSON.

## [0.3.0] - 2026-09-03 [WITHDRAWN]

The release that made the repository fit to be public. Withdrawn; see 0.3.1.

### Added

- Documentation written for people outside the team: what this is and what it explicitly is not (no
  model, no inference), requirements, install, a first run, the commands, a compatibility matrix, what
  data is accessed, and troubleshooting. `README.pt-BR.md` is a short Portuguese guide pointing back
  to it.
- Project governance: `SECURITY.md`, `SUPPORT.md`, `PRIVACY.md`, `CONTRIBUTING.md`, `TRADEMARKS.md`,
  issue and pull request templates, code owners.
- Checks on every pull request (`scripts/check-bundle.mjs`). This repository is content only, so
  nothing here compiles and no suite executes it; without them the first thing to find a broken file
  is the CLI, on your machine, usually in silence.

### Changed

- `plugin.json`'s description is now in English. No field was added.

### Fixed

- Two README statements that no longer matched reality: the missing per-path convention advisory is a
  limit of this host rather than a gap in the bundle, and the project rule is no longer rejected on
  load (fixed in 0.2.1).

## [0.2.3] - 2026-09-02

### Changed

- Guided first run handled a project whose code was not yet in the folder. **Removed again in 0.5.0**:
  it depended on runtime behaviour that has never been published.

## [0.2.2] - 2026-09-02

### Fixed

- **All 11 commands documented the wrong invocation form.** The bundle described itself as
  `/ns-<name>`, but this host invokes plugin commands with the namespace: `/neural-seam:ns-<name>`.

  The defect was silent, which is why it lasted: without the namespace the CLI raises no error, the
  model infers what you meant from the raw text and reads the file on its own, so you get a plausible
  answer without the command ever having been loaded as one. The worst of it was in each command's
  `description`, which on this host is the activation trigger, and in the `ns-help` table, which is
  exactly where you go looking for the right command.

### Added

- The measured invocation form is documented in `README.md`, with the CLI version and the method.

## [0.2.1] - 2026-08-11

### Fixed

- **`rules/neural-seam.md` loads again.** The file shipped with no frontmatter block at all, and the
  host rejected the whole document on every session. The effect was not cosmetic: the rule never
  entered context, so on this host you never received the statements about where project truth comes
  from, about generation being started by you, or about the signed manifest and credentials not being
  hand edited. The 11 commands in the same bundle always loaded, because they already carried a `---`
  block.

  Measured with the frontmatter block as the only variable: without it the error appears; with it, in
  any of several shapes, the log is clean. The parser charges for the block, not the vocabulary,
  which is why the check added for this does not validate the values inside it. A check stricter than
  the host would reject files the host accepts.

## [0.2.0] - 2026-08-11

### Changed

- **Lifecycle hooks shipped enabled.** With the bundle installed you got the session probe, the
  pre-tool hook and the queue heuristic, not only commands and MCP.

  The reason given at the time was a measurement on the CLI of that period: a hook that exited in
  error was logged and the tool call ran anyway, so the worst case looked like losing a signal. **That
  is no longer true of current CLI versions** - see 0.5.0.

## [0.1.1] - 2026-08-06

### Fixed

- `hooks.json` called hook subcommands this host does not use. It now calls the two that match this
  host's contract: the stand-in for a session open event, and the pre-tool decision shape this host
  reads.

### Notes

- Hooks stayed disabled in this release, deliberately, pending a measurement of how this host treats a
  failing pre-tool hook.

## [0.1.0] - 2026-08-04

First release of the Antigravity CLI host adapter as a plugin bundle.

### Added

- Bundle manifest, MCP registration (`neural-seam serve --project-from-cwd`; one registration serves
  every project, because the server resolves the project from the working directory), the 11 `ns-*`
  commands, the project rule, and the lifecycle hooks in this host's shape.
- README with installation, a smoke check, and the manual MCP permission step.

### Notes

- **Hooks shipped disabled** on purpose.
- **MCP tool approval is a manual step.** This host's bundle format has no permission file and the CLI
  asks per tool by default, so the README documents allowing `mcp(neural-seam-runtime/*)` once. The
  bundle does not work around the permission system.
- **Installation is by repository URL.** The `<plugin>@<marketplace>` form exists but resolves only
  against marketplaces already registered in the CLI.

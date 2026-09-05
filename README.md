# Neural Seam for Antigravity CLI

Neural Seam host adapter for the **Antigravity CLI** (`agy`, Google), shipped as an Antigravity
**plugin bundle**.

Installing it wires one directory of host infrastructure into your CLI: the `neural-seam-runtime` MCP
server, the 11 `/neural-seam:ns-*` commands, a project rule and the lifecycle hooks. Every wire points
at the `neural-seam` binary on your `PATH`.

> **Neural Seam does not provide a model and does not run inference.** It coordinates the work: your
> project's spec, glossary, backlog, cards and per-path conventions live in Neural Seam and are served
> to your agent through MCP. The model you talk to is the one your Antigravity CLI is already
> configured to use, billed by whoever provides it. Neural Seam never authenticates to a model
> provider on your behalf.

- **Product:** <https://neuralseam.cloud>
- **App:** <https://app.neuralseam.cloud>
- **Runtime:** [neural-seam-releases](https://github.com/NeuralSeam/neural-seam-releases#readme) - how
  to install the `neural-seam` binary this bundle wires to, and its user manual
- **License:** [MIT](./LICENSE); see [TRADEMARKS.md](./TRADEMARKS.md) for the name and logo
- **Portuguese:** [README.pt-BR.md](./README.pt-BR.md) (short guide; this file is canonical)

## What it does

- **Gets you set up.** `/neural-seam:ns-start` asks the runtime where you stand and walks you through
  the next step, so you do not have to know which command comes next.
- **Puts your project's own knowledge in context.** The MCP server answers with your backlog,
  conventions and state, instead of the agent reconstructing all of it from the file tree every
  session.
- **Gives you a work loop.** Generate a backlog, list cards, pick one, and render its implementation
  prompt for you to review and run.

## What it does not do

- **It does not install anything.** Not the `neural-seam` binary, not the CLI.
- **It does not sign you in and does not bind your project.** Those are product state, and they stay
  with `neural-seam login` and `neural-seam connect`.
- **It does not start work on its own.** Commands render prompts for you to review; you decide when
  something runs.
- **It does not hold product logic.** The rules of the product live in the runtime and the backend.
  This bundle presents what the runtime returns. See [CONTRIBUTING.md](./CONTRIBUTING.md).
- **It does not grant itself permissions.** See [Approving the tools](#approving-the-tools).

## Requirements

| You need | How to get it | Check |
| --- | --- | --- |
| Antigravity CLI (`agy`) | Google's installer | `agy --version` |
| The `neural-seam` binary on `PATH` | [Neural Seam installer](https://github.com/NeuralSeam/neural-seam-releases#download-and-install) | `neural-seam version` |
| A Neural Seam account, signed in | `neural-seam login` (device flow) | `neural-seam doctor` |
| A project bound to this folder | `neural-seam connect <projectId>`, or the local dashboard | `/neural-seam:ns-status` |

## Install

```sh
agy plugin install https://github.com/NeuralSeam/neural-seam-antigravity
```

One step: `agy` clones the repository and installs the bundle. To update, uninstall and install again
from the same URL.

```sh
agy plugin list                  # `neural-seam` should be listed
agy plugin disable neural-seam
agy plugin enable  neural-seam
agy plugin uninstall neural-seam
```

`agy` also accepts a `<plugin>@<marketplace>` reference, but it resolves only against marketplaces
already registered in your CLI. The distribution channel for this bundle is the **repository URL**.

### Approving the tools

`agy` asks for approval per tool by default, and this host's bundle format has no permission file, so
the bundle **cannot** declare this for you. To avoid a queue of prompts on first use, allow the
pattern once in `/permissions` inside `agy`:

```
mcp(neural-seam-runtime/*)
```

That is your choice, made in the CLI's own UI. The bundle does not work around the permission system.

### Check the install

Open `agy` in a project folder:

1. `/skills` lists the `ns-*` commands.
2. `/mcp` shows `neural-seam-runtime` connected, with its tools.
3. `/neural-seam:ns-status` answers with the project state.

If the MCP server is missing, run `/neural-seam:ns-doctor`.

## First run

```
/neural-seam:ns-start
```

That is the whole answer to "what do I do now". It reads the state and moves one step: sign in, create
or pick a project, bind it, then stop. Run it again for the next step; re-running only does what is
still missing.

Once you are set up:

```
/neural-seam:ns-generate     # bootstrap the backlog
/neural-seam:ns-list         # pick a card
/neural-seam:ns-exec <id>    # render the implementation prompt for that card
```

The last two are the loop.

## Commands

Commands are invoked **with the plugin namespace**: `/neural-seam:ns-<name>`.

| Command | What it does |
| --- | --- |
| `/neural-seam:ns-status` | Reports the state and the command that comes next. |
| `/neural-seam:ns-start` | Guided: reads the state and advances one step. |
| `/neural-seam:ns-create` | No project yet: shows the setup wizard link. |
| `/neural-seam:ns-connect [<id>]` | Project already exists: binds it to this folder. |
| `/neural-seam:ns-clone <id>` | Clones the project's code only. Idempotent. |
| `/neural-seam:ns-doctor` | Repairs the environment: sign in, language servers, MCP registration. |
| `/neural-seam:ns-generate` | Bootstraps the backlog: generates the artefacts and creates the cards. |
| `/neural-seam:ns-list [status] [kind]` | Lists cards, grouped by status. |
| `/neural-seam:ns-open` | Shows the local dashboard link. |
| `/neural-seam:ns-exec <id>` | Renders the implementation prompt for a card. |
| `/neural-seam:ns-help` | Index of every command above. |

### The namespace is not optional

Measured on 2026-09-05 with `agy` **1.1.27**, comparing both spellings in the `expanded_commands`
field of the `init` event of `agy -p "<text>" --output-format stream-json`:

| Text sent | `expanded_commands` | Effect |
| --- | --- | --- |
| `/neural-seam:ns-help` | `[{"name":"neural-seam:ns-help","type":"skill"}]` | expanded by the CLI as a skill |
| `/ns-help` | absent | **not** expanded: reaches the model as literal text |

The short form produces no visible error, which is exactly why it misleads: the model receives the raw
string, infers what you meant and reads the file on its own. You get a plausible answer without the
command ever having been loaded as one.

All 11 commands were checked the same way in the same session, and all 11 expand as `type: "skill"`.

## What the bundle wires

| Component | File | Effect |
| --- | --- | --- |
| MCP registration | `mcp_config.json` | `neural-seam-runtime` via `neural-seam serve --project-from-cwd`. The server resolves the project from the working directory, so **one** registration serves every project. |
| Commands | `skills/ns-*/SKILL.md` | The 11 commands listed above. |
| Project rule | `rules/neural-seam.md` | Where project truth comes from, that generation is started by you, and that the signed manifest and your credentials are not hand edited. |
| Lifecycle hooks | `hooks.json` | `PreInvocation` and `Stop`, each calling `neural-seam hook <event>` with an explicit 5 second timeout. See [Hooks](#hooks). |

## Hooks

`hooks.json` declares two events, enabled, each with an explicit `timeout` of 5 seconds.

| Event | Command | What it is for |
| --- | --- | --- |
| `PreInvocation` | `neural-seam hook session-start-once` | Stands in for the session open event, which this host does not have. `PreInvocation` fires on **every** model invocation, so the runtime claims the session atomically: the first invocation runs the probe, the rest are no ops. Without a session id in the payload, nothing runs. |
| `Stop` | `neural-seam hook stop` | Queue heuristic for the work loop. |

Both redirect the runtime's output to stderr (`1>&2`): both events read stdout as JSON, and the
runtime also prints a human readable status line there.

**There is deliberately no `PreToolUse` hook.** Earlier versions shipped one. It is the event that
sits between you and your own tool call, and on current CLI versions a hook that fails there **blocks
the call** rather than being skipped, so a missing `neural-seam` binary would have stopped your CLI
from doing things that have nothing to do with Neural Seam. It carried no advisory content on this
host, so it was all downside. The measurements are in
[SECURITY.md](./SECURITY.md#what-the-hooks-were-measured-to-do).

**Do not treat the remaining hooks as a security control.** They are a lifecycle signal, and a
lifecycle signal that fails is a lifecycle signal you lose.

## Compatibility

| This bundle | Antigravity CLI | `neural-seam` runtime |
| --- | --- | --- |
| 0.5.0 and later | hook behaviour measured on 1.1.26 and 1.1.27 | **0.12.0 or later**, which is where `hook session-start-once` was added. `hook stop` shipped with it |
| 0.2.2 and later | invocation form measured on 1.1.13, re-measured on 1.1.27 | any |

The latest published runtime is **0.15.1**. Nothing in this bundle requires a runtime that has not
been released.

The bundle carries no version field, because this host's plugin manifest validates `name` and
`description` and does not read a version. The version of record is the latest entry in
[CHANGELOG.md](./CHANGELOG.md), which is also the base for the release tag.

## Verifying a release

Release tags are signed with SSH. To check one yourself:

```sh
git clone https://github.com/NeuralSeam/neural-seam-antigravity
cd neural-seam-antigravity
git verify-tag <tag>
```

`git verify-tag` reports a name rather than only a key once the public key is in an allowed-signers
file. The fingerprint and the line to paste are published under
[Release signing](./SECURITY.md#release-signing).

## Privacy and security

**The bundle itself collects nothing and sends nothing.** It is markdown and JSON.

The `neural-seam` runtime it points at does move data, and not all of it is optional: signing in,
identifying your machine at sign in, and your project's coordination data are sent whether or not
telemetry is on. Telemetry itself is opt in and off by default. Your source code is read locally.

The full picture, including how to delete each store separately, is in [PRIVACY.md](./PRIVACY.md).
Vulnerability reporting and what this bundle can and cannot do: [SECURITY.md](./SECURITY.md).

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `/skills` does not list `ns-*` | Bundle not installed, or disabled | `agy plugin list`, then `agy plugin enable neural-seam` |
| `/mcp` does not show `neural-seam-runtime` | `neural-seam` not on `PATH` | `neural-seam version`; if that fails, reinstall the runtime and reopen `agy` |
| Approval prompt on every tool call | Per tool approval is this host's default | Allow `mcp(neural-seam-runtime/*)` once in `/permissions` |
| A command answers plausibly but nothing happens | You typed `/ns-<name>` instead of `/neural-seam:ns-<name>` | Use the namespaced form |
| `/neural-seam:ns-status` says you are not signed in | Session expired, or replaced by a newer sign in | `neural-seam login` |
| Anything else | | `/neural-seam:ns-doctor` |

### Known limits of this host

Stated plainly, because these are limits of the CLI rather than gaps in the bundle:

- **No automatic per-path convention advisory.** Neural Seam can tell an agent which conventions apply
  to the file it is about to edit, but this CLI offers no event carrying both the file path **and** a
  channel for adding context: the event that knows the path can only return a permission decision, and
  emitting one just to deliver advice would auto approve calls that were meant to reach you. So you
  get conventions by asking for them (`get_conventions_for_path`), not automatically.
- **No session open event.** The status probe runs on `PreInvocation` instead: on the first thing you
  do in a session rather than when it opens, and not at all if the payload arrives without a session
  id.

## What we commit to

- Neural Seam never authenticates to a model provider, and holds no model provider credentials.
- Every model call is started by you. Nothing here submits work on its own.
- Signing in uses Neural Seam credentials, never your host or model provider account.
- This is an explicit extension. It does not impersonate the Antigravity CLI, does not bundle the
  `neural-seam` binary, and does not replace signing in or binding a project.
- Telemetry is opt in with a declared scope, and off by default.

## Contributing, support and security

- Questions and bugs: [SUPPORT.md](./SUPPORT.md)
- Changes, and how this bundle is kept thin: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Vulnerability reports: [SECURITY.md](./SECURITY.md), please do not open a public issue
- Data handling: [PRIVACY.md](./PRIVACY.md)
- Name and logo: [TRADEMARKS.md](./TRADEMARKS.md)
- Release history: [CHANGELOG.md](./CHANGELOG.md)

## License

MIT, see [LICENSE](./LICENSE). The license covers the content of this repository. It does not grant
rights to the Neural Seam name or logo, see [TRADEMARKS.md](./TRADEMARKS.md).

Should the license ever change, **any version already published under MIT stays under MIT**. A licence
cannot be retracted from a release that was made under it, and we are stating that plainly rather than
leaving you to reason about it: what you already have, you keep, on the terms you received it.

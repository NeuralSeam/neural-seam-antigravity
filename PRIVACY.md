# Privacy

What the **Neural Seam bundle for the Antigravity CLI** does with your data, and what the software it
wires does on your behalf. Scoped to this integration; it is not the Neural Seam service agreement.

## The bundle itself

**It collects nothing, stores nothing and sends nothing.**

This repository is markdown and JSON. Installed, it registers an MCP server, declares two lifecycle
hooks, and adds skills and a project rule to your CLI. It contains no network endpoint, no analytics,
no identifier and no credential. There is nothing in it that can phone home.

Everything below is about the `neural-seam` runtime, the binary on your `PATH` that the bundle points
at, because that is the software that actually moves data.

## What the runtime sends, and when

Some of this is sent because it is how the product works. **Only the last row is optional.**

| Data | Sent | When | Why |
| --- | --- | --- | --- |
| Your sign in, via device flow | Always | When you run `neural-seam login` | To authenticate you |
| Your machine's host name and operating system family (`windows`, `darwin`, `linux`) | Always | At sign in only | So a sign in notice can tell you **which** machine is asking, when your account already has an active session. There is no machine fingerprint; if the host name is unavailable, the field is omitted |
| Your project's coordination data: spec, backlog, cards, status | Always | When you use the product | It is the product: this data is what makes your project's knowledge available to any developer and any agent |
| Telemetry | **Only if you turn it on** | Off by default | Declared scope; security events are enumerated rather than open ended, and no payload carries artifact content or your prompts |

So: signing in, identifying the machine at sign in, and your project's coordination data are sent
whether or not telemetry is enabled. **Turning telemetry off does not make the runtime offline** - it
is a coordination client, and coordination data is what it coordinates with.

The runtime talks to the Neural Seam backend and to nothing else. It never authenticates to a model
provider, holds no model provider credentials, and makes no model calls of its own.

## What stays on your machine

- **Your source code.** Read locally, by language tooling the runtime runs on your machine. Code is
  not uploaded to run the symbolic tools.
- **Your credentials.** See [Where credentials are kept](#where-credentials-are-kept) below.
- **The local dashboard.** Served on loopback (`127.0.0.1`) only, never exposed to the network.
- **Local state**, under `~/.neural-seam/`: configuration, the local project registry, provisioned
  language servers, and session logs.

## What your agent sends

Worth being explicit about, because it is easy to miss: the bundle connects Neural Seam to an agent,
and **that agent has its own privacy behaviour**. Your prompts, and whatever context the agent
gathers, go to whichever model provider your Antigravity CLI is configured to use, under Google's
terms and your provider's terms. Neural Seam is not in that path and cannot see it.

## Where credentials are kept

Credentials are kept in **your operating system's credential store** where the platform provides one
(on Windows, the Credential Manager). Where it does not, they fall back to an owner-only file under
`~/.neural-seam/`. Which of the two applies on your machine decides how you delete them, so the two
are listed separately below.

## Deleting your data

Your data sits in four separate places. Clearing one does not clear the others, so each is listed
with its own step.

**1. The bundle**

```sh
agy plugin uninstall neural-seam
```

**2. Credentials**

```sh
neural-seam logout
```

This clears the stored credentials wherever the runtime put them. **Deleting `~/.neural-seam/` is not
a substitute:** when your platform has a credential store, the credentials are not in that directory
and removing it leaves them behind. If you have already deleted the directory, run `neural-seam
logout` as well - or remove the entry by hand from your platform's credential store.

**3. Local files**

Deleting `~/.neural-seam/` removes what the runtime wrote under it: configuration, the local project
registry, session logs, and the language servers it provisioned into `servers/`. If you set
`NEURAL_SEAM_HOME`, that is the directory to delete instead.

Two limits, stated rather than glossed:

- **A language server you installed yourself is not touched.** The runtime prefers one it provisioned
  and otherwise falls back to whatever is on your `PATH`; that copy is yours and stays.
- **The package managers used to fetch a provisioned server keep their own caches** (npm, pip and the
  Go toolchain each cache outside this directory). The runtime does not manage those caches and this
  step does not clear them. Remove them with the tool that created them.

This is why the step is described as removing the contents of that directory rather than as removing
"everything".

**4. Your account and project data held by the service**

Not on your machine, so none of the above touches it. Use the support form at
<https://app.neuralseam.cloud>.

## Changes

Material changes to this page are noted in [CHANGELOG.md](./CHANGELOG.md). Questions:
<https://app.neuralseam.cloud>.

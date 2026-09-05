# Support

## Before opening anything

Most problems with this bundle are one of five things. [The troubleshooting table in the
README](./README.md#troubleshooting) covers them, and this order resolves them fastest:

1. `agy plugin list` shows `neural-seam`, and it is enabled.
2. `neural-seam version` answers, so the binary is on your `PATH`.
3. `/mcp` inside `agy` shows `neural-seam-runtime` connected.
4. You typed the command **with** the namespace: `/neural-seam:ns-status`, not `/ns-status`. The short
   form fails silently, and the model will answer plausibly anyway.
5. `/neural-seam:ns-doctor`.

## Where to go

| What you have | Where it goes |
| --- | --- |
| A bug in this bundle: wrong command, broken skill, wrong or outdated documentation | [Open an issue](https://github.com/NeuralSeam/neural-seam-antigravity/issues) on this repository |
| An idea for this bundle | [Open an issue](https://github.com/NeuralSeam/neural-seam-antigravity/issues) using the feature request template |
| A security vulnerability | [SECURITY.md](./SECURITY.md). **Not** a public issue |
| A question about your account, plan, projects or data | The support form at <https://app.neuralseam.cloud> |
| A problem in the `neural-seam` runtime, the backend or the web app | The support form at <https://app.neuralseam.cloud> |
| A problem in the Antigravity CLI itself | Google's own channels |

Issues on this repository are read by the maintainers of the bundle. They are not an account support
channel, and they are public: do not paste tokens, project identifiers you consider private, or source
code you cannot share.

## What to include in an issue

The versions are what we ask for first, every time, so it saves a round trip to include them:

```
agy --version
neural-seam version
```

plus this bundle's version, which is the latest entry in [CHANGELOG.md](./CHANGELOG.md), and your
operating system.

Then: what you ran, what happened, and what you expected. If a skill misbehaved, name it and quote the
exact text you typed, including the namespace.

## Response expectations

This is a young project. Issues are triaged on a best effort basis, and there is no support SLA on this
repository. Security reports are the exception and have stated targets in [SECURITY.md](./SECURITY.md).

# Security Policy

## Reporting a vulnerability

**Please do not open a public issue for a security problem.**

Report it privately through GitHub's private vulnerability reporting on this repository:
**Security > Report a vulnerability**
(<https://github.com/NeuralSeam/neural-seam-antigravity/security/advisories/new>).

If private reporting is unavailable to you, use the in-product support form at
<https://app.neuralseam.cloud> and mark the request as a security issue. Do not include working
exploit code or credentials in that form; say that you have them and we will arrange a private
channel.

Please include, as far as you can:

- what an attacker gains, and what access they need to start;
- the versions involved (this bundle's version from [CHANGELOG.md](./CHANGELOG.md), plus
  `agy --version` and `neural-seam version`);
- the smallest reproduction you have.

We aim to acknowledge a report within **5 business days** and to give you an assessment and a plan
within **15 business days**. Please give us reasonable time to ship a fix before disclosing publicly.
We will credit you in the release notes unless you ask us not to.

## Scope

This repository is **content only**: markdown and JSON. It contains no compiled code and executes
nothing on its own. What it does is wire your Antigravity CLI to software that runs on your machine,
so the security surface it owns is the wiring itself.

**In scope for this repository:**

- The MCP server registration in `mcp_config.json`.
- The lifecycle hook commands in `hooks.json`.
- Instructions in `skills/` or `rules/` that would lead an agent to leak secrets, weaken a permission
  boundary, or take a destructive action without the developer asking for it.
- Anything in this repository or its history that should not be public.

**Out of scope here, but still wanted:** vulnerabilities in the `neural-seam` runtime, the Neural Seam
backend, or the web applications. Report those through the same private channel; they will be routed
to the right component. Vulnerabilities in the Antigravity CLI itself belong to Google.

## What this bundle can and cannot do

Worth knowing before assessing a report.

- The bundle **cannot grant itself permissions**. This host approves MCP tools per tool by default,
  and its bundle format has no permission file. Approving `mcp(neural-seam-runtime/*)` is an action
  you take in the CLI's own UI.
- The bundle **holds no credentials**. It contains no tokens and no endpoints beyond the local
  `neural-seam` binary name. See [PRIVACY.md](./PRIVACY.md) for where credentials are kept.
- Everything the bundle references is the `neural-seam` binary resolved from your `PATH`. **A hostile
  binary earlier in your `PATH` would be invoked instead.** That is a property of `PATH` resolution;
  the mitigation is to install the runtime from the official installer and check `neural-seam
  version`.
- The hooks are **not a security control** and must not be treated as one. See below.

### What the hooks were measured to do

Measured on **2026-09-05** with `agy` **1.1.26**, and re-run unchanged on **1.1.27**, on Windows. Method: install this bundle, replace the
declared hook command with a controlled one, then ask the CLI to run a shell command with
`agy -p "<text>" --dangerously-skip-permissions --output-format stream-json`, and read the terminal
state of the resulting tool step out of the event stream.

`PreToolUse`, the event that gates a tool call:

| The hook | The developer's tool call |
| --- | --- |
| Runs, exits 0, writes nothing | **runs** |
| Exits non-zero | **blocked** |
| Command not found on `PATH` | **blocked** |
| Exceeds its declared `timeout` | **blocked** |
| Exits 0 but writes something that is not JSON | **blocked** (the CLI reports a parse error) |
| Exits 0 and writes `{}` | **denied** (the CLI reports the call as denied by the hook) |

`PreInvocation` and `Stop`, the two events this bundle actually declares. Each case was run with
both hooks replaced by the failing command, against a prompt whose answer proves the session ran:

| The hook | The session |
| --- | --- |
| Command not found on `PATH` | **ran**: answered normally, no error step |
| Exits non-zero | **ran**: answered normally, no error step |
| Exceeds its declared `timeout` | **ran**: answered normally, cut off at the declared timeout |
| Exits 0 but writes something that is not JSON | **ran**: answered normally, no error step |

The declared `timeout` is what bounds the third row, and the difference is measurable. Same prompt,
same machine, three runs:

| Hooks | Wall clock |
| --- | --- |
| The two this bundle ships | 6s |
| `sleep 60`, with `timeout: 5` declared | 17s |
| `sleep 60`, with **no** `timeout` declared | 72s |

Roughly five seconds per hook when the timeout is declared, and the better part of a minute per hook
when it is not. That is why both declare one.

**This is the opposite of what earlier versions of this document said**, and the difference is the CLI,
not the bundle. On `agy` 1.1.10 a failing pre-tool hook was logged and the tool call ran anyway. On
1.1.26 it blocks. We had generalised one measurement into "a hook cannot block your CLI"; it could,
and now it does.

Two things follow, and both are shipped in 0.5.0:

1. **The bundle no longer declares a `PreToolUse` hook.** It was the only one that could stand between
   you and your own CLI, and on this host it carries no advisory content, so the trade was all
   downside. Nothing else in the bundle depends on it.
2. **The remaining hooks declare an explicit `timeout`.** Without one the CLI applies a default that
   is not part of any contract: a hook hanging for 60 seconds was cut off at roughly 5 seconds when
   the timeout was declared, and took far longer when it was not.

What is **not** claimed: that a hook can never interfere. It is a process the CLI runs before doing
what you asked, on a host whose behaviour here has already changed once between releases. The two
hooks that remain were measured to fail open **in the four failure modes tabled above**, on this CLI
version, on this platform. Modes we did not try, versions we did not run and platforms we did not test
are not covered, and this document does not extend to them. That is the whole of the evidence.

## Release signing

Release tags are signed with SSH. Verify one yourself:

```sh
git clone https://github.com/NeuralSeam/neural-seam-antigravity
cd neural-seam-antigravity
git verify-tag <tag>
```

The public key:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINj1X4nyMhJwo4xO+A/nJzBU/5XWq5A6WT+WIQMGy2aD
```

Fingerprint: `SHA256:j9LD61vbZM+BNx2s+solZAnxdu1kSWEbIP8KE/K+DuA` (ED25519).

To have `git` name the signer instead of only reporting a key, put it in an allowed-signers file:

```sh
echo 'caio.souza.s@gmail.com namespaces="git" ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINj1X4nyMhJwo4xO+A/nJzBU/5XWq5A6WT+WIQMGy2aD' \
  >> ~/.config/git/allowed_signers
git config gpg.ssh.allowedSignersFile ~/.config/git/allowed_signers
git verify-tag <tag>
```

**Known gap, stated rather than hidden:** GitHub's web UI and API currently report these tags as
unverified, with reason `unknown_key`, because the key above is not yet registered as a signing key on
the account that publishes them. The signature itself is valid and `git verify-tag` confirms it
locally with the key above. Until that registration happens, **trust the local check, not the badge**.
Only the private key can produce these signatures, and the private key is never published.

## Supported versions

Only the latest published version receives fixes. Versions are listed in
[CHANGELOG.md](./CHANGELOG.md). To update: `agy plugin uninstall neural-seam`, then install again from
the repository URL.

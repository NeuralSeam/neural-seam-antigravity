---
trigger: always_on
description: Project coordinated by Neural Seam - the source of truth is served over MCP, generation is started by the developer, and the manifest and credentials are not edited by hand.
---

# Neural Seam (project coordinated by the runtime)

Rule loaded by the `neural-seam` bundle. It applies when the working directory has a Neural Seam
project bound to it (`.neural-seam/manifest.json` present).

## The project's source of truth

- The project's spec, glossary, backlog, cards and per-path conventions live in Neural Seam and are
  served by the tools of the `neural-seam-runtime` MCP server. Prefer asking those tools to rebuilding
  the context from scratch: `check_setup` for the state, `list_activities` for the cards,
  `get_conventions_for_path` for the conventions of the path you are about to edit, `load_context`.
- The `neural-seam` binary on `PATH` is the only client. Do not invent another installation path, and
  do not try to sign in on the developer's behalf.

## Generation starts with the developer

- Prompts handed back by a tool (artefacts, backlog, a card's implementation) are **presented** to the
  developer for review and run only after explicit confirmation. Never submit a generation just
  because a tool returned a prompt.
- A write beyond what the card asks for (commit, push, switching branch) needs the developer to ask
  for it.

## State that is not edited by hand

- `.neural-seam/manifest.json` is signed. Do not edit it, do not regenerate it and do not copy it
  between projects. To bind or rebind, use `neural-seam connect` or the local dashboard.
- Credentials are kept in the operating system's credential store where there is one, otherwise in an
  owner-only file under `~/.neural-seam/`. Never read, print or commit them.

---
name: ns-clone
description: "Neural Seam: clones ONLY the project's code (idempotent; if the repository is already there it pulls instead). Binding is a separate step and belongs to /neural-seam:ns-connect. Activate when the developer wants to download the code of a Neural Seam project, or asks for /neural-seam:ns-clone."
---

# /neural-seam:ns-clone

Skill managed by Neural Seam. Fetches **only the code** of a project. Binding is a separate step and
belongs to `/neural-seam:ns-connect`. Idempotent: if the repository is already there it pulls instead
of cloning again.

The developer supplies the `<projectId>` with the command.

## Act now

1. If no `<projectId>` came with the command, ask for it (or run `/neural-seam:ns-status` to see where
   things stand) and stop.
2. Run `neural-seam clone <projectId>` in the terminal. Show what it reports, including when it says
   the code was already present.
3. If it fails on sign in or network, show the message and suggest `neural-seam login` or
   `/neural-seam:ns-doctor`.
4. When it finishes, suggest `/neural-seam:ns-status`, and once that reports the project is ready,
   `/neural-seam:ns-list`.

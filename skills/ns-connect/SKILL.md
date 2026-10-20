---
name: ns-connect
description: "Neural Seam: binds an existing project to this directory, without cloning any code. Activate when the developer says the project already exists and wants it linked to this folder, or asks for /neural-seam:ns-connect."
---

# /neural-seam:ns-connect

Skill managed by Neural Seam. For a project that **already exists** in Neural Seam and needs to be
bound to this directory. It binds only; for the code alone use `/neural-seam:ns-clone`.

If the developer passed a `<projectId>` with the command, keep it for step 3.

## Act now

1. If the developer supplied a `<projectId>`, go to step 3. Otherwise call the `check_setup` tool of
   the `neural-seam-runtime` MCP server.
2. **Find the identifier.** Present the `message` and any URL the response carries **exactly as
   returned** - never build it, never assume a port. The URL opens the Neural Seam web app, where the
   developer finds the project identifier. Nothing is bound from the browser: wait for the developer
   to give you the identifier.
3. **Bind from the terminal.** Run `neural-seam connect <projectId>`. It fetches the signed manifest,
   verifies the signature and binds this directory.
4. If the response says there is nothing to bind yet, send them to `/neural-seam:ns-create`. If it
   says the directory is already bound, suggest `/neural-seam:ns-list`.
5. Close with the next step: **once bound, run `/neural-seam:ns-status`**, then
   `/neural-seam:ns-generate`, or `/neural-seam:ns-clone <id>` if the code is still missing.

If anything fails on sign in or network, show the message and suggest `neural-seam login` or
`/neural-seam:ns-doctor`.

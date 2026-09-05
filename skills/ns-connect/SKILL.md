---
name: ns-connect
description: "Neural Seam: binds an existing project to this directory, without cloning any code. Activate when the developer says the project already exists and wants it linked to this folder, or asks for /neural-seam:ns-connect."
---

# /neural-seam:ns-connect

Skill managed by Neural Seam. For a project that **already exists** in Neural Seam and needs to be
bound to this directory. It binds only; for the code alone use `/neural-seam:ns-clone`.

If the developer passed a `<projectId>` with the command, keep it for step 3.

## Act now

1. Call the `check_setup` tool of the `neural-seam-runtime` MCP server.
2. **Guided path, with no id to type.** If the response carries a URL for binding, present it
   **exactly as returned** - never build it, never assume a port. The developer picks the project
   there, and binding writes the manifest into this directory. Say plainly that no id has to be typed.
3. **Headless fallback.** If the bridge is not reachable and the developer supplied a `<projectId>`,
   run `neural-seam connect <projectId>` in the terminal. It fetches the signed manifest, verifies the
   signature and binds this directory.
4. If the response says there is nothing to bind yet, send them to `/neural-seam:ns-create`. If it
   says the directory is already bound, suggest `/neural-seam:ns-list`.
5. Close with the next step: **once bound, run `/neural-seam:ns-status`**, then
   `/neural-seam:ns-generate`, or `/neural-seam:ns-clone <id>` if the code is still missing.

If anything fails on sign in or network, show the message and suggest `neural-seam login` or
`/neural-seam:ns-doctor`.

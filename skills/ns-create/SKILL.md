---
name: ns-create
description: "Neural Seam: the project does not exist yet. Shows the link the runtime returns for the setup wizard so the developer can create it. Activate when the developer wants to create a new Neural Seam project, or asks for /neural-seam:ns-create."
---

# /neural-seam:ns-create

Skill managed by Neural Seam. Takes the developer to the door of the setup wizard. It does not create
the project for them: creating it is something the developer does in the browser, and this skill waits.

## Act now

1. Call the `check_setup` tool of the `neural-seam-runtime` MCP server.
2. Present the `message` it returned and the setup URL from the response, **exactly as returned**.
   Never build the URL and never assume a port. Ask the developer to open it and create the project
   there; creating it is what binds a project to this directory.
3. If the response says a project is already set up, or that one exists and only needs binding, say so
   and point at `/neural-seam:ns-status` - there is nothing to create.
4. Close with the next step: **once it is created, run `/neural-seam:ns-status`**, then
   `/neural-seam:ns-generate`.

If `check_setup` returns an `error`, point at `/neural-seam:ns-doctor`.

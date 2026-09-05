---
name: ns-generate
description: "Neural Seam: bootstraps the backlog of a connected project. Presents the generation prompt the runtime returns, waits for the developer to confirm, then persists the result and creates the cards. Activate when the project is ready and has work waiting, when the developer wants to generate the initial backlog or artefacts, or asks for /neural-seam:ns-generate."
---

# /neural-seam:ns-generate

Skill managed by Neural Seam. Bootstraps the backlog of a project that is already set up: the runtime
hands back the prompt for the work that is waiting, the developer decides, and the result is saved back.

Nothing is submitted on its own. You present the prompt; the developer chooses to generate.

## Act now

1. Call the `next_job` tool of the `neural-seam-runtime` MCP server. It returns the prompt for the work
   that is waiting.
   - If it comes back saying the work is held up by something else, show what is holding it and stop.
   - If it says the project is not ready, redirect to `/neural-seam:ns-start`.
2. Present that prompt and **wait for the developer's explicit confirmation**. Generate nothing before
   it.
3. Once confirmed, follow the prompt as written. It is composed by the runtime for this project and
   already carries everything that applies to it, including any extra steps for a directory that
   already had code in it. Do not add rules of your own on top.
4. Save the result with the `save_insumos` tool, then create one card per backlog item with
   `create_activity`. Both tools declare the fields they expect; take the field names and the allowed
   values from the tool descriptions rather than from this file.
5. Report what was saved and which cards were created. Close by suggesting `/neural-seam:ns-list` and
   `/neural-seam:ns-exec <id>`.

If a tool returns an `error` (network or sign in), stop and point at `neural-seam login` or
`/neural-seam:ns-doctor`.

## What this skill does not do

It does not decide **what** gets generated, in what shape, or under which conditions. That is the
runtime's prompt to compose and this skill's job to present. Keeping a second copy of those rules here
is how the two drift apart, and the copy in the plugin is the one nobody updates.

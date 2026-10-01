---
name: ns-generate
description: "Neural Seam: bootstraps the backlog of a connected project. Presents the generation prompt the runtime returns, waits for the developer to confirm, then persists the result and creates the cards. Can also regenerate a backlog it generated before. Activate when the project is ready and has work waiting, when the developer wants to generate the initial backlog or artefacts, wants to regenerate the backlog, or asks for /neural-seam:ns-generate."
---

# /neural-seam:ns-generate

Skill managed by Neural Seam. Bootstraps the backlog of a project that is already set up: the runtime
hands back the prompt for the work that is waiting, the developer decides, and the result is saved back.
When a previous generation left cards that nobody has started, it can also regenerate: delete those
cards and generate a new batch.

Nothing is submitted or deleted on its own. You present; the developer chooses.

## Act now

1. Look for a backlog generated before. Call the `delete_activities` tool of the `neural-seam-runtime`
   MCP server with `tag: "generated"`, `status: "BACKLOG"` and `dry_run: true`. A dry run deletes
   nothing: it only lists the cards that match.
   - If the list is empty, go to step 2. The skill then behaves exactly as a first generation.
   - If cards are listed, show every one of them (title, id, board, status) without summarising or
     dropping any, and ask whether to **regenerate** (delete those cards and generate a new batch) or
     **keep** them and continue. Do nothing until they choose.
   - If they choose to regenerate, wait for their explicit confirmation of that list, then call
     `delete_activities` again with `dry_run: false` and the `confirm_token` the dry run returned.
     If the tool refuses, present the refusal as it came back and follow what the tool says; do not
     work around it.
   - Only cards tagged `generated` and still in `BACKLOG` are ever in this list. Cards created by
     hand, or already picked up, are never deleted here.
   - If the `delete_activities` tool is not available, the installed runtime predates it. Say so,
     point at `/neural-seam:ns-doctor` to update it, and continue without offering to regenerate.
     Never delete the cards one by one instead.
2. Call the `next_job` tool of the `neural-seam-runtime` MCP server. It returns the prompt for the work
   that is waiting.
   - If it comes back saying the work is held up by something else, show what is holding it and stop.
   - If it says the project is not ready, redirect to `/neural-seam:ns-start`.
3. Present that prompt and **wait for the developer's explicit confirmation**. Generate nothing before
   it.
4. Once confirmed, follow the prompt as written. It is composed by the runtime for this project and
   already carries everything that applies to it, including any extra steps for a directory that
   already had code in it. Do not add rules of your own on top.
5. Save the result with the `save_insumos` tool. It creates the backlog cards itself, so do not create
   the same cards again with `create_activity`. The tool declares the fields it expects; take the field
   names and the allowed values from its description rather than from this file.
6. Report what was deleted (when you regenerated), what was saved and which cards were created. Close by suggesting `/neural-seam:ns-list` and
   `/neural-seam:ns-exec <id>`.

If a tool returns an `error` (network or sign in), stop and point at `neural-seam login` or
`/neural-seam:ns-doctor`.

## What this skill does not do

It does not decide **what** gets generated, in what shape, or under which conditions, and it does not
decide which cards a deletion may touch beyond the filter above: the dry run, the token and their
refusals belong to `delete_activities`. That is the
runtime's prompt to compose and this skill's job to present. Keeping a second copy of those rules here
is how the two drift apart, and the copy in the plugin is the one nobody updates.

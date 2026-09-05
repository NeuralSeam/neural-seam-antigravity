---
name: ns-exec
description: "Neural Seam: prepares the implementation of a card. Renders the card's prompt for the developer to review before anything runs; it never submits on its own. Activate when the developer wants to implement or work on a card by id, or asks for /neural-seam:ns-exec."
---

# /neural-seam:ns-exec

Skill managed by Neural Seam. Prepares the implementation of a card: the runtime returns the prompt for
that card, and you present it. **Nothing is submitted automatically** - the work starts when the
developer confirms.

The developer supplies the card's `<activity_id>` with the command.

## Act now

1. If no `<activity_id>` came with the command, **do not fail for the missing id**: run
   `/neural-seam:ns-list` first, help the developer pick a card, and stop until you have the id.
2. Call the `exec_activity` tool of the `neural-seam-runtime` MCP server with the id.
3. Present the prompt it returns and **wait for confirmation**. Once confirmed, carry out the work as
   the prompt describes: edit the code, run the project's verification, commit the way the project
   asks.
4. Report the result and suggest `/neural-seam:ns-list` to see what is left. Moving the card on is the
   developer's call: offer `update_activity_status` rather than writing without being asked.

If `exec_activity` returns an `error` (network or sign in), or the project is not bound, point at
`/neural-seam:ns-status`.

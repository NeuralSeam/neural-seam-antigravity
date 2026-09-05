---
name: ns-list
description: "Neural Seam: lists the cards of the connected project, grouped by status, with the id ready to paste. Accepts an optional status and kind filter. Activate when the developer asks what there is to do, wants to see the cards or the backlog, or asks for /neural-seam:ns-list."
---

# /neural-seam:ns-list

Skill managed by Neural Seam. Lists the cards of the bound project. Read-only.

The developer may pass a status filter and a kind filter with the command. The `list_activities` tool
declares which values it accepts; take them from there rather than from this file.

## Act now

1. Call the `list_activities` tool of the `neural-seam-runtime` MCP server, forwarding any filters the
   developer passed.
2. Present the cards **grouped by status**. For each one show the `id` ready to paste, its kind, its
   title, and what is blocking it when the response says something is.
3. Close by naming the next step: **`/neural-seam:ns-exec <id>`** to implement a card, or
   `/neural-seam:ns-open` to inspect it in the dashboard.

If `list_activities` returns an `error` (network or sign in), or the project is not bound, point at
`/neural-seam:ns-status`.

---
name: ns-open
description: "Neural Seam: shows the link to the dashboard of the Neural Seam web app. Activate when the developer wants to open the dashboard, the board or the Neural Seam UI, or asks for /neural-seam:ns-open."
---

# /neural-seam:ns-open

Skill managed by Neural Seam. Hands the developer the link to the dashboard of the Neural Seam web app
to open in a browser. The runtime returns the link rather than opening a browser itself, so nothing is
launched behind the developer's back.

## Act now

1. Call the `open_dashboard` tool of the `neural-seam-runtime` MCP server. It returns the address of
   the dashboard.
2. Present that address **exactly as returned**. Never build the URL and never assume a port. Ask the
   developer to open it.
3. If the call returns an `error`, show it as it came and point at `/neural-seam:ns-doctor`.
4. Close by suggesting `/neural-seam:ns-list` as the terminal-only alternative.

---
name: ns-open
description: "Neural Seam: shows the link to the local dashboard, already scoped to the project bound to this directory. Activate when the developer wants to open the dashboard, the board or the Neural Seam UI, or asks for /neural-seam:ns-open."
---

# /neural-seam:ns-open

Skill managed by Neural Seam. Hands the developer the local dashboard link to open in a browser. The
runtime returns the link rather than opening a browser itself, so nothing is launched behind the
developer's back.

## Act now

1. Call the `open_dashboard` tool of the `neural-seam-runtime` MCP server. It returns the address the
   dashboard is being served on.
2. Present that address **exactly as returned**. Never build the URL and never assume a port. Ask the
   developer to open it. Because the server resolves the project from the working directory, the page
   already opens scoped to the project bound here - there is no id to paste.
3. If the answer says nothing is being served, tell them to start the runtime (or the `neural-seam
   tray` desktop app) and, if that does not help, `/neural-seam:ns-doctor`.
4. Close by suggesting `/neural-seam:ns-list` as the terminal-only alternative.

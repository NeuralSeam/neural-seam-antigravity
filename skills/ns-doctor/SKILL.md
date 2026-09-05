---
name: ns-doctor
description: "Neural Seam: diagnoses and repairs the environment (sign in, language servers, project registration) with `neural-seam doctor --fix`, then checks that the neural-seam-runtime MCP server is reachable. Activate when Neural Seam tools fail, when the MCP server does not show up, on sign in or network errors, or when the developer asks for /neural-seam:ns-doctor."
---

# /neural-seam:ns-doctor

Skill managed by Neural Seam. Repairs the environment, then checks that the runtime is reachable as an
MCP server.

## Act now

1. Run `neural-seam doctor --fix` in the terminal and show the output. It repairs sign in, language
   servers and the project registration, then re-checks the result.
2. Make sure the binary is current: `neural-seam version`, and `neural-seam upgrade` if a newer release
   exists.
3. If the `neural-seam-runtime` server does not appear in `agy`, check in this order:
   - `neural-seam version` answers, so the binary is on `PATH`;
   - the bundle is installed and enabled (`agy plugin list`);
   - the server shows up under `/mcp` inside `agy`.

   With this bundle installed the registration comes from the bundle itself, so no project needs its
   own MCP configuration.
4. If the tools do appear but every call asks for approval, tell the developer to allow the
   `mcp(neural-seam-runtime/*)` pattern under `/permissions`. The bundle declares no permissions, and
   this host asks per tool by default.
5. Summarise what was fixed and what still needs the developer to act.

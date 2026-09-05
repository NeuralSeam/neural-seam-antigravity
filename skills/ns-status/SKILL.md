---
name: ns-status
description: "Neural Seam: read-only compass for the project. Reports the state the runtime returns and the command that comes next. Activate when the developer asks where Neural Seam stands, whether the project is connected, why the neural-seam-runtime tools are not answering, or asks for /neural-seam:ns-status."
---

# /neural-seam:ns-status

Skill managed by Neural Seam. It reads and reports. It changes nothing.

## Act now

1. Call the `check_setup` tool of the `neural-seam-runtime` MCP server, with no arguments.
2. Report what it returned, without reinterpreting it:
   - the `status`, as the state;
   - the `message`, which the runtime writes for the developer and which already names the step that
     comes next;
   - any URL in the response, **exactly as returned**. Never build a URL and never assume a port: the
     runtime serves on the address it reports, and that address is not fixed.
   - when the state is `ok`, the project's name, and whether there is work waiting.
3. If the response points at something one of the commands in `/neural-seam:ns-help` does, name that
   command. Then stop.

If the response carries an `error` (network or sign in), show it and point at `/neural-seam:ns-doctor`
rather than carrying on.

To be walked through the next step instead of only told about it, use `/neural-seam:ns-start`.

## What this skill does not do

It keeps no list of the product's states and no table of what follows what. The runtime owns the flow
and returns a message written for the developer; this skill presents it. A state this file has never
seen is reported the same way as any other, from the `message` that came with it.

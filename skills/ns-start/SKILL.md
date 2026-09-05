---
name: ns-start
description: "Neural Seam: guided onboarding. Reads the project state from the runtime and advances one step at a time (sign in, create or pick a project, bind it, bootstrap the backlog) without redoing what is already done. Activate when the developer does not know which Neural Seam command to use, asks to start or set up the project, or asks for /neural-seam:ns-start."
---

# /neural-seam:ns-start

Skill managed by Neural Seam. The guided front door: it asks the runtime where the project stands and
helps the developer take the next step. Run it as often as you like - it only ever does what is left.

## Act now

1. Call the `check_setup` tool of the `neural-seam-runtime` MCP server.
2. Take the next step **from the response**, not from a script in this file:
   - present the `message` the runtime returned, and any URL it carries, **exactly as returned**.
     Never build a URL and never assume a port.
   - when the step belongs to the developer (signing in, creating or picking a project in the browser,
     running a command in the terminal), hand it over and **stop there**. Wait for the developer's
     explicit confirmation before going further.
   - when the step matches one of the commands in `/neural-seam:ns-help`, name that command.
3. After the developer confirms the step is done, call `check_setup` again and repeat from 2.
4. Once the state is `ok`: if the response says there is work waiting, offer `/neural-seam:ns-generate`
   to bootstrap the backlog. Otherwise suggest `/neural-seam:ns-list` to see the cards and
   `/neural-seam:ns-exec <id>` to implement one. Offer it - do not start a generation yourself.
5. Close each step in one line: **"did X -> next: ..."**.

If a call returns an `error` (network or sign in), stop and point at `neural-seam login` or
`/neural-seam:ns-doctor`.

## What this skill does not do

- It keeps **no table of states and transitions**. The runtime owns the product's flow and returns a
  message written for the developer; this skill presents it. A state this file has never seen is
  handled like any other.
- It does not decide that a piece of work is finished. Moving or closing a card is the developer's
  call, made from `/neural-seam:ns-list` using the identifier the runtime returned.
- It builds no URLs and assumes no port.

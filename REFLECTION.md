# Reflection — AI-Assisted Development of FuelEU Maritime Platform

## What I learned using AI agents in a hexagonal architecture context

Using Cursor to build a system with strict hexagonal boundaries taught me that AI agents follow architectural rules reliably when the constraints are stated explicitly upfront — such as "zero framework imports in core/." I found that the ports-and-adapters pattern actually makes AI-assisted development easier, because each layer has a clear contract the agent can implement against without needing global context. The most valuable insight was that providing interface definitions first and implementations second mirrors how the agent reasons about code, leading to fewer errors at integration time.

## Efficiency gains vs manual coding

Generating the four PostgreSQL repository classes took approximately 4 minutes with Cursor Composer versus an estimated 2 hours manually. The biggest gain was TypeScript interface scaffolding — all port interfaces (inbound and outbound) were generated correctly on first attempt and required no manual correction. End-to-end, the full backend (domain, use-cases, repositories, Express routers, migrations, seed data) was implemented in roughly 30 minutes of agent interaction, compared to what I estimate would have been 8–10 hours of manual coding. Frontend component generation was similarly fast: the four tab components with hooks, context wiring, and TailwindCSS styling were produced in under 20 minutes.

## Where AI required the most correction

The agent initially placed a direct `app.listen()` call in the server entry point, which caused port conflicts during integration testing — I had to guide it to add the `require.main === module` guard. On the frontend, it attempted to import the backend's `validatePool` domain function directly into the React component, which violated the hexagonal boundary between packages; the fix was to implement a local validation helper that mirrors the backend logic. The compliance balance formula's sign convention (positive = surplus, negative = deficit) needed explicit clarification to avoid a subtle inversion. The pool enforcement rule (aggregate CB ≥ 0 and at least 2 members) required a second pass to get the client-side validation messaging to match the backend's behavior exactly.

## What I would do differently next time

I would provide the complete domain model, all FuelEU formulas, and the full API contract in a single context document before writing any code, so the agent has the entire specification from the start rather than receiving it piecemeal per phase. I would also define the test cases alongside the requirements — not after implementation — so the agent can use them as acceptance criteria while generating code. Finally, I would establish a `.cursor/rules` file with the architectural constraints (no framework imports in core, parameterized SQL only, etc.) so they are enforced automatically on every prompt rather than repeated manually.

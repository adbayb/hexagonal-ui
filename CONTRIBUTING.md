# Contributing

Thanks for showing interest to contribute to `hexagonal-ui` 🥳.
We are open to contributions, we look forward to improving it with your help!

Here you will find guidelines that will help you to know how to contribute to this repository.
It can be about reporting an issue, proposing a bug fix, adding some features, and even more...

## 🥇 Your first contribution

1. Fork the repository and clone your fork.
2. Install the toolchain: `pnpm@11` with Node `>=24` (see `.nvmrc`), then run `pnpm install`.
3. Create a branch from `main` and make your change.
4. Validate locally with `pnpm check`, `pnpm test`, and `pnpm build`.
5. Open a pull request against `main` and describe the behavior change with a changeset (`pnpm changeset`) when it affects a published package.

## 🗂️ Conventions

- TypeScript with tabs, double quotes, and trailing commas (enforced by `pnpm check` via ESLint and Prettier).
- JSDoc on every exported function and type, with `@param`, `@returns`, and `@example` where applicable.
- Pattern factories stay framework-free: no DOM access in `@hexagonal-ui/core`, only typed ports (`state`, `computed`, `effect`, `ref`, `lifecycle`).
- Tests use `vitest run` with the in-memory mock ports from `libraries/core/src/shared/mockPorts.ts`; no JSDOM required for core logic.
- Conventional Commits for commit messages; changesets for versioning published packages.

## 👨‍🍳 Recipes

### How to add a new pattern?

1. Create `libraries/core/src/useXxx/useXxx.ts` plus `index.ts`, following an existing pattern (e.g. `useListbox`).
2. Declare only the ports the pattern needs via `PatternFactory<Input, Output, Pick<FrameworkPort, "...">>`.
3. Cover behavior with mock-port tests in `libraries/core/src/patterns.test.ts`.
4. Wire one-line hooks in `libraries/{react,solid,vue}/src/useXxx.ts`, re-export types from each adapter index, and add a demo section to the three example apps.
5. Run `pnpm check`, `pnpm test`, and `pnpm build` before opening a pull request.

### How to add a framework adapter?

1. Implement the five ports in `libraries/<name>/src/adapters.ts` and export it as `frameworkAdapter`.
2. Re-export every `createUseXxx` factory bound to the adapter, plus the shared input/output types.
3. Add a smoke test asserting the port surface and a demo app under `examples/<name>`.

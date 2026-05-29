# Architecture Audit

> **Audited by:** GitHub Copilot (Claude Sonnet 4.6)
> **Date:** May 30, 2026

## Overview

`hexagonal-ui` applies **Hexagonal Architecture (Ports & Adapters)** to a UI component library. The core never imports any framework — it defines behavior through typed ports (`StateOutputPort`, `LifecycleOutputPort`). Each framework adapter (React, Solid, Vue) wires in its own reactive primitives and returns a ready-to-use hook.

```
┌────────────────────────────────────────────┐
│                   CORE                     │
│  View ← Element (Button) ← Pattern        │
│         (PatternFactory + Ports)           │
└──────────────┬─────────────────────────────┘
               │ PatternFactory(outputPorts)
    ┌──────────┼──────────┐
    ▼          ▼          ▼
 @react     @solid      @vue
(adapter)  (adapter)  (adapter)
```

---

## Strengths

**1. True framework independence.**
`@hexagonal-ui/core` has zero runtime dependencies. This is the hardest part to get right and it is done correctly.

**2. Port design matches the reactive primitive shape.**
`State<V> = () => V` (a getter function) works uniformly across React closures, Solid signals, and Vue refs. The `StateOutputPort` returns `[getter, setter]`, which maps directly to `createSignal`, `useState`, and `ref`.

**3. `PatternOutputDto` splits stateful vs stateless.**
Stateful properties (state getters) are inlined for granular access; stateless props are namespaced under `props` for easy spreading onto DOM elements. This is genuinely ergonomic.

**4. Solid adapter proves the model is sound.**
Solid's `createSignal`, `onMount`, `onCleanup` map 1:1 to ports — the adapter is 5 lines with no wrappers. When the simplest adapter requires no translation layer, the ports are well designed.

**5. Monorepo with proper dependency graph.**
Turborepo task ordering (`^build` dependency), workspace protocol, and `sideEffects: false` are all production-ready.

---

## Weaknesses

**1. `View.role` is too narrow and semantically conflated.**

```ts
// Current: hardcoded union
type View<Role extends "button" | "link", ...>
```

Every new element type requires editing this union. More critically, it conflates the HTML _element role_ (what element to render) with the ARIA _role attribute_ (accessibility semantics). A `<div role="button">` and `<button>` are different use cases.

**2. The `PatternFactory` ports are too few.**

Today: `{ lifecycle, state }`. Missing:

- **`computed`/`memo`** — for derived reactive values (e.g., disabled state derived from loading + error)
- **`ref`** — DOM node access for focus management, floating positioning, measurements
- **`effect`** — reactive side effects (distinct from mount/destroy lifecycle)
- **`context`** — theming tokens, i18n, direction (RTL)

Without these, any non-trivial pattern (Combobox, Dialog, DatePicker) will hit a wall.

**3. React adapter requires callback-stabilization boilerplate that other adapters don't.**

```ts
// React adapter must wrap callbacks in refs to avoid stale closures
const callbackRef = useRef(callback);
useEffect(() => {
	callbackRef.current();
}, []);
```

Solid and Vue don't need this. The port contract leaks React's re-render mental model. The `LifecycleOutputPort` callback type should be `Ref<() => void>` from the core's perspective, or the factory should accept a `stabilize` port.

**4. `Event` type is coupled to the DOM.**

```ts
export type Event = Pick<globalThis.Event, "bubbles" | "cancelable" | ...>
```

This forces adapters to pass DOM events. In a React Native or server-rendering context, there is no `globalThis.Event`. The core should define its own abstract event shape.

**5. No pattern composition mechanism.**
There is no way for one pattern to use another (e.g., `useSelect` reusing `useButton` for its trigger). The `PatternFactory` is a closed factory with no dependency injection for other patterns.

**6. All tests are placeholders.**
`expect(true).toBe(true)` exists in every test file. The biggest missed opportunity: because the core is pure TypeScript with no framework dependency, you can test full pattern logic with a **mock adapter** — no JSDOM, no React Testing Library needed.

**7. `useDisclosure` is empty.**
The pattern most needed to validate the architecture (it requires `state`, `lifecycle`, and ideally `ref`) is unimplemented.

**8. `PatternInputDto` unwrapping is surprising.**
`Button.children` is typed as `State<string>` in the element definition, but the DTO strips it to `string` for input. This is correct behavior (consumers pass plain values), but having the same field be `State<string>` in one type and `string` in another with no documentation of the transformation is a source of confusion.

---

## Comparison with Alternative Approaches

| Approach                     | Framework independence   | Complexity | DOM coupling | Composition                |
| ---------------------------- | ------------------------ | ---------- | ------------ | -------------------------- |
| **hexagonal-ui (this)**      | ✅ Zero-dep core         | Low        | Partial      | Missing                    |
| **Zag.js** (XState machines) | ✅ Adapter per framework | High       | None         | ✅ via machine composition |
| **Radix / Headless UI**      | ❌ Framework-specific    | Low        | Full         | Partial                    |
| **Web Components**           | ✅ Native                | Medium     | Full         | Via shadow DOM             |
| **React Aria**               | ❌ React-only            | Medium     | Partial      | ✅                         |

**Zag.js** is the closest architectural peer. It uses finite state machines as core + framework adapters. The key difference: Zag.js's core models _transitions_ and _actions_, which naturally handles complex interactive patterns. `hexagonal-ui` models _reactive state + lifecycle_, which is simpler but has a ceiling.

---

## Improvement Opportunities

### High impact, low effort

**1. Test patterns with mock adapters.**
Write a `createMockAdapter()` utility in `core` that provides in-memory state/lifecycle stubs. This validates pattern logic in pure unit tests and demonstrates the architecture's value.

**2. Add `computed` port.**
Most patterns need derived state. A `computed: <V>(fn: () => V) => State<V>` port maps to React's `useMemo`, Solid's `createMemo`, and Vue's `computed`.

**3. Open `View.role`.**
Change `Role extends "button" | "link"` to `Role extends string` or move the constraint to a separate ARIA role type.

**4. Abstract `Event`.**
Define a minimal `CoreEvent` in shared types instead of picking from `globalThis.Event`.

### Medium impact, medium effort

**5. Add `ref` port.**
`RefOutputPort = <T>() => [() => T | null, (node: T | null) => void]` — maps to `useRef` / `createSignal(null)` / `ref(null)`. Required for any pattern involving focus trapping, popover positioning, or measurements.

**6. Implement `useDisclosure`.**
This pattern (open/close/toggle + trigger/content refs) is the foundation for Dialog, Popover, Accordion, Select, and Combobox. Implementing it will stress-test all current gaps simultaneously.

**7. Add `effect` port.**
Reactive effects (run when state changes, not just on mount) are needed for patterns that synchronize state with external systems.

### Longer term

**8. Pattern composition.**
Allow `PatternFactory` to receive other patterns as dependencies:

```ts
type PatternFactory<Req, Res, Deps = {}> = (
	ports: { lifecycle; state; computed; ref; effect },
	deps: Deps,
) => PatternInputPort<Req, Res>;
```

**9. Consider state machine modeling for complex patterns.**
For a Combobox or DatePicker, a state machine (even a minimal one) is more maintainable than ad-hoc state + effects. The port design is compatible — a `machine` port could wrap XState or a custom minimal FSM.

---

## Summary

The core insight — that UI interaction logic is framework-agnostic and can be expressed through typed ports — is **correct and well executed**. The `PatternFactory` pattern is clean. The main architectural risk is that the current port set (`lifecycle + state`) covers only the simplest patterns. The jump from `useButton` to `useCombobox` requires `computed`, `ref`, `effect`, and composition — none of which are currently designed. The architecture should be validated by implementing one genuinely complex pattern (Disclosure or Select) before expanding the component catalog.

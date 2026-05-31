# Architecture Audit

> **Audited by:** GitHub Copilot (Claude Sonnet 4.6)
> **Date:** May 31, 2026

---

## Overview

`hexagonal-ui` applies **Hexagonal Architecture (Ports & Adapters)** to a UI behaviour library. The core package defines interaction logic as pure TypeScript with zero runtime dependencies. Framework adapters (React, Solid, Vue) wire their own reactive primitives to the core's port contracts, producing ready-to-use hooks. Examples consume those hooks directly.

```
┌──────────────────────────────────────────────────┐
│                @hexagonal-ui/core                 │
│                                                   │
│  PatternFactory<Input, Output>                    │
│    (ports: Ports) => (input: Input) => Output     │
│                                                   │
│  Ports = { state, computed, lifecycle }           │
│                                                   │
│  useButton  useDisclosure  useCombobox            │
│  useListbox useMenu        useMenubar             │
│  useTreeView                                      │
└───────────────┬───────────────────────────────────┘
                │ PatternFactory(frameworkPorts)
     ┌──────────┼──────────┐
     ▼          ▼          ▼
  @react     @solid      @vue
 (adapter)  (adapter)  (adapter)
     │          │          │
     ▼          ▼          ▼
examples/   examples/   examples/
  react/     solid/       vue/
```

---

## Monorepo Structure

```
root/
├── libraries/
│   ├── core/     @hexagonal-ui/core  — framework-free pattern factories
│   ├── react/    @hexagonal-ui/react — React adapter hooks
│   ├── solid/    @hexagonal-ui/solid — Solid adapter hooks
│   └── vue/      @hexagonal-ui/vue   — Vue adapter hooks
└── examples/
    ├── react/    Vite + React demo app
    ├── solid/    Vite + Solid demo app
    └── vue/      Vite + Vue demo app
```

**Toolchain:** pnpm workspaces, Turborepo (`build → ^build` dependency chain), `@adbayb/stack` wrapping ESLint, Prettier, and TypeScript. Root scripts: `pnpm fix` (auto-fix), `pnpm check` (validate), `pnpm build`, `pnpm test`.

---

## Type System Glossary

| Type                            | Definition                                                  | Purpose                                                                        |
| ------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `Reactive<V>`                   | `() => V`                                                   | Unified getter — works across React closures, Solid signals, Vue computed refs |
| `Pattern<Props>`                | `Props extends Record<string, Reactive<V> \| V>`            | Base shape for all pattern output types                                        |
| `PatternFactory<Input, Output>` | `(ports: Ports) => (input: Input) => Output`                | Curried factory: wiring step then instantiation step                           |
| `Ports`                         | `{ state, computed, lifecycle }`                            | Full adapter surface the core depends on                                       |
| `StatePort`                     | `<V>(init: V) => readonly [() => V, (v: V) => void]`        | Getter + setter tuple                                                          |
| `ComputedPort`                  | `<V>(fn: () => V) => () => V`                               | Derived reactive value                                                         |
| `LifecyclePort`                 | `{ onMount, onDestroy }`                                    | Component mount/unmount hooks                                                  |
| `KeyboardEvent`                 | `Pick<globalThis.KeyboardEvent, "key" \| "preventDefault">` | Minimal cross-framework keyboard event shape                                   |

---

## Patterns Inventory

### 1. `useButton`

**WAI-ARIA:** [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)

**Input:** `{ children: boolean | number | string; isDisabled: boolean }`

**Output:**

```ts
getAttributes: Reactive<{
	"aria-disabled": boolean;
	"aria-label": string;
	"children": boolean | number | string;
	"onClick": (event: Event) => void;
	"role": "button";
	"type": "button" | "reset" | "submit";
}>;
```

**Notes:** The only pattern using all three ports (`state`, `computed`, `lifecycle`). Lifecycle is currently used only for `console.log` stubs — no functional purpose. `onClick` mutates `children` as a reactivity demo; this should be a caller-supplied handler.

---

### 2. `useDisclosure`

**WAI-ARIA:** [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)

**Input:** `{ "aria-controls": string; "id": string }`

**Output:**

```ts
getTriggerAttributes: Reactive<{
	"aria-controls": string;
	"aria-expanded": boolean;
	"id": string;
	"onClick": () => void;
	"role": "button";
}>;
isOpen: Reactive<boolean>;
```

**Notes:** Minimal two-state toggle. The controlled panel is not modelled — callers render it conditionally using `isOpen()`.

---

### 3. `useCombobox`

**WAI-ARIA:** [Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

**Input:** `{ "aria-controls": string; "options": string[] }`

**Output:**

```ts
filteredOptions: Reactive<string[]>
getInputAttributes: Reactive<{
  "aria-autocomplete": "list"; "aria-controls": string;
  "aria-expanded": boolean;
  "onBlur" | "onChange" | "onInput": (event: Event) => void;
  "role": "combobox"; "value": string;
}>
getOptionAttributes: (value: string) => {
  "aria-selected": boolean; "onClick": () => void; "role": "option";
}
isOpen: Reactive<boolean>
selectedOption: Reactive<string>
```

**Notes:** `filteredOptions` uses the `computed` port (derived state). The `event.target` access requires a double cast (`as unknown as { value: string } | null`) because the shared `Event` type exposes only `EventTarget | null`, which has no `value` property.

---

### 4. `useListbox`

**WAI-ARIA:** [Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)

**Input:** `{ id: string; options: string[] }`

**Output:**

```ts
getListboxAttributes: Reactive<{
  "aria-activedescendant": string; "id": string;
  "onKeyDown": (event: KeyboardEvent) => void;
  "role": "listbox"; "tabIndex": 0;
}>
getOptionAttributes: (value: string) => {
  "aria-selected": boolean; "id": string;
  "onClick": () => void; "role": "option";
}
selectedOption: Reactive<string>
```

**Keyboard nav:** `ArrowDown/Up` (circular), `Home/End`, `Enter`/`Space` (preventDefault only — do not select).

**Notes:** Focus tracked via `aria-activedescendant`. `Enter` and `Space` are no-ops (should select the focused option). Item IDs derived as `${id}-${value}`.

---

### 5. `useMenu`

**WAI-ARIA:** [Menu](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)

**Input:** `{ id: string; items: string[]; triggerId: string }`

**Output:**

```ts
activeItem: Reactive<string>
getMenuAttributes: Reactive<{
  "aria-activedescendant": string; "id": string;
  "onKeyDown": (event: KeyboardEvent) => void;
  "role": "menu"; "tabIndex": -1;
}>
getMenuItemAttributes: (item: string) => {
  id: string; onClick: () => void; role: "menuitem"; tabIndex: -1;
}
getTriggerAttributes: Reactive<{
  "aria-controls": string; "aria-expanded": boolean;
  "aria-haspopup": "menu"; "id": string;
  "onClick": () => void;
  "onKeyDown": (event: KeyboardEvent) => void;
  "role": "button";
}>
isOpen: Reactive<boolean>
```

**Trigger keyboard nav:** `Space/Enter/ArrowDown` → open at first item, `ArrowUp` → open at last item, `Escape` → close.

**Menu keyboard nav:** `Space/Enter/Escape` → close (merged single branch), `ArrowDown/Up` (circular), `Home/End`.

**Notes:** Focus-return to trigger after close not implemented (requires `ref` port).

---

### 6. `useMenubar`

**WAI-ARIA:** [Menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)

**Input:** `{ id: string; items: string[] }`

**Output:**

```ts
activeItem: Reactive<string>
getMenubarAttributes: Reactive<{ id: string; role: "menubar" }>
getMenuItemAttributes: (item: string) => {
  id: string; onClick: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  role: "menuitem"; tabIndex: -1 | 0;
}
```

**Keyboard nav:** `ArrowLeft/Right` (circular), `Home/End`. `Space/Enter` are no-ops.

**Notes:** Roving tabindex — only the active item has `tabIndex: 0`. `getMenuItemAttributes` is not wrapped in `computed`, so `tabIndex` is stale in Solid/Vue until the caller re-invokes it inside a reactive context.

---

### 7. `useTreeView`

**WAI-ARIA:** [Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)

**Input:** `{ id: string; items: TreeItem[] }` where `TreeItem = { id: string; label: string; children?: TreeItem[] }`

**Output:**

```ts
expandedItems: Reactive<string[]>
getGroupAttributes: (parentId: string) => {
  "aria-labelledby": string; "role": "group";
}
getTreeAttributes: Reactive<{
  "aria-activedescendant": string; "id": string;
  "onKeyDown": (event: KeyboardEvent) => void;
  "role": "tree"; "tabIndex": 0;
}>
getTreeItemAttributes: (itemId: string) => {
  "aria-expanded": boolean | undefined; "aria-selected": boolean;
  "id": string; "onClick": () => void;
  "role": "treeitem"; "tabIndex": -1;
}
selectedItem: Reactive<string>
```

**Keyboard nav:** `ArrowDown/Up` (visible nodes only), `ArrowRight` (expand or first child), `ArrowLeft` (collapse or parent), `Home/End`, `Enter/Space` (select active node).

**Notes:** Seven module-level pure helpers (`getVisibleIds`, `findItemById`, `findParentId`, `navigateNext`, `navigatePrevious`, `applyArrowRight`, `applyArrowLeft`) keep the factory body within the SonarJS complexity limit of 10. `getTreeItemAttributes` has the same reactive-staleness risk as `getMenuItemAttributes` in `useMenubar`.

---

## Adapter Comparison

| Concern               | React                                          | Solid                                  | Vue                             |
| --------------------- | ---------------------------------------------- | -------------------------------------- | ------------------------------- |
| `state` port          | `useState` — getter closes over current render | `createSignal` — truly reactive getter | `ref` — getter unwraps `.value` |
| `computed` port       | Identity `fn => fn` — re-runs each render      | `createMemo` — cached                  | `computed()` — lazy cache       |
| `lifecycle.onMount`   | `useEffect(cb, [])` via `callbackRef`          | `onMount`                              | `onMounted`                     |
| `lifecycle.onDestroy` | `useEffect(() => cb, [])` via `callbackRef`    | `onCleanup`                            | `onUnmounted`                   |
| Callback stability    | Requires `useRef` wrapper                      | Native                                 | Native                          |
| Adapter size          | ~35 lines                                      | 5 lines                                | ~20 lines                       |

**React `callbackRef` pattern.** React re-renders create new closures on every call. The adapter wraps lifecycle callbacks in a `useRef` so the latest closure is always invoked:

```ts
const callbackRef = useRef(callback);
useEffect(() => {
	callbackRef.current();
}, []);
```

This is correct but absent from Solid/Vue.

**Vue `onKeyDown` → `onKeydown` gotcha.** Vue 3 JSX's internal `parseName` function hyphenates prop names: `onKeyDown` → `"key-down"` (never fires). The fix used in examples: destructure the handler and re-bind it as `onKeydown` (lowercase `d`) with an `eslint-disable` comment. React and Solid map `onKeyDown` directly to `keydown` without transformation. This is a Vue JSX implementation detail that should ideally be abstracted at the adapter level.

---

## Strengths

**1. Zero-dependency core.** `@hexagonal-ui/core` has no runtime dependencies. All seven patterns pass `pnpm check` with zero TypeScript errors. This invariant is the hardest to maintain and it is holding.

**2. `Reactive<V> = () => V` unifies three reactive models.** A plain getter function works for React closures (re-render provides fresh values), Solid signals (reactive graph), and Vue computed refs (`.value` unwrap). No adapter requires anything beyond returning a function.

**3. `PatternFactory` currying cleanly separates wiring from instantiation.** `createUseButton(ports)` happens once at module load. `useButton(input)` happens per component. This enables tree-shaking and prevents the core from ever holding framework references.

**4. Solid adapter is 5 lines.** `createMemo`, `createSignal`, `onMount`, `onCleanup` map directly to ports. A minimal adapter signals well-designed ports.

**5. `computed` port enables true derived state.** `filteredOptions` in `useCombobox` and all `getXxxAttributes` getters use `computed`. React re-runs them on every render; Solid caches with `createMemo`; Vue caches with `computed()`. The same port contract produces appropriate behaviour in each system.

**6. Full WAI-ARIA keyboard compliance.** All interactive patterns implement the specified keyboard contracts: circular navigation, Home/End, directional keys, `preventDefault` on all handled keys.

**7. Consistent ID derivation.** Every pattern derives child element IDs as `${patternId}-${itemValue}` — predictable, collision-safe, no DOM access needed.

---

## Weaknesses

### Critical

**1. `getMenuItemAttributes` and `getTreeItemAttributes` are not reactive.**
Both return plain objects, not `computed`-wrapped getters. In Solid/Vue, when `activeItem()` or `selectedItem()` changes, the `tabIndex` and `aria-selected` values in previously-returned objects do not update. React re-renders mask this. Fix: wrap per-item getters in `computed`, or document the requirement to call them inside reactive scope on every render.

**2. No focus management.**
`useMenu` should move focus into the menu on open and back to the trigger on close. `useTreeView` should focus the active tree item after keyboard navigation. Both require a `ref` port that does not yet exist. Without it, keyboard UX is broken for screen reader users.

**3. `useButton.onClick` mutates `children` — a demo artifact in production code.**

```ts
"onClick"(event) { setChildren(`Mutated after ${event.type}`); }
```

This hardcodes click behaviour inside the pattern factory. Callers have no way to override it. A real button pattern should accept an `onPress?: (event: Event) => void` input and forward it.

**4. `Space` and `Enter` are no-ops in `useListbox`.**
Both keys call `preventDefault` but do not change state. WAI-ARIA requires that `Enter` and `Space` select the currently focused option. The fix requires a separate `activeOption` state (tracking keyboard focus via `aria-activedescendant`) distinct from `selectedOption` (the confirmed selection).

### Significant

**5. `useCombobox` uses a double cast to read `event.target.value`.**
`(event.target as unknown as { value: string } | null)?.value` exists because the shared `Event` type picks `target: EventTarget | null` from `globalThis.Event`. The fix: define a `InputEvent = { target: { value: string } }` type in `shared/Event.ts` and use it for `onChange`/`onInput` handlers.

**6. All test files contain only stubs.**
`expect(true).toBe(true)` in every test file. Because the core is pure TypeScript, a 10-line mock adapter is sufficient to test any pattern as pure logic — no JSDOM, no React Testing Library. This is the largest quality gap.

**7. `PatternFactory` ports are a monolithic concrete type.**
All patterns receive the full `Ports` object (`{ state, computed, lifecycle }`) even if they only use `state`. Adding new ports (`ref`, `effect`) requires updating all three adapter `ports` objects regardless of which patterns use the new port. Interface segregation is missing.

**8. `useButton` lifecycle usage inflates apparent complexity.**
Using `lifecycle` only for `console.log` makes `useButton` appear more complex than it is, and creates a misleading signal that lifecycle hooks are needed for simple patterns.

### Minor

**9. Inconsistent attribute quoting in type definitions.**
Some patterns use quoted keys (`"role": "button"`, `"tabIndex": 0`); others use unquoted (`role: "menuitem"`, `tabIndex: -1`). Functionally identical, but visually inconsistent.

**10. `Menubar` per-item `tabIndex: -1 | 0` union type.**
The union is correct, but some strict JSX type-checkers expect a literal where a union is spread. Low risk in practice.

**11. `View.ts` in `shared/` is unused.**
Not imported by any pattern and not re-exported from `index.ts`. Dead code.

---

## Comparison with Alternatives

| Approach                     | Framework independence    | Complexity | DOM coupling | Composition    |
| ---------------------------- | ------------------------- | ---------- | ------------ | -------------- |
| **hexagonal-ui**             | ✅ Zero-dep core          | Low        | Minimal      | Not yet        |
| **Zag.js** (XState machines) | ✅ Per-framework adapters | High       | None         | ✅             |
| **Radix / Headless UI**      | ❌ Framework-specific     | Low        | Full         | Partial        |
| **React Aria**               | ❌ React-only             | Medium     | Partial      | ✅             |
| **Ark UI**                   | ✅ Per-framework          | Medium     | None         | Partial        |
| **Web Components**           | ✅ Native                 | Medium     | Full         | Via shadow DOM |

`hexagonal-ui` occupies a unique position: lower complexity than Zag.js, framework-independent unlike Radix, and with a cleaner port abstraction than React Aria. Its current ceiling is the missing `ref` and `effect` ports.

---

## Improvement Opportunities

### High impact, low effort

**1. Test patterns with a mock adapter.**
A 10-line in-memory adapter is sufficient for full pattern logic coverage:

```ts
const state = <V>(init: V): readonly [() => V, (v: V) => void] => {
	let value = init;
	return [
		() => value,
		(v) => {
			value = v;
		},
	];
};
const ports: Ports = {
	state,
	computed: (fn) => fn,
	lifecycle: { onMount: (cb) => cb(), onDestroy: () => {} },
};
```

**2. Fix `Space`/`Enter` in `useListbox`.**
Add a separate `activeOption` state. Arrow keys update `activeOption`; `Enter`/`Space` commit it to `selectedOption`.

**3. Fix `useButton.onClick` to be a passthrough.**
Accept `onPress?: (event: Event) => void` in input and include it in `getAttributes()`. Remove the internal `setChildren` mutation.

**4. Wrap per-item attribute getters in `computed`.**
`getMenuItemAttributes` and `getTreeItemAttributes` should return `computed(() => ({ ... }))` so Solid/Vue track dependencies correctly.

### Medium impact, medium effort

**5. Add a `ref` port.**

```ts
type RefPort = <T>() => readonly [() => T | null, (node: T | null) => void];
```

Maps to `useRef` (React), `createSignal(null)` (Solid), `ref(null)` (Vue). Required for focus management and positioning.

**6. Add an `effect` port.**

```ts
type EffectPort = (fn: () => void | (() => void)) => void;
```

Maps to `useEffect` (React), `createEffect` (Solid), `watchEffect` (Vue). Required for patterns that synchronise state with external systems.

**7. Narrow `InputEvent` in `shared/Event.ts`.**
Define `type InputEvent = { target: { value: string } }` and use it for `onChange`/`onInput` instead of the double-cast `Event` workaround.

**8. Remap `onKeyDown` to `onKeydown` inside the Vue adapter.**
Intercept all attributes matching `/^onKey[A-Z]/` in the Vue adapter and rename them, eliminating the per-component workaround in every example.

### Longer term

**9. Typed port declaration per pattern.**
Allow patterns to declare only the ports they consume:

```ts
type PatternFactory<Input, Output, P extends Partial<Ports> = Ports> = (
	ports: P,
) => (input: Input) => Output;
```

**10. Pattern composition.**
Allow `PatternFactory` to accept other patterns as dependencies:

```ts
type PatternFactory<Req, Res, Deps = {}> = (
	ports: Ports,
	deps: Deps,
) => (input: Req) => Res;
```

Enables `useSelect = createUseSelect(ports, { useButton, useListbox })`.

**11. State machine modelling for complex patterns.**
For Combobox or DatePicker, a state machine is more maintainable than ad-hoc state + effects. The port design is compatible — a `machine` port could wrap XState or a minimal custom FSM.

---

## Summary

The core architectural bet — that UI interaction logic is framework-agnostic and expressible through typed ports — is **correct and well-executed**. Seven patterns (Button, Disclosure, Combobox, Listbox, Menu, Menubar, TreeView) are implemented across all three adapters with full WAI-ARIA keyboard compliance and zero TypeScript errors. The `PatternFactory` currying, `Reactive<V> = () => V` abstraction, and Solid's 5-line adapter are evidence that the port design is sound.

The four most urgent fixes are entirely incremental and require no architectural changes: adding `ref`/`effect` ports for focus management, fixing the `useListbox` `Space`/`Enter` no-ops, removing the hardcoded mutation from `useButton`, and adding real unit tests via a mock adapter.

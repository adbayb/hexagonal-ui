<br>
<div align="center">
    <h1>📦 @hexagonal-ui/core</h1>
    <strong>Cross-framework and low-level design system building blocks with a focus on customization, interactions, and accessibility</strong>
</div>
<br>
<br>

## ✨ Features

- **ARIA patterns compliant**: Building blocks implement [WAI-ARIA Authoring Practices Guide (APG) patterns](https://www.w3.org/WAI/ARIA/apg/patterns/), ensuring accessible keyboard interactions, focus management, and ARIA semantics out of the box.
- **Framework agnostic**: Pattern factories are decoupled from any UI framework. Adapters for React, Solid, and Vue are provided, and custom adapters can be created by injecting framework-specific `lifecycle` and `state` ports.
- **Headless**: No styles are shipped, full control over markup and appearance is left to the consumer.

<br>

## 🚀 Usage

### With a framework adapter

The quickest way to get started is to use one of the pre-built framework packages (e.g. `@hexagonal-ui/react`):

```tsx
import { useButton, useDisclosure } from "@hexagonal-ui/react";

const Button = () => {
	const { children, props } = useButton({ children: "Click me" });

	return <button {...props}>{children()}</button>;
};

const Disclosure = () => {
	const { isOpen, props } = useDisclosure({
		"id": "trigger",
		"aria-controls": "panel",
	});

	return (
		<div>
			<button
				{...props}
				aria-expanded={isOpen()}
			>
				Toggle
			</button>
			{isOpen() && <div id="panel">Content</div>}
		</div>
	);
};

const App = () => (
	<>
		<Button />
		<Disclosure />
	</>
);
```

### With a custom adapter

Use the pattern factories from `@hexagonal-ui/core` to wire your own framework primitives:

```ts
import { createUseButton } from "@hexagonal-ui/core";

export const useButton = createUseButton({
	lifecycle: {
		onMount: myFrameworkOnMount,
		onDestroy: myFrameworkOnDestroy,
	},
	state: myFrameworkUseState,
});
```

The returned hook exposes stateful values inline (e.g. `isOpen`) and stateless props under a `props` key for easy spreading.

<br>

## 🏗️ Architecture

Two main layers:

- **Core**: like the Application core in the hexagonal architecture, it centralizes all the core library logic and includes two levels
    - Elements: Low-level entities modelizing HTML elements (e.g. Accordion, Button, ...)
    - Patterns: Element aggregates implementing UX patterns (e.g. useButton, useDialog, ... documented in the [WCAG website](https://www.w3.org/WAI/ARIA/apg/patterns/))
- **Adapters**: Surrounding the core, this layer aims to interact with it to implement framework specificities. There'll be typically one adapter library per UI framework. Each library is a concrete implementation of the different ports/interfaces exposed by the core (eg. ViewModel ports, ...)

<br>

## ✍️ Contribution

We're open to new contributions, you can find more details [here](https://github.com/adbayb/hexagonal-ui/blob/main/CONTRIBUTING.md).

<br>

## 📖 License

[MIT](https://github.com/adbayb/hexagonal-ui/blob/main/LICENSE "License MIT")

<br>

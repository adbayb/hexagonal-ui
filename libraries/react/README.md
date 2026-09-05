<br>
<div align="center">
    <h1>📦 @hexagonal-ui/react</h1>
    <strong>React adapter for @hexagonal-ui/core — accessible ARIA pattern hooks</strong>
</div>
<br>
<br>

## ✨ Features

React adapter for the `@hexagonal-ui/core` library. It wires React primitives (`useState`, `useEffect`, `useRef`) to the core ports and exposes ready-to-use hooks: `useButton`, `useDisclosure`, `useCombobox`, `useListbox`, `useMenu`, `useMenubar`, `useSelect`, and `useTreeView`.

<br>

## 🚀 Usage

```tsx
import { useSelect } from "@hexagonal-ui/react";

const Select = () => {
	const {
		getListboxAttributes,
		getOptionAttributes,
		getTriggerAttributes,
		isOpen,
		selectedOption,
	} = useSelect({
		id: "select",
		options: ["Apple", "Banana"],
		triggerId: "select-trigger",
	});

	return (
		<div>
			<button {...getTriggerAttributes()}>
				{selectedOption() === "" ? "Choose" : selectedOption()}
			</button>
			{isOpen() && (
				<ul {...getListboxAttributes()}>
					{["Apple", "Banana"].map((option) => (
						<li
							key={option}
							{...getOptionAttributes(option)()}
						>
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
```

Per-item attribute getters return a reactive getter, so call the result:
`{...getOptionAttributes(option)()}`. See the [core documentation](https://github.com/adbayb/hexagonal-ui#readme) for the full API and custom adapters.

<br>

## ✍️ Contribution

We're open to new contributions, you can find more details [here](https://github.com/adbayb/hexagonal-ui/blob/main/CONTRIBUTING.md).

<br>

## 📖 License

[MIT](https://github.com/adbayb/hexagonal-ui/blob/main/LICENSE "License MIT")

<br>

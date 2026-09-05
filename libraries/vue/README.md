<br>
<div align="center">
    <h1>📦 @hexagonal-ui/vue</h1>
    <strong>Vue adapter for @hexagonal-ui/core — accessible ARIA pattern hooks</strong>
</div>
<br>
<br>

## ✨ Features

Vue adapter for the `@hexagonal-ui/core` library. It wires Vue primitives (`ref`, `computed`, `watchEffect`) to the core ports and exposes ready-to-use hooks: `useButton`, `useDisclosure`, `useCombobox`, `useListbox`, `useMenu`, `useMenubar`, `useSelect`, and `useTreeView`.

The adapter remaps `onKeyDown` handlers to Vue JSX's `onKeydown` spelling internally, so attribute objects spread directly like in React and Solid.

<br>

## 🚀 Usage

```tsx
import { useSelect } from "@hexagonal-ui/vue";
import { defineComponent } from "vue";

const Select = defineComponent({
	setup() {
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

		return () => (
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
	},
});
```

Per-item attribute getters return a reactive getter, so call the result:
`{...getOptionAttributes(option)()}`. Note that Vue JSX does not treat a
spread `children` prop as slot content — extract it like the `useButton`
example in `examples/vue`. See the [core documentation](https://github.com/adbayb/hexagonal-ui#readme) for the full API and custom adapters.

<br>

## ✍️ Contribution

We're open to new contributions, you can find more details [here](https://github.com/adbayb/hexagonal-ui/blob/main/CONTRIBUTING.md).

<br>

## 📖 License

[MIT](https://github.com/adbayb/hexagonal-ui/blob/main/LICENSE "License MIT")

<br>

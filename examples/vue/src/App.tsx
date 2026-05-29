import { useButton, useDisclosure } from "@hexagonal-ui/vue";
import { defineComponent } from "vue";

const Button = defineComponent({
	setup() {
		// eslint-disable-next-line @eslint-react/rules-of-hooks
		const { children, props } = useButton({
			children: "Hello from Vue 👋",
		});

		// eslint-disable-next-line @eslint-react/dom-no-missing-button-type
		return () => <button {...props}>{children()}</button>;
	},
});

const Disclosure = defineComponent({
	setup() {
		// eslint-disable-next-line @eslint-react/rules-of-hooks
		const { isOpen, props } = useDisclosure({
			"aria-controls": "vue-panel",
			"id": "vue-trigger",
		});

		return () => (
			<div>
				{/* eslint-disable-next-line @eslint-react/dom-no-missing-button-type */}
				<button
					{...props}
					aria-expanded={isOpen()}
				>
					{isOpen() ? "Hide" : "Show"} content
				</button>
				{isOpen() && (
					<p id="vue-panel">Disclosed content from Vue 🎉</p>
				)}
			</div>
		);
	},
});

export const App = () => (
	<>
		<Button />
		<Disclosure />
	</>
);

import { useButton } from "@hexagonal-ui/vue";
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

export const App = () => <Button />;

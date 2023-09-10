import { defineComponent } from "vue";
import { useButton } from "@hexagonal-ui/vue";

const Button = defineComponent({
	setup() {
		const { props, children } = useButton({
			children: "Hello from Vue 👋",
		});

		return () => <button {...props}>{children()}</button>;
	},
});

export const App = () => <Button />;

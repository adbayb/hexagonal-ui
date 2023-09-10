import { defineComponent } from "vue";
import { useButton } from "@hexagonal-ui/vue";

const Button = defineComponent({
	setup() {
		const {
			tag: Component,
			children: vueChildren,
			...props
		} = useButton({
			children: "Hello from Vue 👋",
		});

		// @ts-expect-error to fix (event value object type conflicts)
		return () => <Component {...props}>{vueChildren}</Component>;
	},
});

export const App = () => <Button />;

import type { PatternFactory } from "../shared/Ports";

import type { Button } from "./Button";

type RequestModel = {
	children: ReturnType<Button["children"]>;
};

// The response model always look like to the underlying domain entity (which corresponds here to an element)
// No need to have a concrete DTO which will introduce uneeded layer of indirection (a pattern is anyway strongly tied to elements)
type ResponseModel = Pick<Button, "children"> & {
	props: Pick<Button["props"], "onClick" | "role">;
};

/**
 * Button pattern factory
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
export const createUseButton: PatternFactory<RequestModel, ResponseModel> =
	({ lifecycle, state }) =>
	(requestModel) => {
		const [children, setChildren] = state(requestModel.children);

		lifecycle.onMount(() => {
			console.log("useButton mounted");
		});

		lifecycle.onDestroy(() => {
			console.log("useButton destroyed");
		});

		return {
			props: {
				role: "button",
				onClick(event) {
					setChildren(`Mutated after ${event.type}`);
				},
			},
			children,
		};
	};

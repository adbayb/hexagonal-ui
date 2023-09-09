import type { PatternPort, StatePort } from "../shared/Ports";

import type { Button } from "./Button";

type RequestModel = Pick<Button, "children">;

// The response model always look like to the underlying domain entity (which corresponds here to an element)
// No need to have a concrete DTO which will introduce uneeded layer of indirection (a pattern is anyway strongly tied to elements)
type ResponseModel = Pick<Button, "children" | "onClick" | "tag">;

/**
 * Button pattern factory
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
export const createUseButton =
	(state: StatePort): PatternPort<RequestModel, ResponseModel> =>
	(requestModel) => {
		const [children, setChildren] = state(requestModel.children);

		return {
			tag: "button",
			children,
			onClick(event) {
				console.log("click", event);
				setChildren("Mutated after click");
			},
		};
	};

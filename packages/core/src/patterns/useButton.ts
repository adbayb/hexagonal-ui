import type { Button } from "../elements/Button";

import { createObservable } from "./observer";
import type { Observable } from "./observer";
import type { Pattern, ViewModel } from "./types";

type RequestModel = Pick<Button, "children">;

// The response model always look like to the underlying domain entity (which corresponds here to an element)
// No need to have a concrete DTO which will introduce uneeded layer of indirection (a pattern is anyway strongly tied to elements)
type ResponseModel = Pick<Button, "onClick" | "tag"> & {
	children: Observable<Button["children"]>;
};

export type UseButtonViewModel = ViewModel<RequestModel, ResponseModel>;

/**
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
export const useButton: Pattern<RequestModel, ResponseModel> = (
	requestModel,
) => {
	const children = createObservable(requestModel.children);

	return {
		tag: "button",
		children,
		onClick(event) {
			console.log("click", event);
			children.value = "Mutated after click";
		},
	};
};

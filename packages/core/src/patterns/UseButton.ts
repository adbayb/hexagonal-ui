import type { Button } from "../elements/Button";

import { createObservable } from "./observer";
import type { Observable } from "./observer";
import type { Port } from "./types";

/**
 * Ports definition
 */
type UseButtonRequestModel = Pick<Button["attributes"], "children">; // @todo: { children: Observable<Button["attributes"]["children"]>}

// The response model always look like to the underlying domain entity (which corresponds here to an element)
// No need to have a concrete DTO which will introduce uneeded layer of indirection (a pattern is anyway strongly tied to elements)
type UseButtonResponseModel = {
	tag: Button["tag"];
	children: Observable<Button["attributes"]["children"]>;
};

/**
 * Service definition
 * Implementation of https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
export const useButton: Port<UseButtonRequestModel, UseButtonResponseModel> = (
	requestModel,
) => {
	const children = createObservable(requestModel.children);

	setTimeout(() => {
		children.value = "Test: Updated children!";
	}, 2000);

	return {
		tag: "button",
		children,
	};
};

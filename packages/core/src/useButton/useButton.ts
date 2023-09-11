import type {
	PatternFactory,
	PatternInputDto,
	PatternOutputDto,
} from "../shared/Pattern";

import type { Button } from "./Button";

type RequestModel = PatternInputDto<Pick<Button, "children">>;

type ResponseModel = PatternOutputDto<
	Pick<Button, "children" | "onClick" | "role">
>;

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

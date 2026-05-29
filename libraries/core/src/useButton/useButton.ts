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
 * Button pattern factory.
 * @param input - Helpers.
 * @param input.lifecycle - Lifecycle functions.
 * @param input.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 * @example
 * 	const useButton = createUseButton({
 * 		lifecycle: {
 * 			onDestroy: useDestroy,
 * 			onMount: useMount,
 * 		},
 * 		state: useStateAdapter,
 * 	});
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
			children,
			props: {
				onClick(event) {
					setChildren(`Mutated after ${event.type}`);
				},
				role: "button",
			},
		};
	};

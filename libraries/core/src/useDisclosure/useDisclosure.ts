import type {
	PatternFactory,
	PatternInputDto,
	PatternOutputDto,
} from "../shared/Pattern";
import type { Disclosure } from "./Disclosure";

type RequestModel = PatternInputDto<Pick<Disclosure, "aria-controls" | "id">>;

type ResponseModel = PatternOutputDto<
	Pick<Disclosure, "aria-controls" | "id" | "isOpen" | "onClick" | "role">
>;

/**
 * Disclosure pattern factory.
 * @param input - Helpers.
 * @param input.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 * @example
 * 	const useDisclosure = createUseDisclosure({
 * 		lifecycle: {
 * 			onDestroy: useDestroy,
 * 			onMount: useMount,
 * 		},
 * 		state: useStateAdapter,
 * 	});
 */
export const createUseDisclosure: PatternFactory<RequestModel, ResponseModel> =
	({ state }) =>
	(requestModel) => {
		const [isOpen, setIsOpen] = state(false);

		return {
			isOpen,
			props: {
				"aria-controls": requestModel["aria-controls"],
				"id": requestModel.id,
				"onClick"() {
					setIsOpen(!isOpen());
				},
				"role": "button",
			},
		};
	};

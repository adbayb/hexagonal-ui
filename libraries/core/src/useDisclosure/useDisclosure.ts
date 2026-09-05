import type { PatternFactory } from "../shared/Pattern";
import type { FrameworkPort } from "../shared/Port";
import type { Reactive } from "../shared/types";

/**
 * Disclosure pattern input. `id` is the controlled panel id; the trigger id defaults to
 * `${id}-trigger` when omitted.
 */
export type UseDisclosureInput = {
	id: string;
	triggerId?: string;
};

/** Disclosure pattern output. */
export type UseDisclosureOutput = {
	getTriggerAttributes: Reactive<{
		"id": string;
		"aria-controls": string;
		"aria-expanded": boolean;
		"onClick": () => void;
		"role": "button";
	}>;
	isOpen: Reactive<boolean>;
};

/**
 * Disclosure pattern factory.
 *
 * @example
 * 	const useDisclosure = createUseDisclosure({ computed, state });
 *
 * @param frameworkAdapter - Helpers.
 * @param frameworkAdapter.computed - Computed state factory.
 * @param frameworkAdapter.state - State manager.
 * @returns Hook.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */
export const createUseDisclosure: PatternFactory<
	UseDisclosureInput,
	UseDisclosureOutput,
	Pick<FrameworkPort, "computed" | "state">
> = ({ computed, state }) => {
	return (input) => {
		const [isOpen, setIsOpen] = state(false);
		const triggerId = input.triggerId ?? `${input.id}-trigger`;

		return {
			getTriggerAttributes: computed(() => {
				return {
					"id": triggerId,
					"aria-controls": input.id,
					"aria-expanded": isOpen(),
					"onClick"() {
						setIsOpen(!isOpen());
					},
					"role": "button",
				};
			}),
			isOpen,
		};
	};
};

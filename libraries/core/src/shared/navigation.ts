/**
 * Circular next-item navigation shared by list-driven patterns
 * (listbox, menu, menubar, select).
 * @param values - Ordered values to navigate.
 * @param current - Currently active value.
 * @returns Next value, wrapping around to the first one.
 * @example
 * ```ts
 * navigateNext(["a", "b"], "b"); // "a"
 * ```
 */
export const navigateNext = (values: string[], current: string): string => {
	const index = values.indexOf(current);
	const next = index === -1 || index === values.length - 1 ? 0 : index + 1;

	return values[next] ?? current;
};

/**
 * Circular previous-item navigation shared by list-driven patterns
 * (listbox, menu, menubar, select).
 * @param values - Ordered values to navigate.
 * @param current - Currently active value.
 * @returns Previous value, wrapping around to the last one.
 * @example
 * ```ts
 * navigatePrevious(["a", "b"], "a"); // "b"
 * ```
 */
export const navigatePrevious = (values: string[], current: string): string => {
	const index = values.indexOf(current);
	const previous = index <= 0 ? values.length - 1 : index - 1;

	return values[previous] ?? current;
};

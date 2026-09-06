import preset from "@adbayb/stack/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
	...preset,
	overrides: [
		...preset.overrides,
		{
			/*
			 * Headless ARIA demos attach roles and handlers to plain elements by design.
			 * Roles come from pattern attribute spreads, which static analysis cannot see.
			 */
			files: ["**/examples/**"],
			rules: {
				"jsx-a11y/no-noninteractive-element-interactions": "off",
				"jsx-a11y/no-noninteractive-element-to-interactive-role": "off",
				"jsx-a11y/no-static-element-interactions": "off",
				"jsx-a11y/prefer-tag-over-role": "off",
			},
		},
		{
			/*
			 * Vue `setup()` is not a React component; `useX` calls there are not React hooks.
			 * Vue JSX listens to `onMousedown`-style spellings (`mousedown`); the React rule
			 * demands `onMouseDown`, which Vue hyphenates to the non-existent `mouse-down` event.
			 */
			files: ["**/examples/vue/**"],
			rules: {
				"react-hooks/rules-of-hooks": "off",
				"react/no-unknown-property": "off",
			},
		},
		{
			/*
			 * Solid list rendering does not use React-style `key` reconciliation.
			 */
			files: ["**/examples/solid/**"],
			rules: {
				"react/jsx-key": "off",
			},
		},
		{
			/*
			 * Ports are sync callback wirings by design, not promise-based async code.
			 */
			files: [
				"**/libraries/core/src/shared/mockPorts.ts",
				"**/libraries/react/src/adapters.ts",
				"**/libraries/solid/src/adapters.ts",
			],
			rules: {
				"promise/prefer-await-to-callbacks": "off",
			},
		},
	],
	rules: {
		...preset.rules,
		/*
		 * Ports bridge DOM nullability (`EventTarget | null`, element refs) where `null`
		 * is the correct semantic; `undefined` would break those contracts.
		 */
		"unicorn/no-null": "off",
	},
});

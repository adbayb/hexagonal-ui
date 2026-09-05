import { describe, expect, test } from "vitest";

import {
	createUseButton,
	createUseCombobox,
	createUseDisclosure,
	createUseListbox,
	createUseMenu,
	createUseMenubar,
	createUseSelect,
	createUseTreeView,
} from ".";

describe("package exports", () => {
	test("should expose all pattern factories", () => {
		expect(createUseButton).toBeTypeOf("function");
		expect(createUseDisclosure).toBeTypeOf("function");
		expect(createUseCombobox).toBeTypeOf("function");
		expect(createUseListbox).toBeTypeOf("function");
		expect(createUseMenu).toBeTypeOf("function");
		expect(createUseMenubar).toBeTypeOf("function");
		expect(createUseSelect).toBeTypeOf("function");
		expect(createUseTreeView).toBeTypeOf("function");
	});
});

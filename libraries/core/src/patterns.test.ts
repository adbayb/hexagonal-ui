import { describe, expect, test } from "vitest";

import {
	createMockPorts,
	mockEvent,
	mockFocusEvent,
	mockInputEvent,
	mockKeyboardEvent,
} from "./shared/mockPorts";
import { createUseButton } from "./useButton";
import { createUseCombobox } from "./useCombobox";
import { createUseDisclosure } from "./useDisclosure";
import { createUseListbox } from "./useListbox";
import { createUseMenu } from "./useMenu";
import { createUseMenubar } from "./useMenubar";
import { createUseSelect } from "./useSelect";
import { createUseTreeView } from "./useTreeView";

describe("useButton", () => {
	test("should forward props and call onPress", () => {
		const { ports } = createMockPorts();
		let pressed = 0;

		const useButton = createUseButton(ports)({
			children: "Click me",
			isDisabled: false,
			onPress: () => {
				pressed += 1;
			},
			type: "submit",
		});

		const attributes = useButton.getAttributes();

		expect(attributes["aria-disabled"]).toBe(false);
		expect(attributes["aria-label"]).toBe("Click me");
		expect(attributes.type).toBe("submit");

		attributes.onClick(mockEvent());

		expect(pressed).toBe(1);
	});

	test("should block onPress when disabled and default type", () => {
		const { ports } = createMockPorts();
		let pressed = 0;

		const useButton = createUseButton(ports)({
			children: "Save",
			isDisabled: true,
			onPress: () => {
				pressed += 1;
			},
		});

		const attributes = useButton.getAttributes();

		expect(attributes["aria-disabled"]).toBe(true);
		expect(attributes.type).toBe("button");

		let prevented = false;

		attributes.onClick({
			...mockEvent(),
			preventDefault: () => {
				prevented = true;
			},
		});

		expect(pressed).toBe(0);
		expect(prevented).toBe(true);
	});
});

describe("useDisclosure", () => {
	test("should toggle open state", () => {
		const { ports } = createMockPorts();

		const disclosure = createUseDisclosure(ports)({
			id: "panel",
		});

		expect(disclosure.isOpen()).toBe(false);
		expect(disclosure.getTriggerAttributes().id).toBe("panel-trigger");
		expect(disclosure.getTriggerAttributes()["aria-controls"]).toBe(
			"panel",
		);

		disclosure.getTriggerAttributes().onClick();

		expect(disclosure.isOpen()).toBe(true);
		expect(disclosure.getTriggerAttributes()["aria-expanded"]).toBe(true);

		disclosure.getTriggerAttributes().onClick();

		expect(disclosure.isOpen()).toBe(false);
	});
});

describe("useCombobox", () => {
	test("should filter, sync input on select, and handle keys", () => {
		const { ports } = createMockPorts();

		const combobox = createUseCombobox(ports)({
			id: "listbox",
			options: ["Apple", "Banana", "Cherry"],
		});

		combobox.getInputAttributes().onInput(mockInputEvent("ap"));

		expect(combobox.getInputAttributes().value).toBe("ap");
		expect(combobox.isOpen()).toBe(true);
		expect(combobox.filteredOptions()).toStrictEqual(["Apple"]);

		combobox.getInputAttributes().onKeyDown(mockKeyboardEvent("Enter"));

		expect(combobox.selectedOption()).toBe("Apple");
		expect(combobox.getInputAttributes().value).toBe("Apple");
		expect(combobox.isOpen()).toBe(false);

		combobox.getOptionAttributes("Banana")().onClick();

		expect(combobox.selectedOption()).toBe("Banana");
		expect(combobox.getInputAttributes().value).toBe("Banana");
		expect(combobox.getOptionAttributes("Banana")().id).toBe(
			"listbox-Banana",
		);
	});

	test("should keep popup open when focus moves to an option", () => {
		const { ports } = createMockPorts();

		const combobox = createUseCombobox(ports)({
			id: "listbox",
			options: ["Apple", "Banana"],
		});

		combobox.getInputAttributes().onInput(mockInputEvent("a"));

		expect(combobox.isOpen()).toBe(true);

		combobox.getInputAttributes().onBlur(
			mockFocusEvent({
				id: "listbox-Apple",
			} as unknown as EventTarget),
		);

		expect(combobox.isOpen()).toBe(true);

		combobox.getInputAttributes().onBlur(mockFocusEvent());

		expect(combobox.isOpen()).toBe(false);
	});
});

describe("useListbox", () => {
	test("should move active with arrows and commit with Enter", () => {
		const { ports } = createMockPorts();

		const listbox = createUseListbox(ports)({
			id: "lb",
			options: ["A", "B", "C"],
		});

		listbox
			.getListboxAttributes()
			.onKeyDown(mockKeyboardEvent("ArrowDown"));

		expect(listbox.activeOption()).toBe("A");
		expect(listbox.selectedOption()).toBe("");

		listbox
			.getListboxAttributes()
			.onKeyDown(mockKeyboardEvent("ArrowDown"));

		expect(listbox.activeOption()).toBe("B");

		listbox.getListboxAttributes().onKeyDown(mockKeyboardEvent("Enter"));

		expect(listbox.selectedOption()).toBe("B");
		expect(listbox.getOptionAttributes("B")()["aria-selected"]).toBe(true);

		listbox.getOptionAttributes("C")().onClick();

		expect(listbox.selectedOption()).toBe("C");
		expect(listbox.activeOption()).toBe("C");
	});
});

describe("useMenu", () => {
	test("should open, navigate, close, and manage focus", () => {
		const { ports, runEffects } = createMockPorts();

		const menu = createUseMenu(ports)({
			id: "menu",
			items: ["Copy", "Cut"],
			triggerId: "trigger",
		});

		let focused: string | undefined;

		menu.triggerRef({
			focus: () => {
				focused = "trigger";
			},
		});
		menu.menuRef({
			focus: () => {
				focused = "menu";
			},
		});

		menu.getTriggerAttributes().onClick();

		expect(menu.isOpen()).toBe(true);

		runEffects();

		expect(focused).toBe("menu");

		menu.getMenuAttributes().onKeyDown(mockKeyboardEvent("ArrowDown"));

		expect(menu.activeItem()).toBe("Cut");

		menu.getMenuAttributes().onKeyDown(mockKeyboardEvent("Escape"));

		expect(menu.isOpen()).toBe(false);

		runEffects();

		expect(focused).toBe("trigger");

		expect(menu.getMenuItemAttributes("Copy")().role).toBe("menuitem");
	});

	test("should default triggerId when omitted", () => {
		const { ports } = createMockPorts();

		const menu = createUseMenu(ports)({
			id: "menu",
			items: ["Copy", "Cut"],
		});

		expect(menu.getTriggerAttributes().id).toBe("menu-trigger");
		expect(menu.getTriggerAttributes()["aria-controls"]).toBe("menu");
	});
});

describe("useMenubar", () => {
	test("should support roving tabindex with arrow keys", () => {
		const { ports } = createMockPorts();

		const menubar = createUseMenubar(ports)({
			id: "mb",
			items: ["File", "Edit"],
		});

		expect(menubar.activeItem()).toBe("File");
		expect(menubar.getMenuItemAttributes("File")().tabIndex).toBe(0);
		expect(menubar.getMenuItemAttributes("Edit")().tabIndex).toBe(-1);

		menubar
			.getMenuItemAttributes("File")()
			.onKeyDown(mockKeyboardEvent("ArrowRight"));

		expect(menubar.activeItem()).toBe("Edit");
		expect(menubar.getMenuItemAttributes("Edit")().tabIndex).toBe(0);
	});
});

describe("useSelect", () => {
	test("should open, navigate, commit, and close", () => {
		const { ports } = createMockPorts();

		const select = createUseSelect(ports)({
			id: "select",
			options: ["Apple", "Banana", "Cherry"],
			triggerId: "select-trigger",
		});

		expect(select.isOpen()).toBe(false);

		select.getTriggerAttributes().onClick();

		expect(select.isOpen()).toBe(true);
		expect(select.activeOption()).toBe("Apple");
		expect(select.getTriggerAttributes()["aria-expanded"]).toBe(true);

		select.getListboxAttributes().onKeyDown(mockKeyboardEvent("ArrowDown"));

		expect(select.activeOption()).toBe("Banana");

		select.getListboxAttributes().onKeyDown(mockKeyboardEvent("Enter"));

		expect(select.selectedOption()).toBe("Banana");
		expect(select.isOpen()).toBe(false);
		expect(select.getOptionAttributes("Banana")()["aria-selected"]).toBe(
			true,
		);

		select.getTriggerAttributes().onKeyDown(mockKeyboardEvent("Escape"));

		expect(select.isOpen()).toBe(false);
	});

	test("should default triggerId when omitted", () => {
		const { ports } = createMockPorts();

		const select = createUseSelect(ports)({
			id: "select",
			options: ["Apple", "Banana"],
		});

		expect(select.getTriggerAttributes().id).toBe("select-trigger");
		expect(select.getTriggerAttributes()["aria-controls"]).toBe("select");
	});
});

describe("useTreeView", () => {
	test("should expand, navigate, and select nodes", () => {
		const { ports } = createMockPorts();

		const tree = createUseTreeView(ports)({
			id: "tree",
			items: [
				{
					children: [
						{ id: "leaf", label: "Leaf" },
						{ id: "twig", label: "Twig" },
					],
					id: "branch",
					label: "Branch",
				},
			],
		});

		tree.getTreeItemAttributes("branch")().onClick();

		expect(tree.expandedItems()).toContain("branch");
		expect(tree.selectedItem()).toBe("branch");

		const branchAttributes = tree.getTreeItemAttributes("branch")();

		expect(branchAttributes["aria-level"]).toBe(1);
		expect(branchAttributes["aria-setsize"]).toBe(1);
		expect(branchAttributes["aria-posinset"]).toBe(1);

		const leafAttributes = tree.getTreeItemAttributes("leaf")();

		expect(leafAttributes["aria-level"]).toBe(2);
		expect(leafAttributes["aria-setsize"]).toBe(2);
		expect(leafAttributes["aria-posinset"]).toBe(1);

		tree.getTreeAttributes().onKeyDown(mockKeyboardEvent("ArrowDown"));

		expect(tree.getTreeAttributes()["aria-activedescendant"]).toContain(
			"leaf",
		);

		expect(tree.getGroupAttributes("branch")().role).toBe("group");
	});

	test("should expand siblings on star and support typeahead", () => {
		const { ports } = createMockPorts();

		const tree = createUseTreeView(ports)({
			id: "tree",
			items: [
				{
					children: [{ id: "leaf-a", label: "Apple" }],
					id: "branch-a",
					label: "Apricot",
				},
				{
					children: [{ id: "leaf-b", label: "Banana" }],
					id: "branch-b",
					label: "Blueberry",
				},
			],
		});

		tree.getTreeAttributes().onKeyDown(mockKeyboardEvent("*"));

		expect(tree.expandedItems()).toStrictEqual(["branch-a", "branch-b"]);

		tree.getTreeAttributes().onKeyDown(mockKeyboardEvent("b"));

		expect(tree.getTreeAttributes()["aria-activedescendant"]).toContain(
			"branch-b",
		);
	});
});

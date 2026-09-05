import { describe, expect, test } from "vitest";

import { frameworkAdapter } from "./adapters";

describe("frameworkAdapter", () => {
	test("should expose all required ports", () => {
		expect(frameworkAdapter.computed).toBeTypeOf("function");
		expect(frameworkAdapter.effect).toBeTypeOf("function");
		expect(frameworkAdapter.ref).toBeTypeOf("function");
		expect(frameworkAdapter.state).toBeTypeOf("function");
		expect(frameworkAdapter.lifecycle.onMount).toBeTypeOf("function");
		expect(frameworkAdapter.lifecycle.onDestroy).toBeTypeOf("function");
	});
});

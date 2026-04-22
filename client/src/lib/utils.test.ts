import { describe, expect, it } from "bun:test";
import { cn } from "./utils";

describe("cn utility", () => {
	it("should merge class names", () => {
		expect(cn("basic", "classes")).toBe("basic classes");
	});

	it("should handle conditional classes", () => {
		expect(cn("basic", true && "active", false && "hidden")).toBe(
			"basic active",
		);
	});

	it("should merge tailwind classes correctly", () => {
		expect(cn("px-2 py-2", "px-4")).toBe("py-2 px-4");
	});

	it("should handle null and undefined", () => {
		expect(cn("basic", null, undefined)).toBe("basic");
	});

	it("should handle arrays of classes", () => {
		expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3");
	});

	it("should handle objects of classes", () => {
		expect(cn({ "bg-red-500": true, "text-white": false })).toBe("bg-red-500");
	});
});

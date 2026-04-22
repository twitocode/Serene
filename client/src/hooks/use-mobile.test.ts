import { afterEach, describe, expect, it, mock } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
	const originalInnerWidth = window.innerWidth;
	const originalMatchMedia = window.matchMedia;

	afterEach(() => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: originalInnerWidth,
		});
		window.matchMedia = originalMatchMedia;
	});

	it("should return true when innerWidth is less than 768", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: 500,
		});

		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(true);
	});

	it("should return false when innerWidth is 768 or greater", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: 1024,
		});

		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);
	});

	it("should update when window is resized", () => {
		let changeListener: (() => void) | null = null;

		window.matchMedia = mock((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: mock((event: string, cb: () => void) => {
				if (event === "change") changeListener = cb;
			}),
			removeEventListener: mock(() => {}),
			dispatchEvent: () => false,
		})) as unknown as typeof window.matchMedia;

		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: 1024,
		});

		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);

		act(() => {
			Object.defineProperty(window, "innerWidth", {
				writable: true,
				configurable: true,
				value: 500,
			});
			if (changeListener) changeListener();
		});

		expect(result.current).toBe(true);

		act(() => {
			Object.defineProperty(window, "innerWidth", {
				writable: true,
				configurable: true,
				value: 1024,
			});
			if (changeListener) changeListener();
		});

		expect(result.current).toBe(false);
	});
});

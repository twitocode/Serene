import { expect, mock } from "bun:test";
import * as matchers from "@testing-library/jest-dom/matchers";
import { JSDOM } from "jsdom";

expect.extend(matchers);

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
	url: "http://localhost",
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
global.window = dom.window as any;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.Node = dom.window.Node;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLButtonElement = dom.window.HTMLButtonElement;
global.HTMLAnchorElement = dom.window.HTMLAnchorElement;
global.HTMLInputElement = dom.window.HTMLInputElement;
global.HTMLSelectElement = dom.window.HTMLSelectElement;
global.HTMLTextAreaElement = dom.window.HTMLTextAreaElement;
global.SVGElement = dom.window.SVGElement;
global.CustomEvent = dom.window.CustomEvent;
global.MouseEvent = dom.window.MouseEvent;
global.KeyboardEvent = dom.window.KeyboardEvent;
global.FocusEvent = dom.window.FocusEvent;
global.Event = dom.window.Event;

// TextEncoder/Decoder polyfills
global.TextEncoder = require("node:util").TextEncoder;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
global.TextDecoder = require("node:util").TextDecoder as any;

// matchMedia polyfill
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	}),
});

global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock next/image
// @ts-ignore
mock.module("next/image", () => ({
	__esModule: true,
	default: (props: any) => {
		const { src, alt, width, height, ...rest } = props;
		const srcPath = typeof src === "object" ? src.src : src;
		// biome-ignore lint/a11y/useAltText: <explanation>
		return <img src={srcPath} alt={alt} {...rest} />;
	},
}));

// Mock motion/react
// @ts-ignore
mock.module("motion/react", () => {
	const React = require("react");
	const mockComponent = (tag: string) => {
		return React.forwardRef(({ children, ...props }: any, ref: any) => {
			const {
				whileInView,
				viewport,
				transition,
				initial,
				animate,
				exit,
				variants,
				whileHover,
				whileTap,
				onAnimationComplete,
				onUpdate,
				onAnimationStart,
				...filteredProps
			} = props;
			return React.createElement(tag, { ...filteredProps, ref }, children);
		});
	};

	return {
		motion: {
			div: mockComponent("div"),
			section: mockComponent("section"),
			h1: mockComponent("h1"),
			p: mockComponent("p"),
			span: mockComponent("span"),
			button: mockComponent("button"),
			nav: mockComponent("nav"),
			header: mockComponent("header"),
			footer: mockComponent("footer"),
			main: mockComponent("main"),
			a: mockComponent("a"),
			img: mockComponent("img"),
			svg: mockComponent("svg"),
		},
		AnimatePresence: ({ children }: any) => children,
	};
});

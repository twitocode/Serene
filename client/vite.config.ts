import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";

const serverConfig =
	process.env.NODE_ENV === "development"
		? {
				https: false, // Enable HTTPS for Vite dev server
				strictPort: true,
				cors: true
			}
		: {
				https: true, // Enable HTTPS for Vite dev server
				strictPort: true,
				cors: true
			};

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson(), basicSsl()],
	server: {
		port: 3000,
		host: "localhost", // Important for the SSL cert
		...serverConfig
	},
	test: {
		projects: [
			{
				extends: "./vite.config.ts",
				test: {
					name: "client",
					environment: "browser",
					browser: {
						enabled: true,
						provider: "playwright",
						instances: [{ browser: "chromium" }]
					},
					include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
					exclude: ["src/lib/server/**"],
					setupFiles: ["./vitest-setup-client.ts"]
				}
			},
			{
				extends: "./vite.config.ts",
				test: {
					name: "server",
					environment: "node",
					include: ["src/**/*.{test,spec}.{js,ts}"],
					exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"]
				}
			}
		]
	}
});

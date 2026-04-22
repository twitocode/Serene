export async function register() {
	console.log("[Instrumentation] Registering...", process.env.NEXT_RUNTIME, process.env.NEXT_PUBLIC_API_MOCKING);
	if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
		console.log("[Instrumentation] Enabling MSW Node server...");
		const { server } = await import("./mocks/node");
		server.listen({ onUnhandledRequest: "bypass" });
	}
}

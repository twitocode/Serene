import { redirect } from "next/navigation";
import type React from "react";
import { getSession } from "@/lib/get-session";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();

	if (!session?.user?.data?.roles?.includes("Admin")) {
		redirect("/home");
	}

	return (
		<div className="min-h-screen bg-gray-50 flex">
			<aside className="w-64 bg-white border-r h-screen fixed overflow-y-auto">
				<div className="p-6">
					<h1 className="text-xl font-bold">Admin Panel</h1>
				</div>
				<nav className="p-4 space-y-2">
					<a
						href="/admin/content"
						className="block px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-100 font-medium"
					>
						Content
					</a>
					<a
						href="/admin/feedback"
						className="block px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-100 font-medium"
					>
						Feedback
					</a>
					<a
						href="/admin/schools"
						className="block px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-100 font-medium"
					>
						Schools
					</a>
					<a
						href="/home"
						className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
					>
						Back to App
					</a>
				</nav>
			</aside>
			<main className="ml-64 flex-1 p-8">{children}</main>
		</div>
	);
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Footer from "@/lib/components/common/footer";
import { Navbar } from "@/lib/components/common/navbar";
import LandingPage from "@/lib/components/landing/landing-page";
import { Button } from "@/lib/components/ui/button";
import { getSession } from "@/lib/get-session";

export const metadata: Metadata = {
	title: "Serene",
};
export default async function Home() {
	const session = await getSession();

	if (session?.user) {
		redirect("/home");
	}

	return <LandingPage />;
}

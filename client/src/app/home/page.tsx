import type { Metadata } from "next";
import HomePage from "@/lib/components/home/home-page";

export const metadata: Metadata = {
	title: "Home | Serene",
};

export default function page() {
	return (
		<>
			<HomePage />
		</>
	);
}

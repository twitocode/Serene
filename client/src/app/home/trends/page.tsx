import type { Metadata } from "next";
import TrendsPage from "@/lib/components/trends/trends-page";

export const metadata: Metadata = {
	title: "Trends | Serene",
};

export default function page() {
	return <TrendsPage />;
}

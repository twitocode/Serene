import type { Metadata } from "next";
import ExplorePage from "@/lib/components/explore/explore-page";

export const metadata: Metadata = {
	title: "Explore | Serene",
};
export default function page() {
	return <ExplorePage />;
}

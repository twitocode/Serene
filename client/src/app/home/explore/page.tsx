import ExplorePage from "@/lib/components/explore/explore-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore | Serene",
};
export default function page() {
  return <ExplorePage />;
}

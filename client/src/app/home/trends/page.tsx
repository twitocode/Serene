import TrendsPage from "@/lib/components/trends/trends-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trends | Serene",
};

export default function page() {
  return <TrendsPage />;
}

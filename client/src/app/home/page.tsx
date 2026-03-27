import HomePage from "@/lib/components/home/home-page";
import { Metadata } from "next";

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
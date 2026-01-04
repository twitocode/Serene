
import QuestionOfTheDay from "@/lib/components/community/qotd";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Community | Serene",
};

export default function page() {
  return (
    <div>
      <QuestionOfTheDay />
    </div>
  )
}
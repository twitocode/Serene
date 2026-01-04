import Footer from "@/lib/components/common/footer";
import { Navbar } from "@/lib/components/common/navbar";
import { Button } from "@/lib/components/ui/button";
import { getSession } from "@/lib/get-session";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Serene",
};
export default async function Home() {
  const session = await getSession();

  if (session?.user) {
    redirect("/home");
  }

  return (
    <>
      <div className=" mx-40 mt-5 space-y-40">
        <Navbar />
        <section className="flex flex-col items-center justify-center space-y-4 mx-40">
          <h1 className="font-bold text-7xl text-center">
            A <span className="text-primary">Student's Companion</span> for the
            Ups and Downs
          </h1>
          <p className="text-center">
            Navigate academic stress with CBT-backed tools, track your wellness
            patterns, and build a safety plan—all with a companion who’s got
            your back.
          </p>
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </section>
        <section>
          <h1 className="font-semibold text-4xl">Student Struggles</h1>
        </section>
      </div>
      <Footer />
    </>
  );
}

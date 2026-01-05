"use client";
import Footer from "@/lib/components/common/footer";
import { Navbar } from "@/lib/components/common/navbar";
import { Button } from "@/lib/components/ui/button";
import { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <>
      <div className="light mx-40 mt-5 space-y-40">
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
          <a href="/signup">
            <Button>Get Started</Button>
          </a>
        </section>
        <section>
          <h1 className="font-semibold text-4xl">Student Struggles</h1>
        </section>
      </div>
      <Footer />
    </>
  );
}

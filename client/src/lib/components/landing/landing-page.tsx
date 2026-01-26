"use client";
import Footer from "@/lib/components/common/footer";
import { Navbar } from "@/lib/components/common/navbar";
import { Button } from "@/lib/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-background">

        <div className="absolute top-20 left-10 w-64 h-64 blob blob-periwinkle opacity-30 animate-blob" />
        <div
          className="absolute top-40 right-20 w-48 h-48 blob blob-coral opacity-25 animate-blob"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-56 h-56 blob blob-lime opacity-20 animate-blob"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute bottom-20 right-1/3 w-40 h-40 blob blob-sage opacity-25 animate-blob"
          style={{ animationDelay: "3s" }}
        />


        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          viewBox="0 0 1000 800"
          preserveAspectRatio="none"
        >
          <path
            d="M0,400 Q250,300 500,400 T1000,400"
            stroke="#EB937F"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0,500 Q250,400 500,500 T1000,500"
            stroke="#7F9DEB"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="relative z-10 mx-8 md:mx-20 lg:mx-40 mt-5 space-y-70 pb-20">
          <Navbar />
          <section className="flex flex-col items-center justify-center space-y-6 mx-4 md:mx-20 lg:mx-30 pt-10">
            <h1 className="font-extrabold text-5xl md:text-6xl lg:text-7xl xl:text-9xl text-center text-slate leading-tight font-yeasty">
              find your <span className="text-navy">calm</span>
            </h1>
            <p className="text-center text-lg md:text-xl text-sage max-w-2xl leading-relaxed">
              Navigate academic stress with CBT-backed tools, track your
              wellness patterns, and build a safety plan—all with a companion
              who&apos;s got your back.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="text-lg px-10 py-6 h-auto shadow-lg hover:shadow-xl"
              >
                Get Started
              </Button>
            </Link>
          </section>

          <section className="text-center space-y-6">
            <h2 className="font-bold text-3xl md:text-4xl text-slate">
              A Student&apos;s Companion
            </h2>
            <p className="text-sage max-w-xl mx-auto">
              Designed with care for the ups and downs of student life.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

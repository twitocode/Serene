import Link from "next/link";
import Footer from "../components/ui/Footer";
import Navbar from "../components/ui/Navbar";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="mt-12 space-y-24">
        <section className="hero-content text-center md:mx-48">
          <div className="hero flex flex-col items-center space-y-16">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="font-noto flex-1 text-5xl font-bold">
                Your mental wellness, made simple.
              </h1>
              <p>Put some random text here i dunno</p>
            </div>
            <div className="space-x-2 flex">
              <Button asChild>
                <Link className="" href="/signup">
                  Sign up
                </Link>
              </Button>
              <Button asChild>
                <Link className="" href="/login">
                  Or login
                </Link>
              </Button>
            </div>
            {/* <!-- Put a proper screenshot here later --> */}
            <div className="mockup-browser border-base-300 w-full border">
              <div className="mockup-browser-toolbar">
                <div className="input">https://serene.vercel.app</div>
              </div>
              <div className="border-base-300 grid h-[40rem] place-content-center border-t">
                Serene applications here!
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}

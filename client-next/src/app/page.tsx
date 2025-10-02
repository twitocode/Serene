import Footer from "@/lib/components/common/Footer";
import Navbar from "@/lib/components/common/Navbar";
import { Button } from "@/lib/components/ui/button";
import Link from "next/link";

export default function Landing({ data }: any) {
  return (<>  
<Navbar user={data.user} />
  <div className="mt-12 space-y-24">
    <section className="hero-content text-center md:mx-48">
      <div className="hero flex flex-col items-center space-y-16">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="font-noto flex-1 text-5xl font-bold">Your mental wellness, made simple.</h1>
          <p>Put some random text here i dunno</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <a className="" href="/signup"> Sign up </a>
          </Button>
          <Button ><Link href="/login">Or Login</Link></Button>
        </div>
        {/*TODO Put a proper screenshot here later*/}
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
  )
}

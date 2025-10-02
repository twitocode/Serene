	import { Button } from '@/lib/components/ui/button';
import type { User } from "@/lib/types";
import Link from "next/link";

export default function Navbar({isSignup = false, user}: { isSignup?: boolean, user?: User }) {
  return (
    <nav className={`flex navbar pt-10 px-10 ${isSignup ? "" : "md:px-96"}`}>
      <div className="flex-1">
        <a href="/" className="text-xl">
          Serene
        </a>
      </div>
      <div className="md:space-x-2">
        {user && (
          <Button variant="default">
            <Link href="/home">Go to Serene</Link>
          </Button>)
        }
        {!user && (
            <><Button variant="default">
          <Link href="/signup">Sign up</Link>
        </Button>
        <Button variant="ghost">
          <Link href="/login">Or login</Link>
        </Button></>
      )}
      </div>
    </nav>

  )
}
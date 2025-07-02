import Link from "next/link";
import { Button } from "./button";

export default function Navbar({ isSignup = false }: { isSignup?: boolean }) {
  return (
    <nav className={`flex navbar pt-10 px-10 ${isSignup ? "" : "md:px-96"}`}>
      <div className="flex-1">
        <Link href="/" className="text-xl">
          Serene
        </Link>
      </div>
      <div className="md:space-x-2">
        <Button asChild variant="default">
          <Link href="/signup">
            Sign up
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/login">
            Or login
          </Link>
        </Button>
      </div>
    </nav>
  );
}

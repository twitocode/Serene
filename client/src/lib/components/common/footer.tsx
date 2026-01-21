import SereneLogo from "@/lib/components/common/serene-logo";
import { Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex flex-col items-center justify-center bg-coral h-60 w-screen  space-y-10">
      <div className="w-full flex justify-center items-center">
        <SereneLogo className="text-white" />
      </div>
      <ul className="list-none w-full flex gap-4 justify-center">
        <li className="bg-navy text-white p-2 rounded-xl text-center">
          <Link
            href="https://github.com/twitocode/serene"
            className="text-center"
          >
            <Github />
          </Link>
        </li>
        {/* <li>
          <Link href="https://github.com/twitocode/serene">
            <Github />
          </Link>
        </li> */}
      </ul>
    </div>
  );
}

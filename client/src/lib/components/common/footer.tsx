import SereneLogo from "@/lib/components/common/serene-logo";
import { Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-primary text-primary-foreground fixed bottom-0 w-full">
      <div className="px-40 py-20 flex flex-col items-center justify-center space-y-10">
        <SereneLogo />
        <Link href="" className="hover:opacity-50">
          <Github />
        </Link>
      </div>
    </div>
  );
}

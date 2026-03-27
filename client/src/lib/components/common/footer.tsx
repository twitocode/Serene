import SereneLogo from "@/lib/components/common/serene-logo";
import { Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/80 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 py-14 md:flex-row md:justify-between md:px-10">
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <SereneLogo className="text-primary-foreground [&_span]:text-primary-foreground" />
          <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/85">
            A calm corner for checking in, reflecting, and growing, one day at a
            time.
          </p>
        </div>
        <Link
          href="https://github.com/twitocode/serene"
          className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/20"
          target="_blank"
          rel="noreferrer"
        >
          <Github className="size-4" />
          Source on GitHub
        </Link>
      </div>
    </footer>
  );
}

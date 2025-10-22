import DailyAffirmation from "@/lib/components/home/DailyAffirmations";
import { Button } from "@/lib/components/ui/button";
import type { User } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function page() {
  // const user = getContext<User>("user");
  const user: Partial<User> = {};
  function getGreetingTime() {
    let currentHour = new Date().getHours();
    let greeting;

    if (currentHour >= 18 && currentHour < 24) {
      greeting = "Evening";
    } else if (currentHour >= 12 && currentHour < 18) {
      greeting = "Afternoon";
    } else {
      greeting = "Morning";
    }

    return greeting;
  }

  return (
    <main className="flex flex-col gap-8">
      <section className="flex flex-col items-center justify-center">
        <DailyAffirmation />
        <h1 className="text-center font-serif text-8xl font-light">
          Good {getGreetingTime()}
          {user.firstName}
        </h1>
      </section>
      <section></section>
      <section className="grid grid-cols-2 gap-4">
        <div className="items-left flex w-full flex-col justify-between bg-primary-400 border-20 rounded-lg border-primary p-4">
          <div>
            <h1 className="font-bold ">
              Talk about how you are currently feeling right now
            </h1>
          </div>
          <Button variant="outline" className="max-w-4/5 w-auto">
            <Link href="/home/reflect">
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="items-left flex w-full flex-col justify-between bg-gray-400 p-4">
          <Button className="group relative flex h-80 w-80 items-center justify-center overflow-hidden rounded-full bg-primary shadow-lg">
            <Link href="/home/ambience">
              {/* <!-- Outer Layer Glow --> */}
              <span className="absolute inset-0 rounded-full bg-primary opacity-50 transition group-hover:opacity-70"></span>

              {/* <!-- Middle Layer (border effect) --> */}
              <span className="absolute inset-2 rounded-full border-4 border-red-300"></span>

              {/* <!-- Inner Circle --> */}
              <span className="relative flex h-40 w-40 items-center justify-center rounded-full bg-red-500">
                {/* <!-- Play Icon (Triangle) --> */}
                <svg
                  className="h-80 w-80 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </Link>
          </Button>
        </div>

        <div className="max-h-40 w-full bg-gray-400">Hey</div>
      </section>
    </main>
  );
}

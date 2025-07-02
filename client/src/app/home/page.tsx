"use client"
import { SidebarInset } from "@/components/ui/sidebar";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react"

const time = "";

function getTime(): string {
  const times = [
    { name: "Morning", start: 4, end: 12 },
    { name: "Afternoon", start: 12, end: 17 },
    { name: "Evening", start: 17, end: 20 },
    { name: "Night", start: 20, end: 23 },
  ];

  var now = new Date();
  const hours = now.getHours();

  // Iterate through times of day
  for (var i = 0; i <= 3; i++) {
    // If this time of day matches
    if (hours >= times[i].start && hours < times[i].end) {
      return times[i].name;
    }
  }

  return "INVALID TIME";
}

function getDate(): string {
  var now = new Date();

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = days[now.getDay()];
  const date = now.getDate();
  const year = now.getFullYear();
  const month = months[now.getMonth()];

  return `${day} ${month} ${date}, ${year}`;
}

export default function Home() {
  return (
    <SidebarInset className="flex flex-col items-center w-full">
      <section className="flex flex-col items-center mt-40 space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4, 
            scale: { type: "tween", visualDuration: 0.4, bounce: 0.5 },
          }}
          className="scroll-m-20 text-7xl font-extrabold tracking-tight lg:text-5xl font-noto"
        >
          Good {getTime()}
        </motion.div>
        <p>{getDate()}</p>
        <Button asChild className="flex space-x-4 items-center p-4">
          <Link href="/home/reflect" className="">
            <Pencil />
            <span>How are you currently feeling today?</span>
          </Link>
        </Button>
      </section>
      <section></section>
      <section></section>
    </SidebarInset>
  );
}

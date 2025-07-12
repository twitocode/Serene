"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { Angry, ChevronRight, Laugh, Meh, Smile } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../../components/ui/button";

const emotions = [
  {
    name: "Sad",
    icon: Smile,
  },
  {
    name: "Angry",
    icon: Angry,
  },
  {
    name: "Neutral",
    icon: Meh,
  },
  {
    name: "Joyful",
    icon: Laugh,
  },
];
export default function ReflectPage() {
  return (
    <SidebarInset className="flex flex-col items-center w-full h-full">
      <section className="w-11/12 h-11/12 flex items-center ">
        <Card className="h-full flex-1 pt-24 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-6xl font-noto font-light">
              How are you feeling about your{" "}
              <span className="font-bold">current emotions?</span>
            </CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between">
            {emotions.map((x, key) => {
              return (
                <motion.div
                  key={key}
                  whileHover={{
                    color: "red"
                  }}
                  className="flex flex-col items-center space-y-4"
                >
                  <span className="font-medium text-xl">{x.name}</span>
                  <x.icon className="w-24 h-24" />
                </motion.div>
              );
            })}
          </CardContent>
          <CardFooter>
            <Button className="w-full " >
              <ChevronRight />
              <span>Next Question</span>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </SidebarInset>
  );
}

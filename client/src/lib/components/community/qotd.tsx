"use client";

import { motion } from "motion/react";
import { Metadata } from "next";

import { useState } from "react";
import { Star } from "lucide-react"; // Using lucide-react (standard with shadcn)
import { Input } from "@/lib/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useQOTD } from "@/lib/hooks/queries/use-qotd";

// --- Types ---
type Response = {
  id: string;
  name: string;
  avatarSrc?: string; // Optional image URL
  fallbackColor?: string; // Optional background color for icon avatars
  text: string;
  isMe?: boolean;
};

// --- Mock Data ---
const MOCK_RESPONSES: Response[] = [
  {
    id: "1",
    name: "Toheeb",
    fallbackColor: "bg-orange-400", // Custom color for the star user
    text: "Esse dolor consequat laboris et veniam ipsum enim ex magna et.",
    isMe: true,
  },
  {
    id: "2",
    name: "Amelia",
    avatarSrc: "https://i.pravatar.cc/150?u=amelia",
    text: "Esse dolor consequat laboris et veniam ipsum enim ex magna et.",
  },
  {
    id: "3",
    name: "Amelia",
    avatarSrc: "https://i.pravatar.cc/150?u=amelia",
    text: "Esse dolor consequat laboris et veniam ipsum enim ex magna et.",
  },
];

// --- Components ---

const ResponseCard = ({ response }: { response: Response }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      // Matches the specific grey from your screenshot
      className="bg-[#AFAFAF] bg-opacity-80 p-6 rounded-2xl w-full flex flex-col gap-3 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <Avatar>
          {/* If there is an image, show it */}
          {response.avatarSrc && <AvatarImage src={response.avatarSrc} />}

          {/* Fallback for when there is no image (like Toheeb) */}
          <AvatarFallback
            className={`${response.fallbackColor || "bg-gray-400"} text-white`}
          >
            {response.fallbackColor ? (
              <Star className="w-5 h-5 fill-current" />
            ) : (
              response.name[0]
            )}
          </AvatarFallback>
        </Avatar>

        <span className="font-medium text-black text-lg">{response.name}</span>
      </div>
      <p className="text-black text-base leading-relaxed">{response.text}</p>
    </motion.div>
  );
};

export default function QuestionOfTheDay() {
  const {data: qotd} = useQOTD();

  const [inputText, setInputText] = useState("");
  
  const myResponse = MOCK_RESPONSES.find((r) => r.isMe);
  const otherResponses = MOCK_RESPONSES.filter((r) => !r.isMe);

  return (
    <div className="min-h-screen bg-white text-black p-8 max-w-2xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-semibold text-center mt-4"
      >
        Community
      </motion.h1>

      {/* Question Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4 mt-8"
      >
        <div>
          <span className="text-lg font-medium text-gray-800">
            Question of the Day
          </span>
          <h2 className="text-3xl font-bold mt-1 leading-tight">{qotd?.question}</h2>
        </div>

        {/* Shadcn Input with custom styling to match design */}
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your response here"
          className="w-full bg-gray-200 border-none rounded-xl px-5 py-6 text-base text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-gray-300"
        />
      </motion.div>

      {/* My Response Section */}
      {myResponse && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-medium">My Response</h3>
          <ResponseCard response={myResponse} />
        </div>
      )}

      {/* Shadcn Separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="w-full"
      >
        <Separator className="bg-gray-300 h-[2px] my-2" />
      </motion.div>

      {/* Other Responses List */}
      <div className="flex flex-col gap-4">
        {otherResponses.map((response) => (
          <ResponseCard key={response.id} response={response} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion } from "motion/react";

import { Avatar, AvatarFallback } from "@/lib/components/ui/avatar";
import { Input } from "@/lib/components/ui/input";
import { Separator } from "@/lib/components/ui/separator";
import {
  useQOTDQuery,
  useQOTDResponseMutation,
  useQOTDResponsesQuery,
} from "@/lib/hooks/queries/use-qotd";
import { useUserQuery } from "@/lib/hooks/queries/use-user";
import { QOTDAnswerDto } from "@/lib/types/api-types";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

// --- Components ---

const ResponseCard = ({
  response,
  isMe,
}: {
  response: QOTDAnswerDto;
  isMe?: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#AFAFAF] bg-opacity-80 p-6 rounded-2xl w-full flex flex-col gap-3 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback
            className={`${isMe ? "bg-orange-400" : "bg-gray-400"} text-white`}
          >
            {isMe ? (
              <Star className="w-5 h-5 fill-current" />
            ) : (
              response.username?.[0] || "?"
            )}
          </AvatarFallback>
        </Avatar>

        <span className="font-medium text-black text-lg">
          {isMe ? "You" : response.username || "Anonymous"}
        </span>
      </div>
      <p className="text-black text-base leading-relaxed">{response.answer}</p>
    </motion.div>
  );
};

export default function QuestionOfTheDay() {
  const today = new Date().toISOString().split("T")[0];

  const { data: user } = useUserQuery();
  const { data: qotd } = useQOTDQuery();
  const { data: responses = [] } = useQOTDResponsesQuery(today);
  const [hasPosted, setHasPosted] = useState(false);
  const mutation = useQOTDResponseMutation();

  const [inputText, setInputText] = useState("");

  const myResponse = responses.find((r) => r.userId === user?.id);

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputText.trim() && qotd?.qotdId && !myResponse) {
      mutation.mutate(
        {
          qotdId: qotd.qotdId,
          response: inputText.trim(),
        },
        {
          onSuccess: () => setInputText(""),
        }
      );
    }
  };

  useEffect(() => {
    if (responses.find(x => x.userId == user?.id) != null) {
      console.log("posted")
      setHasPosted(true)
    }
    console.log("not  posted")
  }, [responses])

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
          <h2 className="text-3xl font-bold mt-1 leading-tight">
            {qotd?.question || "Loading today's question..."}
          </h2>
        </div>

        {/* Answer Input */}
        {!hasPosted && (
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleSubmit}
            disabled={mutation.isPending}
            placeholder={
              mutation.isPending
                ? "Submitting..."
                : "Type your response here and press Enter"
            }
            className="w-full bg-gray-200 border-none rounded-xl px-5 py-6 text-base text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-gray-300"
          />
        )}
      </motion.div>

      {/* My Response Section */}
      {myResponse && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-medium">My Response</h3>
          <ResponseCard response={myResponse} isMe />
        </div>
      )}

      {/* Separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="w-full"
      >
        <Separator className="bg-gray-300 h-[2px] my-2" />
      </motion.div>

      {/* Other Responses List */}
      <div className="flex flex-col gap-4">
        {responses.length > 0 ? (
          responses.map(
            (response) =>
              response.userId != user?.id && (
                <ResponseCard key={response.userId} response={response} />
              )
          )
        ) : (
          <p className="text-center text-gray-500 py-8">
            No responses yet. Be the first to answer!
          </p>
        )}
      </div>
    </div>
  );
}

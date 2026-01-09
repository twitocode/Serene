"use client";

import { motion } from "motion/react";

import { ResponseCard } from "@/lib/components/community/response-card";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Separator } from "@/lib/components/ui/separator";
import {
  useQOTDQuery,
  useQOTDResponseMutation,
  useQOTDResponsesQuery,
} from "@/lib/hooks/queries/use-qotd";
import { useUserQuery } from "@/lib/hooks/queries/use-user";
import { FormEventHandler, useEffect, useState } from "react";

export default function QuestionOfTheDay() {
  const today = new Date().toISOString().split("T")[0];

  const { data: user } = useUserQuery();
  const { data: qotd } = useQOTDQuery();
  const { data: responses = [] } = useQOTDResponsesQuery(today);
  const mutation = useQOTDResponseMutation();

  const [hasPosted, setHasPosted] = useState(false);
  const [inputText, setInputText] = useState("");

  const myResponse = responses.find((r) => r.userId === user?.id);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (inputText.trim() && qotd?.qotdId && !myResponse) {
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
    if (responses.find((x) => x.userId == user?.id) != null) {
      console.log("posted");
      setHasPosted(true);
    }
    console.log("not  posted");
  }, [responses]);

  return (
    <div className="min-h-full max-w-2xl mx-auto flex flex-col  px-4">
      <div className="sticky top-0 z-10 bg-background/95  px-8 pt-8 pb-4 background-blur">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-semibold text-center mt-4 font-serif"
        >
          Community
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4 mt-8"
        >
          <div>
            <span className="text-lg font-medium text-foreground">
              Question of the Day
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-1 leading-tight">
              {qotd?.question || "Loading today's question..."}
            </h2>
          </div>

          {!hasPosted && (
            <form
              onSubmit={handleSubmit}
              className="flex space-x-2 items-center"
            >
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={mutation.isPending}
                placeholder={
                  mutation.isPending
                    ? "Submitting..."
                    : "Type your response here and press Enter"
                }
                className="w-full bg-gray-200 border border-gray-300 px-5 py-6 text-base text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-gray-300 shadow-sm"
              />
              <Button
                type="submit"
                className="py-6 shadow-sm border border-gray-300"
              >
                Respond
              </Button>
            </form>
          )}
        </motion.div>
      </div>

      <div className="px-8 pt-4 pb-8 flex flex-col gap-8">
        {myResponse && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-medium">My Response</h3>
            <ResponseCard response={myResponse} isMe />
          </div>
        )}

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="w-full"
        >
          <Separator className="bg-gray-300 h-[2px] my-2" />
        </motion.div>

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
    </div>
  );
}

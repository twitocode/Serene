"use client";

import { motion } from "motion/react";

import InterestPicker from "@/lib/components/community/interest-picker";
import PeerMatchCard from "@/lib/components/community/peer-match-card";
import { PeerMatchSection } from "@/lib/components/community/peer-match-section";
import { QOTDSkeleton } from "@/lib/components/community/qotd-skeleton";
import { ResponseCard } from "@/lib/components/community/response-card";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Separator } from "@/lib/components/ui/separator";
import { getCurrentDate } from "@/lib/helpers/get-current-date";
import { useInterestsQuery } from "@/lib/hooks/queries/use-peers";
import {
  useQOTDQuery,
  useQOTDResponseMutation,
  useQOTDResponsesQuery,
} from "@/lib/hooks/queries/use-qotd";
import { useUserQuery } from "@/lib/hooks/queries/use-user";
import { FormEventHandler, useEffect, useState } from "react";

export default function QuestionOfTheDay() {
  const today = getCurrentDate();

  const { data: user } = useUserQuery();
  const { data: qotd, isPending: qotdPending } = useQOTDQuery();
  const { data: responses = [], isPending: responsesPending } =
    useQOTDResponsesQuery(today);
  const mutation = useQOTDResponseMutation();

  const isPending = qotdPending || responsesPending;

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
        },
      );
    }
  };

  useEffect(() => {
    if (responses.find((x) => x.userId == user?.id) != null) {
      setHasPosted(true);
    }
  }, [responses, user?.id]);

  if (isPending) {
    return <QOTDSkeleton />;
  }

  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col px-4 pb-12 pt-6 md:px-6">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Together
        </p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Community
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Share honestly. Everyone&apos;s here to listen, not to judge.
        </p>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card-organic mb-8 border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur-sm md:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Question of the day
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-foreground md:text-3xl">
          {qotd?.question || "Loading today's question..."}
        </h2>

        {!hasPosted && (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={mutation.isPending}
              placeholder={
                mutation.isPending
                  ? "Submitting..."
                    : "Write a thought (short is okay)"
              }
              className="h-12 flex-1 rounded-xl border-border/80 bg-background px-4 text-base shadow-none"
            />
            <Button
              type="submit"
              className="h-12 shrink-0 rounded-xl px-8"
              disabled={mutation.isPending || !inputText.trim()}
            >
              Share
            </Button>
          </form>
        )}
      </motion.section>

      <PeerMatchSection />

      {myResponse && (
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Your response
          </h3>
          <ResponseCard response={myResponse} isMe />
        </div>
      )}

      <div className="flex flex-col gap-6">
        <Separator className="bg-border/80" />

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Others today
          </h3>
          <div className="flex flex-col gap-4">
            {responses.some((r) => r.userId !== user?.id) ? (
              responses.map(
                (response) =>
                  response.userId != user?.id && (
                    <ResponseCard key={response.userId} response={response} />
                  ),
              )
            ) : (
              <p className="rounded-2xl border border-dashed border-border/80 bg-muted/20 py-12 text-center text-sm text-muted-foreground">
                {responses.length === 0
                  ? "No responses yet. You can be the first."
                  : "You're the only one who's shared so far. Others may join later today."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


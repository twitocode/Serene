"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { usePeerMatchQuery } from "@/lib/hooks/queries/use-peers";
import { Badge } from "@/lib/components/ui/badge";
import { Handshake, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const CONVERSATION_STARTERS: Record<string, string> = {
  "Music": "What song has been on repeat for you lately?",
  "Hiking": "What's a trail you've been wanting to try?",
  "Gaming": "What game have you been playing recently?",
  "Cooking": "What's the last thing you cooked that turned out great?",
  "Reading": "Read any good books lately?",
  "Photography": "What's the best photo you've taken recently?",
  "Art & Design": "Working on any creative projects?",
  "Fitness": "What's your go-to workout?",
  "Film & TV": "Watched anything good recently?",
  "Writing": "Are you working on anything you're excited about?",
  "Coding": "Built anything cool lately?",
  "Fashion": "Found any good style inspiration recently?",
  "Travel": "Where would you go if you could take a trip right now?",
  "Volunteering": "What cause matters most to you?",
  "Board Games": "What's your favorite game to play with friends?",
  "Dancing": "What kind of music makes you want to dance?",
  "Meditation": "How do you like to wind down?",
  "Sports": "Caught any good games lately?",
  "Podcasts": "Listening to anything interesting?",
  "Languages": "Which language would you love to learn next?",
};

function getStarter(interest: string): string {
  return CONVERSATION_STARTERS[interest] || `What do you enjoy most about ${interest.toLowerCase()}?`;
}

export default function PeerMatchCard() {
  const { data: match, isPending } = usePeerMatchQuery();

  if (isPending) return null;
  if (!match) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardHeader className="">
          <div className="flex items-center gap-2">
            <Handshake className="size-5 text-primary" />
            <CardTitle className="font-serif text-lg">
              Your wellness buddy
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
              {match.anonymousName.split(" ").map(w => w[0]).join("")}
            </div>
            <div>
              <p className="font-medium text-foreground">
                {match.anonymousName}
              </p>
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-3 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  {match.sharedInterest}
                </Badge>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-card px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Conversation starter
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground">
              {getStarter(match.sharedInterest)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Matched this week based on shared interests. Fully anonymous.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

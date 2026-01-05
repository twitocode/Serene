import { Avatar, AvatarFallback } from "@/lib/components/ui/avatar";
import { QOTDAnswerDto } from "@/lib/types/api-types";
import { Star } from "lucide-react";
import { motion } from "motion/react";

export const ResponseCard = ({
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
      className="bg-secondary bg-opacity-20 text-secondary-foreground p-6 rounded-2xl w-full flex flex-col gap-3 shadow-sm"
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

        <span className="font-medium text-lg">
          {isMe ? "You" : response.username || "Anonymous"}
        </span>
      </div>
      <p className="text-base leading-relaxed">{response.answer}</p>
    </motion.div>
  );
};

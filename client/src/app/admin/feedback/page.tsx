"use client";

import { useEffect, useState } from "react";
import {
  getFeedback,
  FeedbackDto,
} from "@/lib/client/admin-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function FeedbackAdminPage() {
  const [feedback, setFeedback] = useState<FeedbackDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedback = async () => {
    const res = await getFeedback();
    if (res.isSuccess && res.data) {
      setFeedback(res.data.feedback);
    } else {
      toast.error("Failed to fetch feedback");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">User Feedback</h2>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : feedback.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No feedback found.
                </TableCell>
              </TableRow>
            ) : (
              feedback.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap">{item.date}</TableCell>
                  <TableCell className="font-mono text-xs">{item.userId}</TableCell>
                  <TableCell className="max-w-xl break-words">
                    {item.message}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

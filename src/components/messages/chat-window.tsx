"use client";

import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getInitials } from "@/lib/utils";
import type { Message, Conversation } from "@/lib/types";

interface ChatWindowProps {
  messages: Message[];
  conversation: Conversation;
  currentUserId: string;
}

export function ChatWindow({ messages, conversation, currentUserId }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getDateLabel = (date: Date) => format(date, "MMMM d, yyyy");

  let lastDate = "";

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          const senderName = conversation.participantNames[msg.senderId] || "Unknown";
          let dateLabel = "";
          if (msg.createdAt) {
            const d = getDateLabel(msg.createdAt.toDate());
            if (d !== lastDate) {
              lastDate = d;
              dateLabel = d;
            }
          }

          return (
            <div key={msg.id}>
              {dateLabel && (
                <div className="flex items-center justify-center my-4">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {dateLabel}
                  </span>
                </div>
              )}
              {msg.type === "system" ? (
                <div className="flex justify-center">
                  <span className="text-xs text-muted-foreground italic">{msg.text}</span>
                </div>
              ) : (
                <div className={cn("flex gap-2", isMe ? "justify-end" : "justify-start")}>
                  {!isMe && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{getInitials(senderName)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-3 py-2 text-sm",
                      isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p>{msg.text}</p>
                    {msg.createdAt && (
                      <p className={cn(
                        "text-[10px] mt-1",
                        isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {format(msg.createdAt.toDate(), "h:mm a")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

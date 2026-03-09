"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, getInitials } from "@/lib/utils";
import type { Conversation } from "@/lib/types";

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  activeConversationId?: string;
}

export function ConversationList({ conversations, currentUserId, activeConversationId }: ConversationListProps) {
  return (
    <div className="space-y-1">
      {conversations.map((conv) => {
        const otherId = conv.participants.find((p) => p !== currentUserId) || "";
        const otherName = conv.participantNames[otherId] || "Unknown";
        const otherPhoto = conv.participantPhotos?.[otherId] || "";
        const unread = conv.unreadCount?.[currentUserId] || 0;
        const isActive = conv.id === activeConversationId;

        return (
          <Link
            key={conv.id}
            href={`/messages/${conv.id}`}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-accent",
              isActive && "bg-accent"
            )}
          >
            <Avatar>
              <AvatarImage src={otherPhoto} />
              <AvatarFallback>{getInitials(otherName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{otherName}</p>
                {conv.lastMessageAt && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(conv.lastMessageAt.toDate(), { addSuffix: true })}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage || "No messages yet"}</p>
                {unread > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                    {unread}
                  </Badge>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

"use client";

import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversationList } from "@/components/messages/conversation-list";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useConversations } from "@/lib/hooks/use-conversations";

export default function MessagesPage() {
  const profile = useAuthStore((s) => s.profile);
  const { conversations, loading } = useConversations(profile?.uid);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : conversations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-10">
            <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No conversations yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Messages will appear here when you connect with businesses or riders.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-2">
            <ConversationList
              conversations={conversations}
              currentUserId={profile!.uid}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

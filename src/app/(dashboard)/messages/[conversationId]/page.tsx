"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatWindow } from "@/components/messages/chat-window";
import { MessageInput } from "@/components/messages/message-input";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMessages } from "@/lib/hooks/use-conversations";
import type { Conversation } from "@/lib/types";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const profile = useAuthStore((s) => s.profile);
  const { messages, loading: messagesLoading } = useMessages(conversationId);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversation() {
      const snap = await getDoc(doc(db, "conversations", conversationId));
      if (snap.exists()) {
        setConversation({ id: snap.id, ...snap.data() } as Conversation);
      }
      setLoading(false);
    }
    loadConversation();
  }, [conversationId]);

  if (loading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-96" /></div>;
  }

  if (!conversation || !profile) {
    return <p className="text-center text-muted-foreground py-10">Conversation not found</p>;
  }

  const otherId = conversation.participants.find((p) => p !== profile.uid) || "";
  const otherName = conversation.participantNames[otherId] || "Unknown";

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 border-b pb-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/messages"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h2 className="font-semibold">{otherName}</h2>
        </div>
      </div>

      <ChatWindow
        messages={messages}
        conversation={conversation}
        currentUserId={profile.uid}
      />

      <MessageInput conversationId={conversationId} currentUserId={profile.uid} />
    </div>
  );
}

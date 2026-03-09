"use client";

import { useState, useEffect } from "react";
import { subscribeToConversations, subscribeToMessages } from "@/lib/firebase/firestore";
import type { Conversation, Message } from "@/lib/types";

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToConversations(userId, (data) => {
      setConversations(data);
      setLoading(false);
    });
    return () => unsub();
  }, [userId]);

  return { conversations, loading };
}

export function useMessages(conversationId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) return;
    const unsub = subscribeToMessages(conversationId, (data) => {
      setMessages(data);
      setLoading(false);
    });
    return () => unsub();
  }, [conversationId]);

  return { messages, loading };
}

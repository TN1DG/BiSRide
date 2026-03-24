import { useState, useEffect } from "react";
import {
  subscribeToConversations,
  subscribeToMessages,
} from "@/lib/firebase/firestore";
import type { Conversation, Message } from "@/lib/types";

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToConversations(
      userId,
      (data) => {
        setConversations(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setLoading(false);
        setError(err.message);
      }
    );
    return () => unsub();
  }, [userId]);

  return { conversations, loading, error };
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

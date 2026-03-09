"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage } from "@/lib/firebase/firestore";

interface MessageInputProps {
  conversationId: string;
  currentUserId: string;
}

export function MessageInput({ conversationId, currentUserId }: MessageInputProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await sendMessage(conversationId, {
        senderId: currentUserId,
        text: text.trim(),
        type: "text",
        readBy: [currentUserId],
      });
      setText("");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t p-4">
      <Input
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={sending}
      />
      <Button size="icon" onClick={handleSend} disabled={!text.trim() || sending}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, IconButton } from "react-native-paper";
import { sendMessage } from "@/lib/firebase/firestore";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

interface MessageInputProps {
  conversationId: string;
  currentUserId: string;
}

export default function MessageInput({
  conversationId,
  currentUserId,
}: MessageInputProps) {
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

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Type a message..."
        value={text}
        onChangeText={setText}
        mode="outlined"
        style={styles.input}
        disabled={sending}
        dense
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />
      <IconButton
        icon="send"
        iconColor={colors.white}
        containerColor={colors.primary}
        size={20}
        onPress={handleSend}
        disabled={!text.trim() || sending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    marginRight: spacing.xs,
    backgroundColor: colors.surface,
  },
});

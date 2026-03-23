import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { format } from "date-fns";
import { getInitials } from "@/lib/utils";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import type { Message, Conversation } from "@/lib/types";

interface MessageBubbleProps {
  message: Message;
  conversation: Conversation;
  currentUserId: string;
}

export default function MessageBubble({
  message,
  conversation,
  currentUserId,
}: MessageBubbleProps) {
  const isMe = message.senderId === currentUserId;
  const senderName =
    conversation.participantNames[message.senderId] || "Unknown";

  if (message.type === "system") {
    return (
      <View style={styles.systemContainer}>
        <Text variant="bodySmall" style={styles.systemText}>
          {message.text}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, isMe ? styles.containerMe : styles.containerOther]}
    >
      {!isMe && (
        <Avatar.Text size={28} label={getInitials(senderName)} style={styles.avatar} />
      )}
      <View
        style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}
      >
        <Text style={[styles.text, isMe && styles.textMe]}>{message.text}</Text>
        {message.createdAt && (
          <Text
            style={[styles.time, isMe ? styles.timeMe : styles.timeOther]}
          >
            {format(message.createdAt.toDate(), "h:mm a")}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  containerMe: {
    justifyContent: "flex-end",
  },
  containerOther: {
    justifyContent: "flex-start",
  },
  avatar: {
    marginRight: spacing.xs,
    alignSelf: "flex-end",
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  bubbleMe: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.divider,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
    color: colors.text,
  },
  textMe: {
    color: colors.white,
  },
  time: {
    fontSize: 10,
    marginTop: 4,
  },
  timeMe: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "right",
  },
  timeOther: {
    color: colors.textLight,
  },
  systemContainer: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  systemText: {
    color: colors.textLight,
    fontStyle: "italic",
    backgroundColor: colors.divider,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    overflow: "hidden",
  },
});

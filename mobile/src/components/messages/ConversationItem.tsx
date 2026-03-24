import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Avatar, Badge } from "react-native-paper";
import { formatDistanceToNow } from "date-fns";
import { getInitials } from "@/lib/utils";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import type { Conversation } from "@/lib/types";

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: string;
  onPress: (conversationId: string) => void;
}

export default function ConversationItem({
  conversation,
  currentUserId,
  onPress,
}: ConversationItemProps) {
  const otherId =
    conversation.participants.find((p) => p !== currentUserId) || "";
  const otherName = conversation.participantNames[otherId] || "Unknown";
  const otherPhoto = conversation.participantPhotos?.[otherId] || "";
  const unread = conversation.unreadCount?.[currentUserId] || 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(conversation.id)}
    >
      {otherPhoto ? (
        <Avatar.Image size={48} source={{ uri: otherPhoto }} />
      ) : (
        <Avatar.Text size={48} label={getInitials(otherName)} />
      )}
      <View style={styles.content}>
        <View style={styles.top}>
          <Text
            variant="titleSmall"
            numberOfLines={1}
            style={[styles.name, unread > 0 && styles.bold]}
          >
            {otherName}
          </Text>
          {conversation.lastMessageAt && (
            <Text variant="bodySmall" style={styles.time}>
              {formatDistanceToNow(conversation.lastMessageAt.toDate(), {
                addSuffix: true,
              })}
            </Text>
          )}
        </View>
        <View style={styles.bottom}>
          <Text
            variant="bodySmall"
            style={[styles.lastMessage, unread > 0 && styles.unreadMessage]}
            numberOfLines={1}
          >
            {conversation.lastMessage || "No messages yet"}
          </Text>
          {unread > 0 && (
            <Badge style={styles.badge} size={20}>
              {unread}
            </Badge>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  content: {
    flex: 1,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    flex: 1,
  },
  time: {
    color: colors.textLight,
    marginLeft: spacing.sm,
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  lastMessage: {
    color: colors.textSecondary,
    flex: 1,
  },
  bold: {
    fontWeight: "700",
  },
  unreadMessage: {
    fontWeight: "600",
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
});

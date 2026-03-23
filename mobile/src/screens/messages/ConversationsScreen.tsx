import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import ConversationItem from "@/components/messages/ConversationItem";
import EmptyState from "@/components/ui/EmptyState";
import { useAuthStore } from "@/lib/stores/authStore";
import { useConversations } from "@/lib/hooks/useConversations";
import { colors } from "@/theme/colors";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MessagesStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<MessagesStackParamList, "ConversationsList">;

export default function ConversationsScreen({ navigation }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const { conversations, loading } = useConversations(profile?.uid);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon="message-text-outline"
        title="No conversations yet"
        subtitle="Start a conversation by accepting a delivery or sending a proposal."
      />
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={conversations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ConversationItem
          conversation={item}
          currentUserId={profile!.uid}
          onPress={(id) => navigation.navigate("Chat", { conversationId: id })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

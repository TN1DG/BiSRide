import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import MessageBubble from "@/components/messages/MessageBubble";
import MessageInput from "@/components/messages/MessageInput";
import { subscribeToMessages } from "@/lib/firebase/firestore";
import { subscribeToConversations } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/lib/stores/authStore";
import { colors } from "@/theme/colors";
import type { Message, Conversation } from "@/lib/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { MessagesStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<MessagesStackParamList, "Chat">;

export default function ChatScreen({ route }: Props) {
  const { conversationId } = route.params;
  const profile = useAuthStore((s) => s.profile);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!profile) return;

    const unsubConv = subscribeToConversations(profile.uid, (convs) => {
      const conv = convs.find((c) => c.id === conversationId);
      if (conv) setConversation(conv);
    });

    const unsubMsgs = subscribeToMessages(conversationId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });

    return () => {
      unsubConv();
      unsubMsgs();
    };
  }, [conversationId, profile]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  if (loading || !conversation) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="bodyMedium" style={styles.emptyText}>
            No messages yet. Say hello!
          </Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              conversation={conversation}
              currentUserId={profile!.uid}
            />
          )}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: false })
          }
        />
      )}

      <MessageInput
        conversationId={conversationId}
        currentUserId={profile!.uid}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesList: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.textLight,
  },
});

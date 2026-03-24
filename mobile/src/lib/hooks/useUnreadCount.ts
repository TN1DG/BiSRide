import { useConversations } from "./useConversations";

export function useUnreadCount(userId: string | undefined) {
  const { conversations } = useConversations(userId);

  const totalUnread = conversations.reduce((sum, conv) => {
    return sum + (conv.unreadCount?.[userId!] || 0);
  }, 0);

  return totalUnread;
}

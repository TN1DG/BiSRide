import { create } from "zustand";

interface NotificationState {
  expoPushToken: string | null;
  hasPermission: boolean;
  setExpoPushToken: (token: string | null) => void;
  setHasPermission: (has: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  expoPushToken: null,
  hasPermission: false,
  setExpoPushToken: (expoPushToken) => set({ expoPushToken }),
  setHasPermission: (hasPermission) => set({ hasPermission }),
}));

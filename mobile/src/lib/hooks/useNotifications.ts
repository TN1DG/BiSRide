import { useEffect, useRef, useCallback } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useNotificationStore } from "@/lib/stores/notificationStore";
import { useAuthStore } from "@/lib/stores/authStore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log("Push notifications require a physical device");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId,
    })
  ).data;

  return token;
}

export function useNotifications() {
  const { expoPushToken, hasPermission, setExpoPushToken, setHasPermission } =
    useNotificationStore();
  const { user } = useAuthStore();
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  const initialize = useCallback(async () => {
    const token = await registerForPushNotifications();
    if (token) {
      setExpoPushToken(token);
      setHasPermission(true);

      // Store token in Firestore
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          expoPushTokens: arrayUnion(token),
        });
      }
    }
  }, [user, setExpoPushToken, setHasPermission]);

  useEffect(() => {
    initialize();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Handle foreground notification
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // Handle notification tap - deep linking
        const data = response.notification.request.content.data;
        console.log("Notification tapped:", data);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(
          responseListener.current
        );
      }
    };
  }, [initialize]);

  return { expoPushToken, hasPermission };
}

import { useEffect, useRef, useCallback } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useLocationStore } from "@/lib/stores/locationStore";
import { updateRiderLocation } from "@/lib/firebase/firestore";

const LOCATION_TASK_NAME = "bisride-background-location";

// Register background location task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Background location error:", error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const location = locations[0];
    if (location) {
      const store = useLocationStore.getState();
      store.setLocation(location.coords.latitude, location.coords.longitude);
      if (store.activeDeliveryId) {
        await updateRiderLocation(
          store.activeDeliveryId,
          location.coords.latitude,
          location.coords.longitude
        );
      }
    }
  }
});

export function useLocation() {
  const { latitude, longitude, isTracking, activeDeliveryId, setLocation, setTracking, setActiveDeliveryId } =
    useLocationStore();
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const throttleRef = useRef<number>(0);

  const requestPermissions = useCallback(async () => {
    const { status: foreground } =
      await Location.requestForegroundPermissionsAsync();
    if (foreground !== "granted") return false;

    const { status: background } =
      await Location.requestBackgroundPermissionsAsync();
    return background === "granted";
  }, []);

  const startTracking = useCallback(
    async (deliveryRequestId: string) => {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      setActiveDeliveryId(deliveryRequestId);
      setTracking(true);

      // Foreground tracking
      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 20,
          timeInterval: 10000,
        },
        (location) => {
          setLocation(location.coords.latitude, location.coords.longitude);
          const now = Date.now();
          if (now - throttleRef.current > 10000) {
            throttleRef.current = now;
            updateRiderLocation(
              deliveryRequestId,
              location.coords.latitude,
              location.coords.longitude
            );
          }
        }
      );

      // Background tracking
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 15000,
        distanceInterval: 30,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "BiSRide - Active Delivery",
          notificationBody: "Tracking your delivery location",
          notificationColor: "#1B5E20",
        },
      });
    },
    [requestPermissions, setActiveDeliveryId, setTracking, setLocation]
  );

  const stopTracking = useCallback(async () => {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      LOCATION_TASK_NAME
    );
    if (isRegistered) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
    setTracking(false);
    setActiveDeliveryId(null);
  }, [setTracking, setActiveDeliveryId]);

  useEffect(() => {
    return () => {
      if (watchRef.current) {
        watchRef.current.remove();
      }
    };
  }, []);

  return {
    latitude,
    longitude,
    isTracking,
    activeDeliveryId,
    startTracking,
    stopTracking,
  };
}

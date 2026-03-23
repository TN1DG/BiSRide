import { create } from "zustand";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  isTracking: boolean;
  activeDeliveryId: string | null;
  setLocation: (lat: number, lng: number) => void;
  setTracking: (tracking: boolean) => void;
  setActiveDeliveryId: (id: string | null) => void;
  reset: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  isTracking: false,
  activeDeliveryId: null,
  setLocation: (latitude, longitude) => set({ latitude, longitude }),
  setTracking: (isTracking) => set({ isTracking }),
  setActiveDeliveryId: (activeDeliveryId) => set({ activeDeliveryId }),
  reset: () =>
    set({
      latitude: null,
      longitude: null,
      isTracking: false,
      activeDeliveryId: null,
    }),
}));

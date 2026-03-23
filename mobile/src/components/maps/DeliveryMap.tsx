import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import type { GeoPoint } from "firebase/firestore";
import { colors } from "@/theme/colors";

interface DeliveryMapProps {
  pickupLocation: GeoPoint;
  dropoffLocation: GeoPoint;
  pickupLabel?: string;
  dropoffLabel?: string;
  riderLocation?: { latitude: number; longitude: number } | null;
  style?: object;
}

export default function DeliveryMap({
  pickupLocation,
  dropoffLocation,
  pickupLabel = "Pickup",
  dropoffLabel = "Dropoff",
  riderLocation,
  style,
}: DeliveryMapProps) {
  const pickup = {
    latitude: pickupLocation.latitude,
    longitude: pickupLocation.longitude,
  };
  const dropoff = {
    latitude: dropoffLocation.latitude,
    longitude: dropoffLocation.longitude,
  };

  const midLat = (pickup.latitude + dropoff.latitude) / 2;
  const midLng = (pickup.longitude + dropoff.longitude) / 2;
  const latDelta =
    Math.abs(pickup.latitude - dropoff.latitude) * 1.5 || 0.02;
  const lngDelta =
    Math.abs(pickup.longitude - dropoff.longitude) * 1.5 || 0.02;

  return (
    <MapView
      style={[styles.map, style]}
      initialRegion={{
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: Math.max(latDelta, 0.01),
        longitudeDelta: Math.max(lngDelta, 0.01),
      }}
    >
      <Marker coordinate={pickup} title={pickupLabel} pinColor="green" />
      <Marker coordinate={dropoff} title={dropoffLabel} pinColor="red" />
      {riderLocation && (
        <Marker
          coordinate={riderLocation}
          title="Rider"
          pinColor={colors.primary}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
  },
});

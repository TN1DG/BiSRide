import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import { subscribeToActiveDelivery } from "@/lib/firebase/firestore";
import { colors } from "@/theme/colors";
import type { ActiveDelivery } from "@/lib/types";

interface LiveTrackingMapProps {
  deliveryRequestId: string;
  style?: object;
}

const STATUS_LABELS: Record<string, string> = {
  heading_to_pickup: "Heading to pickup",
  picked_up: "Package picked up",
  in_transit: "In transit to dropoff",
};

export default function LiveTrackingMap({
  deliveryRequestId,
  style,
}: LiveTrackingMapProps) {
  const [delivery, setDelivery] = useState<ActiveDelivery | null>(null);

  useEffect(() => {
    const unsub = subscribeToActiveDelivery(deliveryRequestId, setDelivery);
    return () => unsub();
  }, [deliveryRequestId]);

  if (!delivery) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.placeholderText}>
          Waiting for rider to start tracking...
        </Text>
      </View>
    );
  }

  const riderLoc = {
    latitude: delivery.riderLocation.latitude,
    longitude: delivery.riderLocation.longitude,
  };
  const pickupLoc = {
    latitude: delivery.pickupLocation.latitude,
    longitude: delivery.pickupLocation.longitude,
  };
  const dropoffLoc = {
    latitude: delivery.dropoffLocation.latitude,
    longitude: delivery.dropoffLocation.longitude,
  };

  return (
    <View style={style}>
      <MapView
        style={styles.map}
        region={{
          ...riderLoc,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={riderLoc} title={delivery.riderName}>
          <View style={styles.riderMarker}>
            <Text style={styles.riderMarkerText}>R</Text>
          </View>
        </Marker>
        <Marker coordinate={pickupLoc} title="Pickup" pinColor="green" />
        <Marker coordinate={dropoffLoc} title="Dropoff" pinColor="red" />
      </MapView>
      <View style={styles.statusBar}>
        <Text variant="labelMedium" style={styles.statusText}>
          {STATUS_LABELS[delivery.status] || delivery.status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
  },
  placeholder: {
    height: 250,
    borderRadius: 12,
    backgroundColor: colors.divider,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  riderMarker: {
    backgroundColor: colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  riderMarkerText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  statusBar: {
    backgroundColor: colors.primary,
    padding: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: -12,
  },
  statusText: {
    color: colors.white,
    textAlign: "center",
  },
});

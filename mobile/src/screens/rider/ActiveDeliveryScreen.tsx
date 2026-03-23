import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Card,
  Text,
  Button,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import StatusBadge from "@/components/requests/StatusBadge";
import LiveTrackingMap from "@/components/maps/LiveTrackingMap";
import ProofCapture from "@/components/delivery/ProofCapture";
import {
  getDeliveryRequest,
  updateDeliveryRequest,
  startActiveDelivery,
  updateActiveDeliveryStatus,
  endActiveDelivery,
  findOrCreateConversation,
} from "@/lib/firebase/firestore";
import { useLocation } from "@/lib/hooks/useLocation";
import { useAuthStore } from "@/lib/stores/authStore";
import { formatCurrency } from "@/lib/utils";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import type { DeliveryRequest } from "@/lib/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RiderDeliveriesStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";
import { GeoPoint } from "firebase/firestore";

type Props = NativeStackScreenProps<
  RiderDeliveriesStackParamList,
  "ActiveDelivery"
>;

export default function ActiveDeliveryScreen({ route }: Props) {
  const rootNav = useNavigation<any>();
  const profile = useAuthStore((s) => s.profile);
  const [request, setRequest] = useState<DeliveryRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const { isTracking, startTracking, stopTracking, latitude, longitude } =
    useLocation();

  useEffect(() => {
    (async () => {
      const data = await getDeliveryRequest(route.params.id);
      setRequest(data);
      setLoading(false);
    })();
  }, [route.params.id]);

  const handleStartDelivery = async () => {
    if (!request || !profile) return;
    try {
      await updateDeliveryRequest(request.id, { status: "in_progress" });
      await startActiveDelivery(request.id, {
        riderId: profile.uid,
        riderName: profile.displayName,
        businessId: request.businessId,
        riderLocation: new GeoPoint(
          latitude || request.pickupLocation.latitude,
          longitude || request.pickupLocation.longitude
        ),
        pickupLocation: request.pickupLocation,
        dropoffLocation: request.dropoffLocation,
        status: "heading_to_pickup",
      });
      await startTracking(request.id);
      setRequest({ ...request, status: "in_progress" });
      Alert.alert("Started", "Delivery is now in progress. Location tracking enabled.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to start delivery");
    }
  };

  const handleUpdateStatus = async (
    status: "heading_to_pickup" | "picked_up" | "in_transit"
  ) => {
    if (!request) return;
    const labels = {
      heading_to_pickup: "Heading to Pickup",
      picked_up: "Package Picked Up",
      in_transit: "In Transit to Dropoff",
    };
    await updateActiveDeliveryStatus(request.id, status);
    Alert.alert("Updated", `Status: ${labels[status]}`);
  };

  const handleCompleteDelivery = async () => {
    if (!request) return;
    Alert.alert(
      "Complete Delivery",
      "Mark this delivery as completed? Make sure you've uploaded proof photos.",
      [
        { text: "Cancel" },
        {
          text: "Complete",
          onPress: async () => {
            try {
              await stopTracking();
              await endActiveDelivery(request.id);
              await updateDeliveryRequest(request.id, {
                status: "completed",
              });
              setRequest({ ...request, status: "completed" });
              Alert.alert("Success", "Delivery completed!");
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to complete");
            }
          },
        },
      ]
    );
  };

  const handleMessage = async () => {
    if (!request || !profile) return;
    const convId = await findOrCreateConversation(
      profile.uid,
      profile.displayName,
      profile.photoURL || "",
      request.businessId,
      request.businessName,
      "",
      request.id
    );
    rootNav.navigate("RiderTabs", {
      screen: "Messages",
      params: { screen: "Chat", params: { conversationId: convId } },
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.loader}>
        <Text>Delivery not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text variant="titleLarge" style={styles.title}>
          {request.description}
        </Text>
        <StatusBadge status={request.status} />
      </View>

      <Card style={styles.card}>
        <Card.Content>
          {/* Locations */}
          <View style={styles.locationRow}>
            <Icon name="map-marker" size={20} color={colors.success} />
            <View style={styles.locationText}>
              <Text variant="labelMedium">Pickup</Text>
              <Text variant="bodySmall" style={styles.muted}>
                {request.pickupAddress}
              </Text>
            </View>
          </View>
          <View style={styles.locationRow}>
            <Icon name="map-marker" size={20} color={colors.error} />
            <View style={styles.locationText}>
              <Text variant="labelMedium">Dropoff</Text>
              <Text variant="bodySmall" style={styles.muted}>
                {request.dropoffAddress}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Price */}
          <View style={styles.detailsRow}>
            <View>
              <Text variant="bodySmall" style={styles.muted}>
                Package Size
              </Text>
              <Text variant="labelMedium" style={styles.capitalize}>
                {request.packageSize.replace("_", " ")}
              </Text>
            </View>
            <View>
              <Text variant="bodySmall" style={styles.muted}>
                Agreed Price
              </Text>
              <Text variant="labelMedium" style={styles.price}>
                {formatCurrency(request.agreedPrice || request.budget)}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Business Info */}
          <View style={styles.businessRow}>
            <Icon name="domain" size={20} color={colors.textLight} />
            <View style={styles.businessInfo}>
              <Text variant="labelMedium">{request.businessName}</Text>
            </View>
            <Button
              mode="outlined"
              compact
              icon="message-text"
              onPress={handleMessage}
            >
              Message
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Live Map for in-progress deliveries */}
      {request.status === "in_progress" && (
        <Card style={styles.mapCard}>
          <Card.Content>
            <Text variant="titleSmall" style={styles.mapTitle}>
              Live Tracking
            </Text>
            <LiveTrackingMap deliveryRequestId={request.id} />

            {/* Status update buttons */}
            <View style={styles.statusButtons}>
              <Button
                mode="outlined"
                compact
                onPress={() => handleUpdateStatus("heading_to_pickup")}
                icon="navigation"
              >
                To Pickup
              </Button>
              <Button
                mode="outlined"
                compact
                onPress={() => handleUpdateStatus("picked_up")}
                icon="package-variant"
              >
                Picked Up
              </Button>
              <Button
                mode="outlined"
                compact
                onPress={() => handleUpdateStatus("in_transit")}
                icon="truck-fast"
              >
                In Transit
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Proof Capture */}
      {(request.status === "in_progress" || request.status === "accepted") && (
        <Card style={styles.proofCard}>
          <ProofCapture
            requestId={request.id}
            existingPhotos={request.proofPhotos}
          />
        </Card>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {request.status === "accepted" && (
          <Button
            mode="contained"
            buttonColor={colors.primary}
            onPress={handleStartDelivery}
            icon="play"
          >
            Start Delivery
          </Button>
        )}
        {request.status === "in_progress" && (
          <Button
            mode="contained"
            buttonColor={colors.success}
            onPress={handleCompleteDelivery}
            icon="check-circle"
          >
            Complete Delivery
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  title: {
    flex: 1,
    fontWeight: "600",
    marginRight: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  locationText: {
    flex: 1,
  },
  muted: {
    color: colors.textSecondary,
  },
  divider: {
    marginVertical: spacing.md,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  price: {
    color: colors.primary,
    fontWeight: "700",
  },
  businessRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  businessInfo: {
    flex: 1,
  },
  mapCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  mapTitle: {
    marginBottom: spacing.sm,
  },
  statusButtons: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  proofCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  actions: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
});

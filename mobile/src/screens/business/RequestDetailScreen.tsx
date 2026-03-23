import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Card, Text, Button, Divider, ActivityIndicator } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import StatusBadge from "@/components/requests/StatusBadge";
import DeliveryMap from "@/components/maps/DeliveryMap";
import LiveTrackingMap from "@/components/maps/LiveTrackingMap";
import {
  getDeliveryRequest,
  updateDeliveryRequest,
  findOrCreateConversation,
} from "@/lib/firebase/firestore";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import type { DeliveryRequest } from "@/lib/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BusinessRequestsStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";

type Props = NativeStackScreenProps<
  BusinessRequestsStackParamList,
  "RequestDetail"
>;

export default function RequestDetailScreen({ route }: Props) {
  const rootNav = useNavigation<any>();
  const profile = useAuthStore((s) => s.profile);
  const [request, setRequest] = useState<DeliveryRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getDeliveryRequest(route.params.id);
      setRequest(data);
      setLoading(false);
    })();
  }, [route.params.id]);

  const handleCancel = async () => {
    if (!request) return;
    Alert.alert("Cancel Request", "Are you sure?", [
      { text: "No" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          await updateDeliveryRequest(request.id, { status: "cancelled" });
          setRequest({ ...request, status: "cancelled" });
        },
      },
    ]);
  };

  const handleComplete = async () => {
    if (!request) return;
    await updateDeliveryRequest(request.id, { status: "completed" });
    Alert.alert("Success", "Delivery marked as completed!");
    setRequest({ ...request, status: "completed" });
  };

  const handleMessage = async () => {
    if (!request || !profile || !request.riderId) return;
    const convId = await findOrCreateConversation(
      profile.uid,
      profile.displayName,
      profile.photoURL || "",
      request.riderId,
      request.riderName || "Rider",
      "",
      request.id
    );
    rootNav.navigate("BusinessTabs", {
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
        <Text>Request not found</Text>
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

          <DeliveryMap
            pickupLocation={request.pickupLocation}
            dropoffLocation={request.dropoffLocation}
            style={styles.map}
          />

          <Divider style={styles.divider} />

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
                Budget
              </Text>
              <Text variant="labelMedium">
                {formatCurrency(request.budget)}
              </Text>
            </View>
            {request.agreedPrice && (
              <View>
                <Text variant="bodySmall" style={styles.muted}>
                  Agreed
                </Text>
                <Text variant="labelMedium">
                  {formatCurrency(request.agreedPrice)}
                </Text>
              </View>
            )}
          </View>

          {request.riderId && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.riderRow}>
                <Icon name="account" size={20} color={colors.textLight} />
                <View style={styles.riderInfo}>
                  <Text variant="labelMedium">Assigned Rider</Text>
                  <Text variant="bodySmall" style={styles.muted}>
                    {request.riderName}
                  </Text>
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
            </>
          )}

          {/* Live tracking for in-progress deliveries */}
          {request.status === "in_progress" && (
            <>
              <Divider style={styles.divider} />
              <Text variant="titleSmall" style={styles.trackingTitle}>
                Live Tracking
              </Text>
              <LiveTrackingMap deliveryRequestId={request.id} />
            </>
          )}

          {/* Proof photos */}
          {request.proofPhotos && request.proofPhotos.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <Text variant="titleSmall">Delivery Proof</Text>
              <View style={styles.proofGrid}>
                {request.proofPhotos.map((url, i) => (
                  <Card key={i} style={styles.proofCard}>
                    <Card.Cover source={{ uri: url }} style={styles.proofImage} />
                  </Card>
                ))}
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        {request.status === "open" && (
          <Button
            mode="contained"
            buttonColor={colors.error}
            onPress={handleCancel}
          >
            Cancel Request
          </Button>
        )}
        {request.status === "in_progress" && (
          <Button
            mode="contained"
            buttonColor={colors.primary}
            onPress={handleComplete}
          >
            Mark Completed
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
  map: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
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
  riderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  riderInfo: {
    flex: 1,
  },
  trackingTitle: {
    marginBottom: spacing.sm,
  },
  proofGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  proofCard: {
    width: 100,
  },
  proofImage: {
    height: 100,
  },
  actions: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});

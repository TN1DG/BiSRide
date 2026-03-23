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
import DeliveryMap from "@/components/maps/DeliveryMap";
import ProposalForm from "@/components/riders/ProposalForm";
import {
  getDeliveryRequest,
  updateDeliveryRequest,
  findOrCreateConversation,
} from "@/lib/firebase/firestore";
import { getUserProfile } from "@/lib/firebase/auth";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import type { DeliveryRequest, UserProfile } from "@/lib/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RiderBrowseStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";

type Props = NativeStackScreenProps<RiderBrowseStackParamList, "BrowseDetail">;

export default function RiderRequestDetailScreen({ route }: Props) {
  const rootNav = useNavigation<any>();
  const profile = useAuthStore((s) => s.profile);
  const [request, setRequest] = useState<DeliveryRequest | null>(null);
  const [business, setBusiness] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [showProposal, setShowProposal] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getDeliveryRequest(route.params.id);
      setRequest(data);
      if (data) {
        const biz = await getUserProfile(data.businessId);
        setBusiness(biz);
      }
      setLoading(false);
    })();
  }, [route.params.id]);

  const handleAcceptDirect = async () => {
    if (!request || !profile) return;
    Alert.alert(
      "Accept Delivery",
      `Accept this delivery for ${formatCurrency(request.budget)}?`,
      [
        { text: "Cancel" },
        {
          text: "Accept",
          onPress: async () => {
            setAccepting(true);
            try {
              await updateDeliveryRequest(request.id, {
                status: "accepted",
                riderId: profile.uid,
                riderName: profile.displayName,
                agreedPrice: request.budget,
              });
              await findOrCreateConversation(
                profile.uid,
                profile.displayName,
                profile.photoURL || "",
                request.businessId,
                request.businessName,
                "",
                request.id
              );
              Alert.alert("Success", "Delivery accepted! You can now message the business.");
              setRequest({
                ...request,
                status: "accepted",
                riderId: profile.uid,
                riderName: profile.displayName,
              });
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to accept");
            } finally {
              setAccepting(false);
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
          {/* Business Info */}
          <View style={styles.businessRow}>
            <Icon name="domain" size={20} color={colors.textLight} />
            <View style={styles.businessInfo}>
              <Text variant="labelMedium">Posted by</Text>
              <Text variant="bodySmall" style={styles.muted}>
                {request.businessName}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

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

          <DeliveryMap
            pickupLocation={request.pickupLocation}
            dropoffLocation={request.dropoffLocation}
            style={styles.map}
          />

          <Divider style={styles.divider} />

          {/* Details */}
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
              <Text variant="labelMedium" style={styles.budget}>
                {formatCurrency(request.budget)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Actions */}
      {request.status === "open" && (
        <View style={styles.actions}>
          <Button
            mode="contained"
            buttonColor={colors.primary}
            onPress={handleAcceptDirect}
            loading={accepting}
            disabled={accepting}
            icon="check"
          >
            Accept at {formatCurrency(request.budget)}
          </Button>
          <Button
            mode="outlined"
            onPress={() => setShowProposal(!showProposal)}
            icon="send"
          >
            {showProposal ? "Hide Proposal Form" : "Send Proposal"}
          </Button>
          <Button mode="text" onPress={handleMessage} icon="message-text">
            Message Business
          </Button>
        </View>
      )}

      {/* Proposal Form */}
      {showProposal && business && (
        <Card style={styles.proposalCard}>
          <ProposalForm
            business={business}
            onSuccess={() => {
              setShowProposal(false);
            }}
          />
        </Card>
      )}

      {/* Already accepted by this rider */}
      {request.riderId === profile?.uid &&
        (request.status === "accepted" || request.status === "in_progress") && (
          <View style={styles.actions}>
            <Button
              mode="contained"
              buttonColor={colors.primary}
              onPress={() =>
                rootNav.navigate("RiderTabs", {
                  screen: "Deliveries",
                  params: {
                    screen: "ActiveDelivery",
                    params: { id: request.id },
                  },
                })
              }
              icon="truck-delivery"
            >
              Go to Active Delivery
            </Button>
            <Button mode="outlined" onPress={handleMessage} icon="message-text">
              Message Business
            </Button>
          </View>
        )}
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
  businessRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  businessInfo: {
    flex: 1,
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
  budget: {
    color: colors.primary,
    fontWeight: "700",
  },
  actions: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  proposalCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
});

import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import StatusBadge from "./StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import type { DeliveryRequest } from "@/lib/types";

interface RequestCardProps {
  request: DeliveryRequest;
  showActions?: boolean;
  onAccept?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export default function RequestCard({
  request,
  showActions,
  onAccept,
  onViewDetails,
}: RequestCardProps) {
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text variant="titleSmall" numberOfLines={1}>
              {request.description}
            </Text>
            <Text variant="bodySmall" style={styles.muted}>
              {request.businessName}
            </Text>
          </View>
          <StatusBadge status={request.status} />
        </View>

        <View style={styles.location}>
          <Icon name="map-marker" size={16} color={colors.success} />
          <View style={styles.locationText}>
            <Text variant="labelSmall">Pickup</Text>
            <Text variant="bodySmall" style={styles.muted} numberOfLines={1}>
              {request.pickupAddress}
            </Text>
          </View>
        </View>

        <View style={styles.location}>
          <Icon name="map-marker" size={16} color={colors.error} />
          <View style={styles.locationText}>
            <Text variant="labelSmall">Dropoff</Text>
            <Text variant="bodySmall" style={styles.muted} numberOfLines={1}>
              {request.dropoffAddress}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.packageInfo}>
            <Icon name="package-variant" size={16} color={colors.textLight} />
            <Text variant="bodySmall" style={styles.capitalize}>
              {request.packageSize.replace("_", " ")}
            </Text>
          </View>
          <Text variant="titleSmall" style={styles.price}>
            {formatCurrency(request.budget)}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            compact
            onPress={() => onViewDetails?.(request.id)}
            style={styles.actionButton}
          >
            View Details
          </Button>
          {showActions && request.status === "open" && onAccept && (
            <Button
              mode="contained"
              compact
              onPress={() => onAccept(request.id)}
              style={styles.actionButton}
              buttonColor={colors.primary}
            >
              Accept
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  headerText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  muted: {
    color: colors.textSecondary,
  },
  location: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  locationText: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  packageInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  capitalize: {
    textTransform: "capitalize",
  },
  price: {
    color: colors.primary,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});

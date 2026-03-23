import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Text, Button, ActivityIndicator } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import RequestCard from "@/components/requests/RequestCard";
import EmptyState from "@/components/ui/EmptyState";
import { useAuthStore } from "@/lib/stores/authStore";
import { useDeliveryRequests } from "@/lib/hooks/useDeliveryRequests";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { useNavigation } from "@react-navigation/native";

export default function RiderDashboardScreen() {
  const navigation = useNavigation<any>();
  const profile = useAuthStore((s) => s.profile);

  const { requests: myDeliveries, loading: loadingMine } =
    useDeliveryRequests({ riderId: profile?.uid });
  const { requests: openRequests, loading: loadingOpen } =
    useDeliveryRequests({ status: "open" });

  const activeDeliveries = myDeliveries.filter(
    (r) => r.status === "accepted" || r.status === "in_progress"
  );
  const completedDeliveries = myDeliveries.filter(
    (r) => r.status === "completed"
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeRow}>
        <View>
          <Text variant="headlineSmall" style={styles.title}>
            Dashboard
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Welcome, {profile?.displayName}
          </Text>
        </View>
        <Button
          mode="contained"
          compact
          buttonColor={colors.primary}
          onPress={() => navigation.navigate("Browse")}
        >
          Browse
        </Button>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="magnify" size={20} color={colors.textLight} />
            <Text variant="headlineSmall" style={styles.statNumber}>
              {loadingOpen ? "-" : openRequests.length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Available
            </Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="truck-delivery" size={20} color={colors.textLight} />
            <Text variant="headlineSmall" style={styles.statNumber}>
              {loadingMine ? "-" : activeDeliveries.length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Active
            </Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="check-circle" size={20} color={colors.textLight} />
            <Text variant="headlineSmall" style={styles.statNumber}>
              {loadingMine ? "-" : completedDeliveries.length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Completed
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Rating */}
      {profile?.averageRating !== undefined && profile.averageRating > 0 && (
        <Card style={styles.ratingCard}>
          <Card.Content style={styles.ratingContent}>
            <Icon name="star" size={24} color={colors.secondary} />
            <Text variant="titleLarge" style={styles.ratingNumber}>
              {profile.averageRating.toFixed(1)}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Rating ({profile.totalDeliveries || 0} deliveries)
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Active Deliveries */}
      {activeDeliveries.length > 0 && (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Active Deliveries
          </Text>
          {activeDeliveries.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onViewDetails={(id) =>
                navigation.navigate("Deliveries", {
                  screen: "ActiveDelivery",
                  params: { id },
                })
              }
            />
          ))}
        </>
      )}

      {/* Nearby Open Requests */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Recent Open Requests
      </Text>

      {loadingOpen ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : openRequests.length === 0 ? (
        <EmptyState
          icon="package-variant"
          title="No open requests nearby"
          subtitle="Check back later for new delivery opportunities."
        />
      ) : (
        openRequests.slice(0, 4).map((req) => (
          <RequestCard
            key={req.id}
            request={req}
            showActions
            onAccept={() =>
              navigation.navigate("Browse", {
                screen: "BrowseDetail",
                params: { id: req.id },
              })
            }
            onViewDetails={(id) =>
              navigation.navigate("Browse", {
                screen: "BrowseDetail",
                params: { id },
              })
            }
          />
        ))
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
  welcomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  statContent: {
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    fontWeight: "700",
  },
  statLabel: {
    color: colors.textSecondary,
  },
  ratingCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  ratingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  ratingNumber: {
    fontWeight: "700",
    color: colors.secondary,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  loader: {
    marginTop: spacing.xl,
  },
});

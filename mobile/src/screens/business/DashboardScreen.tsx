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

export default function BusinessDashboardScreen() {
  const navigation = useNavigation<any>();
  const profile = useAuthStore((s) => s.profile);
  const { requests, loading } = useDeliveryRequests({
    businessId: profile?.uid,
  });

  const activeRequests = requests.filter(
    (r) =>
      r.status === "open" ||
      r.status === "accepted" ||
      r.status === "in_progress"
  );
  const completedRequests = requests.filter((r) => r.status === "completed");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeRow}>
        <View>
          <Text variant="headlineSmall" style={styles.title}>
            Dashboard
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Welcome, {profile?.businessName || profile?.displayName}
          </Text>
        </View>
        <Button
          mode="contained"
          compact
          buttonColor={colors.primary}
          onPress={() =>
            navigation.navigate("Requests", { screen: "NewRequest" })
          }
        >
          New Request
        </Button>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="package-variant" size={20} color={colors.textLight} />
            <Text variant="headlineSmall" style={styles.statNumber}>
              {loading ? "-" : activeRequests.length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Active
            </Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="truck-check" size={20} color={colors.textLight} />
            <Text variant="headlineSmall" style={styles.statNumber}>
              {loading ? "-" : completedRequests.length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Completed
            </Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Icon name="format-list-bulleted" size={20} color={colors.textLight} />
            <Text variant="headlineSmall" style={styles.statNumber}>
              {loading ? "-" : requests.length}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Total
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Recent Requests */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Recent Requests
      </Text>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : activeRequests.length === 0 ? (
        <EmptyState
          icon="package-variant"
          title="No active requests"
          actionLabel="Create Your First Request"
          onAction={() =>
            navigation.navigate("Requests", { screen: "NewRequest" })
          }
        />
      ) : (
        activeRequests.slice(0, 4).map((req) => (
          <RequestCard
            key={req.id}
            request={req}
            onViewDetails={(id) =>
              navigation.navigate("Requests", {
                screen: "RequestDetail",
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
  sectionTitle: {
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  loader: {
    marginTop: spacing.xl,
  },
});

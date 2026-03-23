import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { SegmentedButtons, ActivityIndicator } from "react-native-paper";
import RequestCard from "@/components/requests/RequestCard";
import EmptyState from "@/components/ui/EmptyState";
import { useAuthStore } from "@/lib/stores/authStore";
import { useDeliveryRequests } from "@/lib/hooks/useDeliveryRequests";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RiderDeliveriesStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<
  RiderDeliveriesStackParamList,
  "DeliveriesList"
>;

export default function MyDeliveriesScreen({ navigation }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const { requests, loading } = useDeliveryRequests({
    riderId: profile?.uid,
  });
  const [tab, setTab] = useState("active");

  const filtered = requests.filter((r) => {
    if (tab === "active")
      return r.status === "accepted" || r.status === "in_progress";
    return r.status === "completed" || r.status === "cancelled";
  });

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={tab}
        onValueChange={setTab}
        buttons={[
          { value: "active", label: "Active" },
          { value: "completed", label: "Completed" },
        ]}
        style={styles.tabs}
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="truck-delivery"
          title={`No ${tab} deliveries`}
          subtitle={
            tab === "active"
              ? "Accept a delivery request to get started."
              : "Your completed deliveries will appear here."
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RequestCard
              request={item}
              onViewDetails={(id) =>
                navigation.navigate("ActiveDelivery", { id })
              }
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    margin: spacing.md,
  },
  list: {
    padding: spacing.md,
  },
  loader: {
    marginTop: spacing.xl,
  },
});

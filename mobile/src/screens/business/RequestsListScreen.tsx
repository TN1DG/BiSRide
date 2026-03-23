import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { SegmentedButtons, FAB, ActivityIndicator } from "react-native-paper";
import RequestCard from "@/components/requests/RequestCard";
import EmptyState from "@/components/ui/EmptyState";
import { useAuthStore } from "@/lib/stores/authStore";
import { useDeliveryRequests } from "@/lib/hooks/useDeliveryRequests";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BusinessRequestsStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<BusinessRequestsStackParamList, "RequestsList">;

export default function RequestsListScreen({ navigation }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const { requests, loading } = useDeliveryRequests({
    businessId: profile?.uid,
  });
  const [tab, setTab] = useState("open");

  const filtered = requests.filter((r) => {
    if (tab === "open") return r.status === "open";
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
          { value: "open", label: "Open" },
          { value: "active", label: "Active" },
          { value: "completed", label: "Done" },
        ]}
        style={styles.tabs}
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="package-variant"
          title={`No ${tab} requests`}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RequestCard
              request={item}
              onViewDetails={(id) =>
                navigation.navigate("RequestDetail", { id })
              }
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        color={colors.white}
        onPress={() => navigation.navigate("NewRequest")}
      />
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
  fab: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.primary,
  },
});

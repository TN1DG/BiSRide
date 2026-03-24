import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  Searchbar,
  SegmentedButtons,
  ActivityIndicator,
  Chip,
} from "react-native-paper";
import RequestCard from "@/components/requests/RequestCard";
import EmptyState from "@/components/ui/EmptyState";
import { useDeliveryRequests } from "@/lib/hooks/useDeliveryRequests";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RiderBrowseStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RiderBrowseStackParamList, "BrowseList">;

const PACKAGE_SIZES = ["all", "small", "medium", "large", "extra_large"] as const;

export default function BrowseScreen({ navigation }: Props) {
  const { requests, loading, error } = useDeliveryRequests({ status: "open" });
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("all");

  const filtered = requests.filter((r) => {
    const matchesSearch =
      !search ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.pickupAddress.toLowerCase().includes(search.toLowerCase()) ||
      r.dropoffAddress.toLowerCase().includes(search.toLowerCase()) ||
      r.businessName.toLowerCase().includes(search.toLowerCase());

    const matchesSize =
      sizeFilter === "all" || r.packageSize === sizeFilter;

    return matchesSearch && matchesSize;
  });

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search requests..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchbar}
      />

      <View style={styles.filters}>
        {PACKAGE_SIZES.map((size) => (
          <Chip
            key={size}
            selected={sizeFilter === size}
            onPress={() => setSizeFilter(size)}
            compact
            style={styles.chip}
            selectedColor={colors.primary}
          >
            {size === "all"
              ? "All"
              : size === "extra_large"
              ? "XL"
              : size.charAt(0).toUpperCase() + size.slice(1)}
          </Chip>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : error ? (
        <EmptyState
          icon="alert-circle-outline"
          title="Couldn't load requests"
          subtitle="Please check your connection and try again."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="magnify"
          title="No requests found"
          subtitle={
            search || sizeFilter !== "all"
              ? "Try adjusting your filters."
              : "No open requests available right now."
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RequestCard
              request={item}
              showActions
              onAccept={(id) =>
                navigation.navigate("BrowseDetail", { id })
              }
              onViewDetails={(id) =>
                navigation.navigate("BrowseDetail", { id })
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
  searchbar: {
    margin: spacing.md,
    backgroundColor: colors.surface,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  chip: {
    height: 32,
  },
  list: {
    padding: spacing.md,
  },
  loader: {
    marginTop: spacing.xl,
  },
});

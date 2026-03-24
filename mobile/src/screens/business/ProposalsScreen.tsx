import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import {
  Card,
  Text,
  Button,
  Avatar,
  Chip,
  ActivityIndicator,
} from "react-native-paper";
import { where, orderBy } from "firebase/firestore";
import {
  subscribeToProposals,
  updateProposal,
  findOrCreateConversation,
} from "@/lib/firebase/firestore";
import { useAuthStore } from "@/lib/stores/authStore";
import { formatCurrency, getInitials } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import type { Proposal } from "@/lib/types";
import { useNavigation } from "@react-navigation/native";

export default function ProposalsScreen() {
  const navigation = useNavigation<any>();
  const profile = useAuthStore((s) => s.profile);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    const unsub = subscribeToProposals(
      [where("businessId", "==", profile.uid), orderBy("createdAt", "desc")],
      (data) => {
        setProposals(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setLoading(false);
        setError(err.message);
      }
    );
    return () => unsub();
  }, [profile]);

  const handleAccept = async (proposal: Proposal) => {
    await updateProposal(proposal.id, { status: "accepted" });
    const convId = await findOrCreateConversation(
      profile!.uid,
      profile!.displayName,
      profile!.photoURL || "",
      proposal.riderId,
      proposal.riderName,
      proposal.riderPhoto || "",
      undefined,
      proposal.id
    );
    Alert.alert("Accepted", "You can now message the rider.");
    navigation.navigate("Messages", {
      screen: "Chat",
      params: { conversationId: convId },
    });
  };

  const handleDecline = async (proposalId: string) => {
    Alert.alert("Decline Proposal", "Are you sure?", [
      { text: "No" },
      {
        text: "Yes",
        onPress: () => updateProposal(proposalId, { status: "declined" }),
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Couldn't load proposals"
        subtitle="Please check your connection and try again."
      />
    );
  }

  if (proposals.length === 0) {
    return (
      <EmptyState
        icon="account-multiple"
        title="No proposals yet"
        subtitle="Riders will find your business and send proposals."
      />
    );
  }

  const pending = proposals.filter((p) => p.status === "pending");
  const others = proposals.filter((p) => p.status !== "pending");

  return (
    <FlatList
      style={styles.container}
      data={[...pending, ...others]}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        pending.length > 0 ? (
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Pending ({pending.length})
          </Text>
        ) : null
      }
      renderItem={({ item: p }) => (
        <Card
          style={[styles.card, p.status !== "pending" && styles.cardFaded]}
        >
          <Card.Content>
            <View style={styles.row}>
              {p.riderPhoto ? (
                <Avatar.Image size={40} source={{ uri: p.riderPhoto }} />
              ) : (
                <Avatar.Text size={40} label={getInitials(p.riderName)} />
              )}
              <View style={styles.info}>
                <Text variant="titleSmall">{p.riderName}</Text>
                <Text variant="bodySmall" style={styles.muted}>
                  {p.message}
                </Text>
              </View>
              <Text variant="titleMedium" style={styles.price}>
                {formatCurrency(p.proposedPrice)}
              </Text>
            </View>

            <View style={styles.chips}>
              <Chip compact style={styles.chip}>
                {p.vehicleType}
              </Chip>
              {p.serviceAreas.slice(0, 3).map((a) => (
                <Chip key={a} compact style={styles.chip}>
                  {a}
                </Chip>
              ))}
            </View>

            {p.status === "pending" && (
              <View style={styles.actions}>
                <Button
                  mode="contained"
                  compact
                  icon="check"
                  buttonColor={colors.primary}
                  onPress={() => handleAccept(p)}
                  style={styles.actionBtn}
                >
                  Accept
                </Button>
                <Button
                  mode="outlined"
                  compact
                  icon="close"
                  onPress={() => handleDecline(p.id)}
                  style={styles.actionBtn}
                >
                  Decline
                </Button>
              </View>
            )}

            {p.status !== "pending" && (
              <Chip
                compact
                style={[
                  styles.statusChip,
                  {
                    backgroundColor:
                      p.status === "accepted" ? "#E8F5E9" : "#FFEBEE",
                  },
                ]}
              >
                {p.status}
              </Chip>
            )}
          </Card.Content>
        </Card>
      )}
    />
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
  sectionTitle: {
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  card: {
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  cardFaded: {
    opacity: 0.7,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  info: {
    flex: 1,
  },
  muted: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  price: {
    color: colors.primary,
    fontWeight: "700",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: spacing.sm,
  },
  chip: {
    height: 28,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
  },
  statusChip: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
    textTransform: "capitalize",
  },
});

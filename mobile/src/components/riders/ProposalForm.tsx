import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { proposalSchema, type ProposalFormData } from "@/lib/validators";
import { createProposal } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/lib/stores/authStore";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import type { UserProfile } from "@/lib/types";

interface ProposalFormProps {
  business: UserProfile;
  onSuccess?: () => void;
}

export default function ProposalForm({
  business,
  onSuccess,
}: ProposalFormProps) {
  const profile = useAuthStore((s) => s.profile);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
  });

  const onSubmit = async (data: ProposalFormData) => {
    if (!profile) return;
    setLoading(true);
    try {
      await createProposal({
        riderId: profile.uid,
        riderName: profile.displayName,
        riderPhoto: profile.photoURL || "",
        businessId: business.uid,
        businessName: business.businessName || business.displayName,
        message: data.message,
        proposedPrice: data.proposedPrice,
        vehicleType: profile.vehicleType || "motorcycle",
        serviceAreas: data.serviceAreas.split(",").map((s) => s.trim()),
        status: "pending",
      });
      Alert.alert("Success", "Proposal sent!");
      reset();
      onSuccess?.();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send proposal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="message"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Your Message"
            placeholder="Introduce yourself and your delivery services..."
            mode="outlined"
            multiline
            numberOfLines={4}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.message}
            style={styles.input}
          />
        )}
      />
      {errors.message && (
        <Text style={styles.error}>{errors.message.message}</Text>
      )}

      <Controller
        control={control}
        name="proposedPrice"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Proposed Price (NGN)"
            placeholder="1500"
            mode="outlined"
            keyboardType="numeric"
            value={value ? String(value) : ""}
            onChangeText={(v) => onChange(v ? Number(v) : undefined)}
            onBlur={onBlur}
            error={!!errors.proposedPrice}
            style={styles.input}
          />
        )}
      />
      {errors.proposedPrice && (
        <Text style={styles.error}>{errors.proposedPrice.message}</Text>
      )}

      <Controller
        control={control}
        name="serviceAreas"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Service Areas (comma-separated)"
            placeholder="Lekki, Victoria Island, Ikeja"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.serviceAreas}
            style={styles.input}
          />
        )}
      />
      {errors.serviceAreas && (
        <Text style={styles.error}>{errors.serviceAreas.message}</Text>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={loading}
        buttonColor={colors.primary}
        style={styles.submitButton}
      >
        Send Proposal
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  input: {
    marginBottom: spacing.sm,
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
});

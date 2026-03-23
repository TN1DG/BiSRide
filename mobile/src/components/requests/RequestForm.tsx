import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  TextInput,
  Button,
  Text,
  SegmentedButtons,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GeoPoint } from "firebase/firestore";
import {
  deliveryRequestSchema,
  type DeliveryRequestFormData,
} from "@/lib/validators";
import { createDeliveryRequest } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/lib/stores/authStore";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

interface RequestFormProps {
  onSuccess: () => void;
}

const PACKAGE_SIZES = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "extra_large", label: "XL" },
];

export default function RequestForm({ onSuccess }: RequestFormProps) {
  const profile = useAuthStore((s) => s.profile);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryRequestFormData>({
    resolver: zodResolver(deliveryRequestSchema),
    defaultValues: { packageSize: "small", pickupTime: "now" },
  });

  const onSubmit = async (data: DeliveryRequestFormData) => {
    if (!profile) return;
    setLoading(true);
    try {
      await createDeliveryRequest({
        businessId: profile.uid,
        businessName: profile.businessName || profile.displayName,
        status: "open",
        description: data.description,
        packageSize: data.packageSize,
        ...(data.packageWeight != null && { packageWeight: data.packageWeight }),
        pickupAddress: data.pickupAddress,
        pickupLocation: new GeoPoint(6.5244, 3.3792),
        dropoffAddress: data.dropoffAddress,
        dropoffLocation: new GeoPoint(6.5244, 3.3792),
        budget: data.budget,
        pickupTime: "now",
      });
      Alert.alert("Success", "Delivery request created!");
      onSuccess();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Package Description"
            placeholder="What are you sending?"
            mode="outlined"
            multiline
            numberOfLines={3}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.description}
            style={styles.input}
          />
        )}
      />
      {errors.description && (
        <Text style={styles.error}>{errors.description.message}</Text>
      )}

      <Text variant="labelLarge" style={styles.label}>
        Package Size
      </Text>
      <Controller
        control={control}
        name="packageSize"
        render={({ field: { onChange, value } }) => (
          <SegmentedButtons
            value={value}
            onValueChange={onChange}
            buttons={PACKAGE_SIZES}
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="budget"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Budget (NGN)"
            placeholder="1500"
            mode="outlined"
            keyboardType="numeric"
            value={value ? String(value) : ""}
            onChangeText={(v) => onChange(v ? Number(v) : undefined)}
            onBlur={onBlur}
            error={!!errors.budget}
            style={styles.input}
          />
        )}
      />
      {errors.budget && (
        <Text style={styles.error}>{errors.budget.message}</Text>
      )}

      <Controller
        control={control}
        name="pickupAddress"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Pickup Address"
            placeholder="123 Herbert Macaulay Way, Yaba, Lagos"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.pickupAddress}
            style={styles.input}
          />
        )}
      />
      {errors.pickupAddress && (
        <Text style={styles.error}>{errors.pickupAddress.message}</Text>
      )}

      <Controller
        control={control}
        name="dropoffAddress"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Dropoff Address"
            placeholder="45 Admiralty Way, Lekki Phase 1, Lagos"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!errors.dropoffAddress}
            style={styles.input}
          />
        )}
      />
      {errors.dropoffAddress && (
        <Text style={styles.error}>{errors.dropoffAddress.message}</Text>
      )}

      <Text variant="labelLarge" style={styles.label}>
        Pickup Time
      </Text>
      <Controller
        control={control}
        name="pickupTime"
        render={({ field: { onChange, value } }) => (
          <SegmentedButtons
            value={value}
            onValueChange={onChange}
            buttons={[
              { value: "now", label: "Pick up now" },
              { value: "scheduled", label: "Schedule" },
            ]}
            style={styles.input}
          />
        )}
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
        buttonColor={colors.primary}
      >
        Post Delivery Request
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  input: {
    marginBottom: spacing.sm,
  },
  label: {
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
});

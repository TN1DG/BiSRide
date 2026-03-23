import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Image } from "react-native";
import {
  Card,
  Text,
  TextInput,
  Button,
  Avatar,
  Chip,
  Divider,
} from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  riderProfileSchema,
  type RiderProfileFormData,
} from "@/lib/validators";
import { updateUserProfile } from "@/lib/firebase/auth";
import { uploadProfilePhoto } from "@/lib/supabase/storage";
import { useAuthStore } from "@/lib/stores/authStore";
import { getInitials } from "@/lib/utils";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RiderProfileStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RiderProfileStackParamList, "ProfileMain">;

const VEHICLE_TYPES = [
  { value: "motorcycle", label: "Motorcycle", icon: "motorbike" },
  { value: "bicycle", label: "Bicycle", icon: "bicycle" },
  { value: "car", label: "Car", icon: "car" },
  { value: "van", label: "Van", icon: "van-utility" },
  { value: "truck", label: "Truck", icon: "truck" },
] as const;

export default function ProfileScreen({ navigation }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RiderProfileFormData>({
    resolver: zodResolver(riderProfileSchema),
    defaultValues: {
      displayName: profile?.displayName || "",
      phone: profile?.phone || "",
      vehicleType: profile?.vehicleType || "motorcycle",
      serviceAreas: profile?.serviceAreas?.join(", ") || "",
      pricePerKm: profile?.pricePerKm || 100,
      bio: profile?.bio || "",
    },
  });

  const handlePhotoUpload = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Photo library access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0] && profile) {
      setUploading(true);
      try {
        const photoURL = await uploadProfilePhoto(
          profile.uid,
          result.assets[0].uri
        );
        await updateUserProfile(profile.uid, { photoURL });
        setProfile({ ...profile, photoURL });
        Alert.alert("Success", "Profile photo updated!");
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to upload photo");
      } finally {
        setUploading(false);
      }
    }
  };

  const onSubmit = async (data: RiderProfileFormData) => {
    if (!profile) return;
    setSaving(true);
    try {
      const updateData = {
        displayName: data.displayName,
        phone: data.phone,
        vehicleType: data.vehicleType,
        serviceAreas: data.serviceAreas.split(",").map((s) => s.trim()),
        pricePerKm: data.pricePerKm,
        bio: data.bio || "",
      };
      await updateUserProfile(profile.uid, updateData);
      setProfile({ ...profile, ...updateData } as any);
      Alert.alert("Success", "Profile updated!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Photo Section */}
      <View style={styles.photoSection}>
        {profile?.photoURL ? (
          <Avatar.Image size={96} source={{ uri: profile.photoURL }} />
        ) : (
          <Avatar.Text
            size={96}
            label={getInitials(profile?.displayName || "")}
          />
        )}
        <Button
          mode="text"
          onPress={handlePhotoUpload}
          loading={uploading}
          icon="camera"
        >
          Change Photo
        </Button>
      </View>

      {/* Stats */}
      {profile && (
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="star" size={20} color={colors.secondary} />
              <Text variant="titleMedium" style={styles.statNumber}>
                {profile.averageRating?.toFixed(1) || "N/A"}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Rating
              </Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="truck-check" size={20} color={colors.primary} />
              <Text variant="titleMedium" style={styles.statNumber}>
                {profile.totalDeliveries || 0}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Deliveries
              </Text>
            </Card.Content>
          </Card>
        </View>
      )}

      {/* Profile Form */}
      <Card style={styles.formCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.formTitle}>
            Profile Information
          </Text>

          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Full Name"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.displayName}
                style={styles.input}
              />
            )}
          />
          {errors.displayName && (
            <Text style={styles.error}>{errors.displayName.message}</Text>
          )}

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Phone Number"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                error={!!errors.phone}
                style={styles.input}
              />
            )}
          />
          {errors.phone && (
            <Text style={styles.error}>{errors.phone.message}</Text>
          )}

          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Bio"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            )}
          />

          <Divider style={styles.divider} />

          <Text variant="titleSmall" style={styles.sectionLabel}>
            Vehicle Type
          </Text>
          <Controller
            control={control}
            name="vehicleType"
            render={({ field: { onChange, value } }) => (
              <View style={styles.vehicleRow}>
                {VEHICLE_TYPES.map((v) => (
                  <Chip
                    key={v.value}
                    selected={value === v.value}
                    onPress={() => onChange(v.value)}
                    icon={v.icon}
                    compact
                    style={styles.vehicleChip}
                    selectedColor={colors.primary}
                  >
                    {v.label}
                  </Chip>
                ))}
              </View>
            )}
          />

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

          <Controller
            control={control}
            name="pricePerKm"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Price per KM (NGN)"
                mode="outlined"
                value={value ? String(value) : ""}
                onChangeText={(v) => onChange(v ? Number(v) : undefined)}
                onBlur={onBlur}
                keyboardType="numeric"
                error={!!errors.pricePerKm}
                style={styles.input}
              />
            )}
          />
          {errors.pricePerKm && (
            <Text style={styles.error}>{errors.pricePerKm.message}</Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={saving}
            disabled={saving}
            buttonColor={colors.primary}
            style={styles.saveButton}
          >
            Save Profile
          </Button>
        </Card.Content>
      </Card>

      {/* Settings link */}
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("SettingsScreen")}
        icon="cog"
        style={styles.settingsButton}
      >
        Settings
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: spacing.lg,
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
  formCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  formTitle: {
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  divider: {
    marginVertical: spacing.md,
  },
  sectionLabel: {
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  vehicleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  vehicleChip: {
    marginBottom: spacing.xs,
  },
  saveButton: {
    marginTop: spacing.md,
  },
  settingsButton: {
    marginBottom: spacing.xl,
  },
});

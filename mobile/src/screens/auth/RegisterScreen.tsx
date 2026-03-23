import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validators";
import { registerWithEmail } from "@/lib/firebase/auth";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import type { AuthScreenProps } from "@/navigation/types";

export default function RegisterScreen({
  navigation,
}: AuthScreenProps<"Register">) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerWithEmail(
        data.email,
        data.password,
        data.displayName,
        data.role
      );
      // Auth state listener handles navigation
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Create Account
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Join BiSRide as a business or rider
          </Text>
        </View>

        <View style={styles.form}>
          {/* Role Selection */}
          <Text variant="labelLarge" style={styles.label}>
            I am a...
          </Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === "business" && styles.roleCardSelected,
              ]}
              onPress={() =>
                setValue("role", "business", { shouldValidate: true })
              }
            >
              <Icon
                name="domain"
                size={32}
                color={
                  selectedRole === "business"
                    ? colors.primary
                    : colors.textLight
                }
              />
              <Text
                style={[
                  styles.roleLabel,
                  selectedRole === "business" && styles.roleLabelSelected,
                ]}
              >
                Business
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === "rider" && styles.roleCardSelected,
              ]}
              onPress={() =>
                setValue("role", "rider", { shouldValidate: true })
              }
            >
              <Icon
                name="bike"
                size={32}
                color={
                  selectedRole === "rider" ? colors.primary : colors.textLight
                }
              />
              <Text
                style={[
                  styles.roleLabel,
                  selectedRole === "rider" && styles.roleLabelSelected,
                ]}
              >
                Rider
              </Text>
            </TouchableOpacity>
          </View>
          {errors.role && (
            <Text style={styles.error}>{errors.role.message}</Text>
          )}

          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Full Name"
                placeholder="John Doe"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.displayName}
                left={<TextInput.Icon icon="account" />}
                style={styles.input}
              />
            )}
          />
          {errors.displayName && (
            <Text style={styles.error}>{errors.displayName.message}</Text>
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                placeholder="you@example.com"
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.email}
                left={<TextInput.Icon icon="email" />}
                style={styles.input}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.password}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Confirm Password"
                mode="outlined"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.confirmPassword}
                left={<TextInput.Icon icon="lock-check" />}
                style={styles.input}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword.message}</Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles.button}
            buttonColor={colors.primary}
          >
            Create Account
          </Button>

          <View style={styles.footer}>
            <Text variant="bodyMedium" style={styles.footerText}>
              Already have an account?{" "}
            </Text>
            <Button
              mode="text"
              compact
              onPress={() => navigation.navigate("Login")}
              textColor={colors.primary}
            >
              Sign In
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  title: {
    fontWeight: "700",
    color: colors.primary,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  form: {
    width: "100%",
  },
  label: {
    marginBottom: spacing.sm,
  },
  roleRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  roleCard: {
    flex: 1,
    alignItems: "center",
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    gap: spacing.sm,
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#E8F5E9",
  },
  roleLabel: {
    fontWeight: "500",
    color: colors.textSecondary,
  },
  roleLabelSelected: {
    color: colors.primary,
  },
  input: {
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  button: {
    marginTop: spacing.md,
    paddingVertical: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  footerText: {
    color: colors.textSecondary,
  },
});

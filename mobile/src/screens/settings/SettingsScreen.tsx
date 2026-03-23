import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Card, Text, List, Switch, Divider, Button } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { signOut } from "@/lib/firebase/auth";
import { useAuthStore } from "@/lib/stores/authStore";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export default function SettingsScreen() {
  const profile = useAuthStore((s) => s.profile);
  const reset = useAuthStore((s) => s.reset);
  const [notifications, setNotifications] = React.useState(true);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          reset();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Account Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Account
          </Text>
          <List.Item
            title={profile?.displayName || ""}
            description={profile?.email || ""}
            left={(props) => <List.Icon {...props} icon="account" />}
          />
          <List.Item
            title="Role"
            description={
              profile?.role === "business" ? "Business" : "Rider"
            }
            left={(props) => <List.Icon {...props} icon="shield-account" />}
          />
        </Card.Content>
      </Card>

      {/* Notifications */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Notifications
          </Text>
          <List.Item
            title="Push Notifications"
            description="Receive updates about your deliveries"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                color={colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* About */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            About
          </Text>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </Card.Content>
      </Card>

      {/* Sign Out */}
      <Button
        mode="contained"
        buttonColor={colors.error}
        onPress={handleSignOut}
        icon="logout"
        style={styles.signOutButton}
      >
        Sign Out
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
  card: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  signOutButton: {
    marginBottom: spacing.xl,
  },
});

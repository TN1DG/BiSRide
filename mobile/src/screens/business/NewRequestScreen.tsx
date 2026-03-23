import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RequestForm from "@/components/requests/RequestForm";
import { colors } from "@/theme/colors";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BusinessRequestsStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<
  BusinessRequestsStackParamList,
  "NewRequest"
>;

export default function NewRequestScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <RequestForm onSuccess={() => navigation.goBack()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

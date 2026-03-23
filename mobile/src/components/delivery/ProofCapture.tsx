import React, { useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { Button, Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { uploadDeliveryProof } from "@/lib/supabase/storage";
import { updateDeliveryRequest } from "@/lib/firebase/firestore";
import { arrayUnion } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

interface ProofCaptureProps {
  requestId: string;
  existingPhotos?: string[];
  onPhotoAdded?: (url: string) => void;
}

export default function ProofCapture({
  requestId,
  existingPhotos = [],
  onPhotoAdded,
}: ProofCaptureProps) {
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<string[]>(existingPhotos);

  const capturePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera permission is required to capture delivery proof."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadPhoto(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Photo library access is required."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadPhoto(result.assets[0].uri);
    }
  };

  const uploadPhoto = async (uri: string) => {
    setUploading(true);
    try {
      const publicUrl = await uploadDeliveryProof(requestId, uri);

      await updateDoc(doc(db, "deliveryRequests", requestId), {
        proofPhotos: arrayUnion(publicUrl),
      });

      setPhotos((prev) => [...prev, publicUrl]);
      onPhotoAdded?.(publicUrl);
      Alert.alert("Success", "Proof photo uploaded!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleSmall" style={styles.title}>
        Delivery Proof Photos
      </Text>

      {photos.length > 0 && (
        <View style={styles.photoGrid}>
          {photos.map((url, i) => (
            <Image key={i} source={{ uri: url }} style={styles.photo} />
          ))}
        </View>
      )}

      <View style={styles.buttons}>
        <Button
          mode="contained"
          icon="camera"
          onPress={capturePhoto}
          loading={uploading}
          disabled={uploading}
          buttonColor={colors.primary}
          style={styles.button}
        >
          Take Photo
        </Button>
        <Button
          mode="outlined"
          icon="image"
          onPress={pickFromGallery}
          loading={uploading}
          disabled={uploading}
          style={styles.button}
        >
          Gallery
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  button: {
    flex: 1,
  },
});

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "./config";

export async function uploadImage(
  path: string,
  file: File
): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadProfilePhoto(
  userId: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop();
  return uploadImage(`profiles/${userId}/photo.${ext}`, file);
}

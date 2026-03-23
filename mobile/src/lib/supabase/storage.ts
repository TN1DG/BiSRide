import { supabase } from "./config";

export async function uploadImage(
  bucket: string,
  path: string,
  uri: string
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { upsert: true, contentType: "image/jpeg" });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
}

export async function uploadProfilePhoto(
  userId: string,
  uri: string
): Promise<string> {
  return uploadImage("profiles", `${userId}/photo.jpg`, uri);
}

export async function uploadDeliveryProof(
  requestId: string,
  uri: string
): Promise<string> {
  const timestamp = Date.now();
  return uploadImage(
    "delivery-proofs",
    `${requestId}/${timestamp}.jpg`,
    uri
  );
}

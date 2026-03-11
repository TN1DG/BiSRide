import { supabase } from "./config";

export async function uploadImage(
  path: string,
  file: File
): Promise<string> {
  const { error } = await supabase.storage
    .from("profiles")
    .upload(path, file, { upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("profiles")
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function uploadProfilePhoto(
  userId: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop();
  return uploadImage(`${userId}/photo.${ext}`, file);
}

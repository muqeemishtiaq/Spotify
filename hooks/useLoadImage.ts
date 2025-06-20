// hooks/useLoadImage.ts
import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadImage = (song: Song) => {
  const supabaseClient = useSupabaseClient();

  if (!song || !song.image_path) {
    return "/images/placeholder.jpg"; // fallback image
  }

  const { data: imageData } = supabaseClient
    .storage
    .from("images")
    .getPublicUrl(song.image_path);

  return imageData?.publicUrl?.includes("null")
    ? "/images/placeholder.jpg"
    : imageData?.publicUrl;
};

export default useLoadImage;

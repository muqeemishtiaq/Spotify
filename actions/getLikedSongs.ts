import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getLikedSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Session fetch error:", sessionError.message);
    return [];
  }

  if (!session?.user) {
    console.warn("No session found");
    return [];
  }

  // 1. Get liked song IDs
  const { data: likedData, error: likedError } = await supabase
    .from("liked_songs")
    .select("song_id")
    .eq("user_id", session.user.id);

  if (likedError) {
    console.error("Error fetching liked songs:", likedError.message);
    return [];
  }

  const songIds = likedData?.map(item => item.song_id);

  if (!songIds || songIds.length === 0) {
    return [];
  }

  // 2. Fetch full song data by IDs
  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("*")
    .in("id", songIds);

  if (songsError) {
    console.error("Error fetching song details:", songsError.message);
    return [];
  }

  return songs as Song[];
};

export default getLikedSongs;

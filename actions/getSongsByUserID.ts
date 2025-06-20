import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongsByUserID = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user?.id) {
    // console.error("No session or user ID", sessionError);
    return [];
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching songs:", error.message);
    return [];
  }

  return data as Song[];
};

export default getSongsByUserID;

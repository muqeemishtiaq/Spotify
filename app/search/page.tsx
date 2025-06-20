"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Song } from "@/types";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";

const Search = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") ?? "";
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .ilike("title", `%${title}%`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching songs:", error);
        return;
      }

      if (data) {
        setSongs(data as Song[]);
      }
    };

    fetchSongs();
  }, [title]);

  return (
    <div className="bg-neutral-900 rounded-lg p-6 w-full h-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-3xl font-semibold text-white">Search</h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs} />
    </div>
  );
};

export default Search;

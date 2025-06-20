"use client";

import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types";
import { useUser } from "@supabase/auth-helpers-react";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";

interface LibraryProps {
  songs: Song[];
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const user = useUser();

  const onplay = useOnPlay(songs);

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }
    return uploadModal.onOpen();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist size={26} className="text-neutral-400" />
          <p className="text-neutral-400 font-medium text-md">Your Library</p>
        </div>
        <AiOutlinePlus
          size={20}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
          onClick={onClick}
        />
      </div>

      <div className="flex flex-col gap-y-2 px-3 mt-4">
        {songs.map((item) => (
          <div key={item.id}>
            <MediaItem data={item} onClick={(id: string) => onplay(id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;

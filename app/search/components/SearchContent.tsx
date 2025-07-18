"use client";

import LikeButton from '@/components/LikeButton';
import MediaItem from '@/components/MediaItem';
import React from 'react';
import { Song } from '@/types'; 
import useOnPlay from '@/hooks/useOnPlay';

interface SearchContentProps {
  songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({ songs = [] }) => {
  const onPlay= useOnPlay(songs);
  if (songs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 px-6 text-neutral-400">
        No songs available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 px-6">
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItem onClick={(id: string) => onPlay(id)} data={song} />
          </div>
          <LikeButton songId={song.id} />
        </div>
      ))}
    </div>
  );
};

export default SearchContent;

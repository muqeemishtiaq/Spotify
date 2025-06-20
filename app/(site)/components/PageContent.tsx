'use client';

import SongItem from '@/components/SongItem';
import useOnPlay from '@/hooks/useOnPlay';
import { Song } from '@/types';
import React from 'react';

interface PageContentProps {
  songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);

  const filteredSongs = songs.filter(
    (song) => song && song.id && song.title && song.image_path
  );

  if (filteredSongs.length === 0) {
    return (
      <div className="text-neutral-400 text-center mt-6">
        No songs available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 mt-4">
      {filteredSongs.map((item) => (
        <SongItem
          key={item.id}
          onClick={(id: string) => onPlay(id)}
          data={item}
        />
      ))}
    </div>
  );
};

export default PageContent;

'use client';

import useLoadImage from '@/hooks/useLoadImage';
import { Song } from '@/types';
import Image from 'next/image';
import React from 'react';

interface MediaItemProps {
  data: Song;
  onClick: (id: string) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
  const imageUrl = useLoadImage(data);

  const handleClick = () => {
    onClick(data.id); 
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-x-4 cursor-pointer hover:bg-neutral-800/60 rounded-lg p-3 transition"
    >
      <div className="relative h-12 w-12 min-w-[48px] min-h-[48px] rounded-md overflow-hidden shadow-md">
        <Image
          fill
          src={imageUrl || '/images/new.jpg'}
          alt="Media item"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center overflow-hidden">
        <p className="text-white font-medium truncate">{data.title}</p>
        <p className="text-neutral-400 text-sm truncate">{data.author}</p>
      </div>
    </div>
  );
};

export default MediaItem;

'use client'
import React from 'react'
import {Song} from '@/types'
import useLoadImage from '@/hooks/useLoadImage';
import Image from 'next/image';
import PlayButton from './PlayButton';
interface SongItemProps {
  data: Song;
  onClick: (id: string) => void;
}

const SongItem : React.FC<SongItemProps> = ({
    data,
    onClick
}) => {
    const imagePath = useLoadImage(data);
    
  return (
    <div onClick={() => onClick(data.id)} 
    className=" relative group flex flex-col transition bg-neutral-400/5 items-center justify-center cursor-pointern overflow-hidden hover:bg-neutral-400/10 rounded-md p-3">
       <div className='relative aspect-square w-full h-full overflow-hidden rounded-md'>
            <Image
            className='object-cover'
            src={imagePath || '/images/new.jpg'}
            alt="Song"
            fill
            />
       </div>
       <div className='flex flex-col items-center w-full mt-4 gap-y-1 ' >
        <p className='font-semibold truncate w-full'>{data.title}</p>
        <p className='text-neutral-400 text-sm truncate w-full'>{data.author}</p>

       </div>
<div className='absolute bottom-24 right-5 transition opacity-0 group-hover:opacity-100'>
        <PlayButton/>

</div>

    </div>
  )
}

export default SongItem
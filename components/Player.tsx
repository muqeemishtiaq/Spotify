'use client';
import useGetSongById from '@/hooks/useGetSongById';
import useLoadSongUrl from '@/hooks/useLoadSongUrl';
import usePlayer from '@/hooks/usePlayer';
import React from 'react'
import PlayerContent from './PlayerContent';

const Player = () => {
    const player = usePlayer();
    const {song } = useGetSongById(player.activeId);

    const songUrl = useLoadSongUrl(song!);
if (!songUrl || !song || !player.activeId) {
    return null;
  }

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-neutral-900/90 backdrop-blur-lg h-[80px] px-6 py-4 flex items-center justify-between'>
      <PlayerContent song={song} songUrl={songUrl} key={songUrl}/>
    </div>
  )
}

export default Player

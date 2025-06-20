"use client";

import { Song } from "@/types";
import React, { useEffect, useState } from "react";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import useSound from "use-sound";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const PlayPauseIcon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) return player.setId(player.ids[0]);

    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) return player.setId(player.ids[player.ids.length - 1]);

    player.setId(previousSong);
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"],
  });

  useEffect(() => {
    sound?.play();
    return () => {
      sound?.unload();
    };
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    setVolume(volume === 0 ? 1 : 0);
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between px-4 py-2 bg-neutral-900 rounded-lg">
    
      <div className="flex items-center gap-x-4 w-full md:w-1/3">
        <MediaItem data={song} onClick={() => {}} />
        <LikeButton songId={song.id} />
      </div>

      <div className="hidden md:flex items-center justify-center gap-x-6 w-full md:w-1/3">
        <AiFillStepBackward
          onClick={onPlayPrevious}
          size={30}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />
        <div
          onClick={handlePlay}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
        >
          <PlayPauseIcon size={30} className="text-black" />
        </div>
        <AiFillStepForward
          onClick={onPlayNext}
          size={30}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />
      </div>

     
      <div className="hidden md:flex items-center justify-end gap-x-2 w-full md:w-1/3">
        <VolumeIcon
          onClick={toggleMute}
          className="cursor-pointer text-white"
          size={28}
        />
        <div className="w-[100px]">
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>

     
      <div className="md:hidden flex w-full justify-end mt-4">
        <div
          onClick={handlePlay}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
        >
          <PlayPauseIcon size={30} className="text-black" />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;

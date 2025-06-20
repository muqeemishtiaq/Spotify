import React from 'react';
import { FaPlay } from 'react-icons/fa';

const PlayButton = () => {
  return (
    <button
      className="
        opacity-0 
        rounded-full 
        bg-green-500 
        flex 
        items-center 
        justify-center 
        p-4 
        text-black 
        transition 
        shadow-md 
        -translate-y-1/4 
        group-hover:opacity-100 
        group-hover:translate-y-0 
        hover:scale-110
      "
    >
      <FaPlay className="text-black" />
    </button>
  );
};

export default PlayButton;

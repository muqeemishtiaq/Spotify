"use client";

import React from "react";
import * as RadixSlider from "@radix-ui/react-slider";

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  value = 1,
  onChange = () => {},
}) => {
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  return (
    <RadixSlider.Root
      className="relative flex items-center select-none touch-none w-full h-5"
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.01}
      aria-label="Volume"
    >
      <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[4px]">
        <RadixSlider.Range className="absolute bg-white rounded-full h-full" />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className="block w-3 h-3 bg-white rounded-full shadow hover:bg-gray-300 focus:outline-none"
      />
    </RadixSlider.Root>
  );
};

export default Slider;

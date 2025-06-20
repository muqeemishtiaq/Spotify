import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge'; // Make sure this is installed

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = 'text', disabled, ...props },
    ref
  ) => {
    return (
      <input
        type={type}
        className={twMerge(
          `flex rounded-md w-full bg-neutral-700 border border-transparent px-3 py-3 disabled:cursor-not-allowed text-sm disabled:opacity-50 text-gray-400 focus:outline-none file:bg-transparent file:border-0 file:text-sm file:font-medium placeholder:text-neutral-400`,
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;

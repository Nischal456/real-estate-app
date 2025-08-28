'use client';

import React from 'react';

// Define the props for the Button, including an optional 'variant'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'outline' | 'default';
}

export function Button({ children, className, variant = 'default', ...props }: ButtonProps) {
  // Define base styles that apply to all buttons
  const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fa8e4]";

  // Define styles specific to each variant
  const variantStyles = {
    default: "bg-[#3fa8e4] hover:bg-[#3fa8e4]/90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

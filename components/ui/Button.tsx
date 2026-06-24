'use client';

import React from 'react';

// Define the props for the Button, including an optional 'variant'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'outline' | 'default';
}

export function Button({ children, className, variant = 'default', ...props }: ButtonProps) {
  // Define base styles that apply to all buttons
  const baseStyles = "inline-flex items-center justify-center px-6 py-2.5 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fa8e4] active:scale-95 active:shadow-md";

  // Define styles specific to each variant
  const variantStyles = {
    default: "bg-[#3fa8e4] hover:bg-[#3fa8e4]/90 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm transform hover:-translate-y-0.5",
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

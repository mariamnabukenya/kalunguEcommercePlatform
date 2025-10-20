import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
}) => {
  const dimensions: Record<typeof size, string> = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-4",
  };

  return (
    <div
      className={`animate-spin rounded-full border-brand-brown/30 border-t-brand-green ${dimensions[size]} ${className}`}
    />
  );
};

export default LoadingSpinner;

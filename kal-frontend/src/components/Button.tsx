import React, { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";
import LoadingSpinner from "./LoadingSpinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-brand-terracotta text-brand-cream hover:bg-brand-brown focus:ring-brand-terracotta",
    secondary:
      "bg-brand-green text-brand-cream hover:bg-brand-olive focus:ring-brand-green",
    outline:
      "border border-brand-green text-brand-green hover:bg-brand-olive hover:text-brand-cream focus:ring-brand-green",
    ghost:
      "text-brand-charcoal hover:text-brand-brown hover:bg-brand-beige focus:ring-brand-brown",
    link: 
      "text-brand-terracotta underline-offset-4 hover:underline hover:text-brand-brown focus:ring-0 px-0 py-0", // ✅ link style
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        variant !== "link" && sizeClasses[size], // link ignores padding
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
};

export default Button;

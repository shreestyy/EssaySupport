import * as React from "react";
import { cn } from "@/lib/utils";

export interface IconBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: "square" | "circle";
  size?: "sm" | "md" | "lg";
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  children,
  className,
  shape = "square",
  size = "md",
  ...props
}) => {
  const shapeStyles = {
    square: "rounded-xl",
    circle: "rounded-full",
  };

  const sizeStyles = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center bg-primary-light text-primary flex-shrink-0 transition-transform duration-150",
        shapeStyles[shape],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

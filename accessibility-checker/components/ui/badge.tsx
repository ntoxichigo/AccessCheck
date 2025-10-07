import * as React from "react";
import { cn } from "../../lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default"
          ? "bg-blue-600 text-white border-transparent"
          : "border border-blue-600 text-blue-600 bg-white",
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

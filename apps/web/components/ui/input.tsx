import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#1A1A1A] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0071CE] focus:border-transparent transition-all disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

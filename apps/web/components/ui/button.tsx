import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071CE] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-sm",
  {
    variants: {
      variant: {
        primary:
          "bg-[#0071CE] text-white hover:bg-[#002D62] active:scale-[0.98] shadow-sm",
        accent:
          "bg-[#FFC220] text-[#002D62] hover:bg-[#E6A800] active:scale-[0.98] shadow-sm font-bold",
        outline:
          "border border-[#0071CE] text-[#0071CE] bg-white hover:bg-[#E5F1FB] active:scale-[0.98]",
        ghost:
          "text-[#0071CE] hover:bg-[#E5F1FB] active:scale-[0.98]",
        danger:
          "bg-[#DC2626] text-white hover:bg-[#B91C1C] active:scale-[0.98]",
        secondary:
          "bg-[#F2F2F2] text-[#1A1A1A] border border-[#E5E7EB] hover:bg-[#E5E7EB] active:scale-[0.98]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

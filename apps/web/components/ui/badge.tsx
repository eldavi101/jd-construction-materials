import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-semibold transition-colors text-xs px-2.5 py-0.5",
  {
    variants: {
      variant: {
        default: "bg-[#E5F1FB] text-[#002D62]",
        primary: "bg-[#0071CE] text-white",
        accent: "bg-[#FFC220] text-[#002D62]",
        success: "bg-[#DCFCE7] text-[#16A34A]",
        danger: "bg-[#FEE2E2] text-[#DC2626]",
        muted: "bg-[#F2F2F2] text-[#6B7280]",
        outline: "border border-[#E5E7EB] text-[#6B7280] bg-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

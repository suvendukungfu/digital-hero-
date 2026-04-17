import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/5 text-white",
        active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        inactive: "border-rose-500/20 bg-rose-500/10 text-rose-400",
        pending: "border-amber-500/20 bg-amber-500/10 text-amber-400",
        paid: "border-blue-500/20 bg-blue-500/10 text-blue-400",
        admin: "border-purple-500/20 bg-purple-500/10 text-purple-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

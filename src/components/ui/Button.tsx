import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-[inset_0px_1px_rgba(255,255,255,0.4),0_2px_10px_-4px_rgba(255,255,255,0.2)] hover:opacity-90 hover:shadow-[inset_0px_1px_rgba(255,255,255,0.4),0_4px_16px_-4px_rgba(255,255,255,0.3)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-white/10 font-medium border border-white/10 shadow-sm",
        glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 shadow-[inset_0px_1px_rgba(255,255,255,0.1)]",
        outline: "border border-white/10 bg-transparent hover:bg-white/5 hover:text-white",
        ghost: "hover:bg-white/5 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[inset_0px_1px_rgba(255,255,255,0.2)]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-14 rounded-2xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

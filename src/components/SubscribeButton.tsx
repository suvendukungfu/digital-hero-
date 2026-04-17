"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscribeButtonProps {
  plan: "monthly" | "yearly";
  className?: string;
  variant?: "primary" | "secondary" | "glass" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function SubscribeButton({ 
  plan, 
  className, 
  variant = "primary",
  size = "lg"
}: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSubscribe}
      disabled={isLoading}
      className={cn("relative group overflow-hidden", className)}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
          {plan === "yearly" ? "Go Annual (Save 20%)" : "Go Monthly"}
        </>
      )}
    </Button>
  );
}

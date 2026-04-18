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
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Network error" }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from Stripe");
      }
    } catch (err: any) {
      console.error("Subscription error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
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
      {error && (
        <p className="text-destructive text-[10px] font-black uppercase tracking-wide text-center">{error}</p>
      )}
    </div>
  );
}

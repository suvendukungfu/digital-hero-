"use client";

import { Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Tier {
  name: string;
  id: string;
  priceMonthly: string;
  description: string;
  features: string[];
  priceId: string;
  featured: boolean;
}

const tiers: Tier[] = [
  {
    name: "Monthly Supporter",
    id: "monthly",
    priceMonthly: "$29",
    description: "Perfect for regular contributors with full monthly draw access.",
    features: [
      "Enter 5 monthly scores",
      "Full Draw Eligibility",
      "10% - 100% Charity Match",
      "Real-time analytics",
      "Priority Payout Approval",
    ],
    priceId: "monthly",
    featured: false,
  },
  {
    name: "Yearly Impact",
    id: "yearly",
    priceMonthly: "$290",
    description: "The ultimate commitment to impact. Get 2 months free.",
    features: [
      "Everything in Monthly",
      "2 Months Free ($58 saved)",
      "Exclusive Founder Badge",
      "Annual Impact Report",
      "Bonus Draw Entry Token",
    ],
    priceId: "yearly",
    featured: true,
  },
]

export default function PricingPage() {
  const handleCheckout = async (plan: string) => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.assign(data.url);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to initiate checkout");
    }
  }

  return (
    <div className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary uppercase tracking-widest">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Choose Your Impact Level
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-zinc-400">
          Subscribe to enter the draw. Every contribution helps fund our global charity partners while giving you a chance to win big.
        </p>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-x-8 px-10">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "rounded-3xl p-8 xl:p-10 transition-all duration-300 hover:scale-[1.02]",
                tier.featured 
                 ? "relative bg-zinc-900 ring-2 ring-primary"
                 : "bg-zinc-900/50 ring-1 ring-zinc-800"
              )}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  MOST POPULAR
                </div>
              )}
              <div className="flex items-center justify-between gap-x-4">
                <h3 className={cn("text-lg font-semibold leading-8", tier.featured ? "text-primary" : "text-white")}>
                  {tier.name}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-400">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">{tier.priceMonthly}</span>
                <span className="text-sm font-semibold leading-6 text-zinc-400">/{tier.id === 'monthly' ? 'mo' : 'yr'}</span>
              </p>
              <button
                onClick={() => handleCheckout(tier.priceId)}
                className={cn(
                  "mt-6 block w-full rounded-xl px-3 py-3 text-center text-sm font-bold transition-all active:scale-95 duration-200",
                  tier.featured
                    ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
                )}
              >
                Get Started Now
              </button>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-zinc-400 xl:mt-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

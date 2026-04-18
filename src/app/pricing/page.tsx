"use client";

import { Check, Sparkles, ShieldCheck, ArrowLeft, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Reveal, Floating } from "@/components/MotionWrapper"

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

function PricingContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")

  const handleCheckout = async (plan: string) => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Network error" }));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.url) {
        window.location.assign(data.url);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to initiate checkout");
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Floating duration={6}>
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] opacity-60" />
        </Floating>
        <Floating duration={8} delay={1}>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px] opacity-40" />
        </Floating>
      </div>

      {/* Navigation */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <nav className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl shadow-black/20">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tighter group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-white/10 group-hover:rotate-12 transition-transform">
              G
            </div>
            <span className="hidden sm:inline">GiveBack</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/auth" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Dashboard
            </Link>
          </div>
        </nav>
      </header>

      <div className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Subscription Required Banner */}
          {reason === "subscription_required" && (
            <Reveal>
              <div className="max-w-2xl mx-auto mb-12 p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-black text-lg tracking-tight">Subscription Required</p>
                  <p className="text-amber-200/80 text-sm font-medium leading-relaxed">
                    The feature you tried to access requires an active subscription. 
                    Choose a plan below to unlock the full Hero Console — including scores, draws, and charity matching.
                  </p>
                </div>
              </div>
            </Reveal>
          )}

          {/* Header */}
          <Reveal>
            <div className="mx-auto max-w-4xl text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black tracking-[0.2em] uppercase shadow-xl shadow-primary/5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Premium Access
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1]">
                Choose Your <br className="hidden md:block" />
                <span className="text-gradient italic">Impact Level.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-muted-foreground font-medium leading-relaxed">
                Subscribe to enter the draw. Every contribution helps fund our global charity partners 
                while giving you a chance to win big.
              </p>
            </div>
          </Reveal>

          {/* Pricing Cards */}
          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 px-4 lg:px-10">
            {tiers.map((tier, i) => (
              <Reveal key={tier.id} delay={0.1 + i * 0.15} direction="up">
                <div
                  className={cn(
                    "rounded-[32px] p-8 xl:p-10 transition-all duration-500 hover:-translate-y-2 h-full group",
                    tier.featured 
                     ? "relative glass border-primary/30 bg-primary/5 shadow-2xl shadow-primary/10"
                     : "glass border-white/5 hover:border-white/10"
                  )}
                >
                  {tier.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-primary text-primary-foreground text-[10px] font-black tracking-[0.2em] uppercase rounded-full flex items-center gap-1.5 shadow-2xl shadow-primary/30">
                      <Sparkles className="w-3 h-3" />
                      MOST POPULAR
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-x-4">
                    <h3 className={cn("text-xl font-black tracking-tight", tier.featured ? "text-primary" : "text-white")}>
                      {tier.name}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground font-medium">{tier.description}</p>
                  
                  <p className="mt-8 flex items-baseline gap-x-2">
                    <span className="text-5xl font-black tracking-tight text-white">{tier.priceMonthly}</span>
                    <span className="text-sm font-bold text-muted-foreground">/{tier.id === 'monthly' ? 'mo' : 'yr'}</span>
                  </p>

                  <button
                    onClick={() => handleCheckout(tier.priceId)}
                    className={cn(
                      "mt-8 block w-full rounded-2xl px-4 py-4 text-center text-sm font-black tracking-wide uppercase transition-all active:scale-95 duration-200",
                      tier.featured
                        ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    Get Started Now
                  </button>

                  <ul role="list" className="mt-8 space-y-3.5 text-sm leading-6 xl:mt-10">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3 text-muted-foreground font-medium">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 flex-none text-primary" aria-hidden="true" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Trust Badge */}
          <Reveal delay={0.5}>
            <div className="mt-16 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black flex items-center justify-center gap-3">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Secure Checkout via Stripe · Cancel Anytime
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  )
}

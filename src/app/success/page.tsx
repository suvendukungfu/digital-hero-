import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CircleCheckBig, Sparkles, ArrowRight } from "lucide-react";
import { Reveal, Floating } from "@/components/MotionWrapper";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <Reveal direction="up">
        <div className="max-w-md w-full glass p-10 rounded-[40px] border-white/10 text-center space-y-8 relative">
          <Floating duration={4}>
            <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto border border-primary/30 shadow-2xl shadow-primary/20">
              <CircleCheckBig className="w-12 h-12 text-primary" />
            </div>
          </Floating>

          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tighter text-white">
              Status: <span className="text-primary italic">Elite Hero</span>
            </h1>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Subscription verified successfully. Your high-accuracy tracking and charity contributions are now active.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Achievement Unlocked</p>
                <p className="text-xs font-bold text-white">Full Console Access Granted</p>
            </div>
          </div>

          <Button variant="primary" size="lg" className="w-full group" asChild>
            <Link href="/dashboard">
              Enter Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </div>
  )
}

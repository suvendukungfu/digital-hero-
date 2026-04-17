"use client";

import Link from "next/link";
import { 
  Trophy, 
  Heart, 
  Target, 
  ShieldCheck, 
  ArrowRight, 
  Coins, 
  Users,
  TrendingUp,
  Globe,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Parallax, Floating, Counter } from "@/components/MotionWrapper";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <Floating duration={6}>
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] opacity-60" />
        </Floating>
        <Floating duration={8} delay={1}>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px] opacity-40" />
        </Floating>
        <div className="absolute top-[20%] right-[10%] w-32 h-32 bg-primary/5 rounded-full blur-[40px] animate-pulse" />
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
            <Link href="#features" className="text-sm font-bold text-muted-foreground hover:text-white transition-colors hidden sm:block">
              Features
            </Link>
            <Link href="#impact" className="text-sm font-bold text-muted-foreground hover:text-white transition-colors hidden sm:block">
              Impact
            </Link>
            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
            <Link href="/auth" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link 
              href="/auth" 
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-44 pb-32 px-6 relative">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black tracking-[0.2em] uppercase mb-4 shadow-xl shadow-primary/5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Empowering Golfers & Charities
            </div>
          </Reveal>

          <Parallax offset={20}>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[1] max-w-4xl mx-auto"
            >
              Every Swing <br className="hidden md:block" />
              <span className="text-gradient">Makes a Impact.</span>
            </motion.h1>
          </Parallax>

          <Reveal delay={0.2}>
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
              The ultimate platform for modern golfers. Track accuracy, enter global draws, 
              and support charities—all with <span className="text-white font-bold">one premium membership.</span>
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
              <Link 
                href="/auth" 
                className="group px-10 py-5 rounded-3xl bg-primary text-primary-foreground font-black text-lg shadow-2xl shadow-primary/20 flex items-center gap-3 hover:opacity-90 transition-all active:scale-95"
              >
                Join the Elite
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link 
                href="#features" 
                className="px-10 py-5 rounded-3xl glass font-black text-lg hover:bg-white/10 transition-all"
              >
                Explore Features
              </Link>
            </div>
          </Reveal>

          {/* Hero Visualization */}
          <Reveal delay={0.6} direction="up">
            <div className="pt-24 relative">
              <Parallax offset={-40}>
                <div className="relative aspect-[21/9] max-w-5xl mx-auto rounded-[40px] overflow-hidden glass border-white/5 shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-10 w-full opacity-20">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-48 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors" />
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                    <Floating>
                      <div className="glass p-10 py-12 rounded-[32px] shadow-2xl border-white/10 max-w-md">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                           <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-3xl font-black tracking-tight mb-2">Platform Console</h3>
                        <p className="text-muted-foreground font-medium">Experience full control over your impact and performance.</p>
                      </div>
                    </Floating>
                  </div>
                </div>
              </Parallax>
              
              {/* Accents for Depth */}
              <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full bg-blue-500/5 blur-3xl" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-24">
          <Reveal>
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
                One Subscription. <br />
                <span className="text-primary italic">Infinite Transformation.</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">
                Access a suite of elite features designed to refine your game and amplify your global contribution.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Reveal delay={0.1}>
              <div className="glass glass-hover p-10 rounded-[40px] space-y-8 h-full flex flex-col">
                <div className="w-20 h-20 rounded-[28px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner">
                  <Target className="w-10 h-10 text-blue-500" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white">Accuracy Tracking</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    Log your precision scores and visualize consistency over time with our custom performance algorithms.
                  </p>
                </div>
                <div className="mt-auto pt-6 border-t border-white/5">
                   <div className="flex gap-2">
                     <div className="w-full h-1 bg-blue-500/20 rounded-full" />
                     <div className="w-2/3 h-1 bg-blue-500 rounded-full" />
                   </div>
                </div>
              </div>
            </Reveal>

            {/* Feature 2 */}
            <Reveal delay={0.2}>
              <div className="glass glass-hover p-10 rounded-[40px] space-y-8 h-full flex flex-col border-primary/20 bg-primary/5">
                <div className="w-20 h-20 rounded-[28px] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-inner">
                  <Heart className="w-10 h-10 text-rose-500" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white">Impact Matching</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    Direct your fees to causes you care about. We match and amplify your contribution every single month.
                  </p>
                </div>
                <div className="mt-auto pt-6 border-t border-white/5">
                   <div className="flex gap-2">
                     <div className="w-full h-1 bg-rose-500/20 rounded-full" />
                     <div className="w-full h-1 bg-primary rounded-full" />
                   </div>
                </div>
              </div>
            </Reveal>

            {/* Feature 3 */}
            <Reveal delay={0.3}>
              <div className="glass glass-hover p-10 rounded-[40px] space-y-8 h-full flex flex-col font-medium">
                <div className="w-20 h-20 rounded-[28px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-inner">
                  <Trophy className="w-10 h-10 text-amber-500" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white">Monthly Draws</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Qualified entries are automatically rolled into our exclusive prize pools. Win big while funding global change.
                  </p>
                </div>
                <div className="mt-auto pt-6 border-t border-white/5">
                   <div className="flex gap-2">
                     <div className="w-1/3 h-1 bg-amber-500/20 rounded-full" />
                     <div className="w-full h-1 bg-amber-500 rounded-full" />
                   </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="impact" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[1] text-white">
                Tangible <span className="text-primary italic">Change</span>. <br />
                Proven Impact.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-muted-foreground text-xl leading-relaxed font-medium">
                Transparency is at our core. Every dollar and every score is tracked, matched, and allocated to verified global partners.
              </p>
            </Reveal>
            
            <div className="grid grid-cols-2 gap-12 py-8 border-y border-white/5">
              <Reveal delay={0.2} direction="right">
                <div className="space-y-2">
                  <p className="text-5xl md:text-6xl font-black text-white">
                    <Counter value={45} suffix="%" />
                  </p>
                  <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Match Guarantee</p>
                </div>
              </Reveal>
              <Reveal delay={0.3} direction="right">
                <div className="space-y-2">
                  <p className="text-5xl md:text-6xl font-black text-white">
                    <Counter value={98} suffix="%" />
                  </p>
                  <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">User Satisfaction</p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.4}>
              <Link 
                href="/auth" 
                className="inline-flex items-center gap-3 font-black text-xl text-primary hover:text-white transition-colors group"
              >
                Meet our global partners
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-6 relative">
             <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10" />
            
            <div className="space-y-6 pt-16">
              <Reveal delay={0.5} direction="up">
                <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
                  <Coins className="w-12 h-12 text-amber-500 mb-2" />
                  <p className="text-3xl font-black text-white">$2.4M</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Total Distributed</p>
                </div>
              </Reveal>
              <Reveal delay={0.6} direction="up">
                <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
                  <Users className="w-12 h-12 text-blue-500 mb-2" />
                  <p className="text-3xl font-black text-white">12.5k</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Global Heroes</p>
                </div>
              </Reveal>
            </div>
            
            <div className="space-y-6">
              <Reveal delay={0.7} direction="up">
                <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
                  <Globe className="w-12 h-12 text-emerald-500 mb-2" />
                  <p className="text-3xl font-black text-white">42</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Partner Nations</p>
                </div>
              </Reveal>
              <Reveal delay={0.8} direction="up">
                <div className="glass p-8 rounded-[32px] border-white/5 space-y-4 border-primary/20 bg-primary/5">
                  <Target className="w-12 h-12 text-rose-500 mb-2" />
                  <p className="text-3xl font-black text-white">1M+</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Lives Touched</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="py-44 px-6 text-center space-y-24 relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-4xl mx-auto space-y-10 relative z-10">
          <Reveal direction="down">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[1]">Ready to make <br /> <span className="text-primary italic">History?</span></h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Join the movement of thousands turning their passion for sport into an instrument of world change.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <Link 
                href="/auth" 
                className="w-full sm:w-auto px-12 py-6 rounded-[32px] bg-primary text-primary-foreground font-black text-xl shadow-2xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
              >
                Assemble Your Profile
              </Link>
              <Link 
                href="/auth" 
                className="w-full sm:w-auto px-12 py-6 rounded-[32px] glass font-black text-xl hover:bg-white/10 transition-all"
              >
                Inquire Solutions
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Floating Icons Background */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-[10%]"><Trophy className="w-32 h-32" /></div>
          <div className="absolute bottom-10 right-[10%]"><Heart className="w-32 h-32" /></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><Target className="w-64 h-64" /></div>
        </div>
        
        <div className="pt-24 border-t border-white/5 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">G</div>
            <p>© 2024 GiveBack Global. All Hero Rights Reserved.</p>
          </div>
          <div className="flex gap-10">
            <Link href="#" className="hover:text-primary transition-colors">Digital Ethics</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Cloud</Link>
            <Link href="#" className="hover:text-primary transition-colors">System Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

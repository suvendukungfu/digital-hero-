"use client";

import { motion } from "framer-motion";
import { login, signup } from './action';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ShieldCheck, ArrowRight, Heart, Trophy, Target } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Reveal, Floating } from "@/components/MotionWrapper";

export default function AuthPage({ searchParams }: { searchParams: { error?: string, message?: string } }) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-background">
      {/* Mesh Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Floating duration={5}>
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        </Floating>
        <Floating duration={7} delay={1}>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]" />
        </Floating>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col space-y-8">
          <Reveal direction="right">
            <Link href="/" className="flex items-center gap-3 font-black text-3xl tracking-tighter">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                G
              </div>
              GiveBack
            </Link>
          </Reveal>
          
          <div className="space-y-6">
            <Reveal delay={0.1} direction="right">
              <h2 className="text-5xl font-black tracking-tighter leading-[1.1] text-white">
                Join the elite circle of <span className="text-primary italic">Golf Heroes</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.2} direction="right">
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                Track your accuracy, support global causes, and win exclusive prizes—all with one premium subscription.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4">
            {[
              { icon: Target, title: "Precision Tracking", desc: "Every swing counts towards your growth." },
              { icon: Heart, title: "Global Impact", desc: "Direct your passion to causes that matter." },
              { icon: Trophy, title: "Exclusive Rewards", desc: "Win big while you give back." }
            ].map((item, i) => (
              <Reveal key={i} delay={0.3 + (i * 0.1)} direction="right">
                <div className="flex items-center gap-5 p-5 rounded-3xl glass border-white/5 group hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-black text-white">{item.title}</p>
                    <p className="text-xs text-muted-foreground font-bold italic">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <Reveal direction="up" delay={0.4}>
          <Card variant="glass" className="w-full max-w-md mx-auto relative overflow-visible border-white/5">
            {/* Top Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black tracking-[0.2em] uppercase shadow-2xl z-20">
              Secure Gateway
            </div>

            <CardHeader className="space-y-2 pb-8">
              <CardTitle className="text-4xl font-black text-center tracking-tighter">
                {mode === "login" ? "Access Point" : "Initiate Hero"}
              </CardTitle>
              <CardDescription className="text-center text-sm font-bold italic">
                {mode === "login" 
                  ? "Enter credentials to access the console." 
                  : "Start your journey of change today."
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              {searchParams.error && (
                <div className="mb-8 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-black uppercase tracking-tight flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  {searchParams.message}
                </div>
              )}

              <form className="space-y-6">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground ml-1">Full Name</label>
                    <Input 
                      name="full_name" 
                      placeholder="Tiger Woods" 
                      required 
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground ml-1">Email Address</label>
                  <Input 
                    name="email" 
                    type="email" 
                    placeholder="hero@giveback.com" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Security Key</label>
                    {mode === "login" && (
                      <Link href="#" className="text-[10px] font-black text-primary hover:underline uppercase">Forgot?</Link>
                    )}
                  </div>
                  <Input 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                  />
                </div>

                <div className="pt-6 space-y-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full group"
                    formAction={mode === "login" ? login : signup}
                  >
                    {mode === "login" ? "Initialize Logic" : "Create Hero Profile"}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                      <span className="bg-[#0a0a0a] px-3 text-muted-foreground font-black tracking-widest">Or</span>
                    </div>
                  </div>

                  <Button 
                    type="button"
                    variant="secondary" 
                    size="lg" 
                    className="w-full"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  >
                    {mode === "login" ? "Request New Profile" : "Sign In Existing"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-10">
        <Link href="#" className="hover:text-primary transition-colors">Digital Ethics</Link>
        <Link href="#" className="hover:text-primary transition-colors">Privacy Cloud</Link>
        <Link href="#" className="hover:text-primary transition-colors">Support Hub</Link>
      </div>
    </div>
  )
}

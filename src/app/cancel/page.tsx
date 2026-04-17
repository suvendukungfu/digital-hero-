import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/MotionWrapper";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
      <Reveal direction="up">
        <div className="max-w-md w-full glass p-10 rounded-[40px] border-white/10 space-y-8">
          <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mx-auto border border-white/10 shadow-xl">
            <AlertCircle className="w-10 h-10 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter text-white">
              Operation Aborted
            </h1>
            <p className="text-muted-foreground font-medium">
              The subscription process was cancelled. No charges were applied to your account.
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <Button variant="primary" size="lg" className="w-full" asChild>
                <Link href="/dashboard">
                    Return to Dashboard
                </Link>
            </Button>
            <Button variant="secondary" size="lg" className="w-full" asChild>
                <Link href="/dashboard" className="flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Try Again
                </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  )
}

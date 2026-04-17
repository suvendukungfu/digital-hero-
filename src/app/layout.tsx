import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GiveBack — Track, Win, Give",
  description: "The ultimate subscription platform combining score tracking, monthly draw rewards, and global charity contributions.",
  keywords: ["SaaS", "charity", "golf", "subscription", "draw", "rewards"],
  openGraph: {
    title: "GiveBack — Track, Win, Give",
    description: "Track your accuracy, enter global draws, and support charities with one premium membership.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} selection:bg-primary/30`}>
        <PageTransition>
          {children}
        </PageTransition>
        <Toaster />
      </body>
    </html>
  );
}

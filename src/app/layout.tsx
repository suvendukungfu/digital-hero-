import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GiveBack SaaS",
  description: "Subscription-based platform combining score tracking, monthly draws, and charities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="${inter.className} selection:bg-primary/30">
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}

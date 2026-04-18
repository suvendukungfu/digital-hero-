<div align="center">
  
# 🏆 GiveBack SaaS Platform

**The Ultimate Subscription-Based Philanthropic Engine**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

An elite, production-ready SaaS platform seamlessly integrating sports precision tracking, automated monthly prize draws, and high-impact digital charity contributions. Built with deep "Stripe/Vercel" aesthetic design principles for a truly premium user experience.

</div>

---

## ✨ Core Architecture & Features

### 🛡️ The Hero Console (Dashboard)
A specialized, glassmorphism-themed UI where active subscribers track performance via immersive, fluid analytics and assign charitable impact percentages. Highly secured via 5-layer middleware authentication. Includes premium loading states and real-time validation limitations (Max 5 score entries).

### 💳 Stripe Automated Subscriptions
End-to-end integration via Stripe webhooks. Handling seamless monthly and annual recurring plans. Employs advanced chaining identification (`Session Metadata` -> `Customer Map`) and automatic UI role synchronization to grant or restrict premium routes seamlessly.

### 🎲 Serverless Monthly Draw Engine
An automated, algorithmically fair lottery engine secured under Vercel Cron triggers (`/api/cron/monthly-draw`). It accumulates global pool funds and assigns winners dynamically based on active user scores and subscription retention.

### ❤️ Customizable Impact Vectors
Users choose exactly where their monthly funds land. Direct UI percentage algorithms (bounded 10% to 100%) mapped to global charities. Backed by strict SQL persistence and Zod validation checks.

### 👑 Dedicated Admin CRM
Complete Super-User Portal. Enables administrators to curate new charities, toggle draw periods, audit financial user ledgers, and manage jackpot winner payouts dynamically.

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router, Server Actions)
- **Language:** TypeScript 
- **Styling:** Tailwind CSS + custom Rich SaaS UI
- **Animations:** Framer Motion (Optimized Spring physics)
- **Database + Auth:** Supabase (PostgreSQL, Row-Level Security)
- **Payments:** Stripe Checkout API & Configured Webhooks
- **Validation:** Zod (Server/Client forms)
- **Deployment Environments:** Configured for Vercel & Netlify Native.

---

## 🚀 Setup & Local Development

### 1. Prerequisites
Ensure you have the following installed:
- Node.js (v20+)
- Stripe CLI (for webhook forwarding)
- An active Supabase Database URL
- A Stripe Developer Workspace

### 2. Installation Setup

Clone the repository and install the locked dependencies (including necessary `autoprefixer` and CSS modules):

```bash
git clone https://github.com/suvendukungfu/digital-hero-
cd digital-hero-
npm install
```

### 3. Environment Config
Duplicate `.env.example` into a new `.env.local` file and input your keys exactly as established in your local instance:

```env
# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# STRIPE
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...

# APP INFRASTRUCTURE
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=generate_a_secure_string
```

### 4. Stripe Webhooks (Local Sync)
Link your Stripe CLI and start listener forwarding to the local backend:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 5. Start The Application
```bash
npm run dev
```

The application will be running at [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deployment (Vercel / Netlify)

This repository is strictly configured to execute flawlessly in Continuous Integration bounds. All legacy dependency vulnerability loops have been patched, `swcMinify` optimized, and OpenGraph variables configured.

**Vercel Workflow:**
1. Import the repository into a New Vercel Project.
2. Provide **ALL** the Environment Variables identical to `.env.local`. Ensure `NEXT_PUBLIC_APP_URL` uses the live Vercel domain.
3. Set your Production Stripe Webhook target to `https://yourdomain.com/api/stripe/webhook` inside the Stripe Dashboard, grabbing the new `whsec_` secret.
4. Hit Deploy! Vercel will automatically digest `vercel.json` and boot the background cron tasks.

---

<div align="center">
  <i>Developed with precision. Dedicated to digital heroes worldwide.</i>
</div>

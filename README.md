<div align="center">
  
# 🏆 GiveBack — Track, Win, Give

**The Ultimate Subscription-Based Philanthropic Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

An elite, production-ready SaaS platform seamlessly integrating sports precision tracking, automated monthly prize draws, and high-impact digital charity contributions. Built with deep "Stripe/Linear" aesthetics for a truly premium user experience.

[**Live Demo**](#) • [**Report Bug**](#) • [**Request Feature**](#)

</div>

---

## ✨ Premium Features

### 🛡️ The Hero Console (Dashboard)
A heavily specialized, glassmorphism-themed UI where active subscribers can track performance via immersive, fluid analytics, modify their profiles, and track charitable impact. Kept highly secure via 5-layer middleware authentication.

### 💳 Stripe Automated Subscriptions
End-to-end integration via Stripe webhooks. Handling seamless monthly and annual recurring plans, robust user identification, graceful failed-payment handling, and automatic Supabase Database role synchronization.

### 🎲 Serverless Monthly Draw Engine
An automated, algorithmically fair lottery engine secured under Cron triggers (`/api/cron/monthly-draw`). Accumulates global pool funds and assigns random winners based on the active user subscription ledger.

### ❤️ Customizable Impact (Charity Matching)
Users choose exactly where their contribution lands. Direct percentage assignments (10% to 100%) mapped to verified global charities—fully backed by Zod security layer validations and SQL persistence.

### 👑 Dedicated Admin Infrastructure
Complete Super-User CRM to curate charity selections, toggle draw periods, view all user data tables, and approve/audit jackpot winners dynamically. 

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript 
- **Styling:** Tailwind CSS + Framer Motion (Spring transitions & Glassmorphism)
- **Database + Auth:** Supabase (Postgres, RLS row-level security enabled)
- **Payments:** Stripe Checkout & Webhooks
- **UI Components:** Lucide React, Custom Radix-inspired atomic components
- **Deployment:** Vercel (Configured with Next.js edge-middleware & CRON configs)

---

## 🚀 Setup & Local Development

### 1. Prerequisites
Ensure you have the following installed:
- Node.js (v18+)
- Stripe CLI (for webhook testing)
- A Supabase Project
- A Stripe Developer Account

### 2. Installation Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/giveback-saas.git
cd giveback-saas
npm install
```

### 3. Environment Config
Duplicate `.env.example` into a new `.env.local` file and input your keys:

```bash
# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# STRIPE
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...

# APP
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=super_secret_cron_string
```

### 4. Stripe Webhooks (Local Testing)
Link your Stripe CLI and start listener forwarding to the local backend:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 5. Running the Application
```bash
npm run dev
```

The application will be running at [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deployment (Vercel)

This repository is strictly configured to execute flawlessly in Vercel CI bounds.

1. Create a New Project on Vercel importing this Git Repository.
2. Provide **ALL** the Environment Variables identical to `.env.local`.
3. Set your Production Stripe Webhook target to `https://yourdomain.com/api/stripe/webhook` inside the Stripe Dashboard, grabbing the new `whsec_` secret.
4. Hit Deploy! Vercel will automatically digest `vercel.json` and boot the background cron tasks.

---

<div align="center">
  <i>Developed with precision. Dedicated to digital heroes worldwide.</i>
</div>

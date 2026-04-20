# MyCoupon — Coupon Platform

A full-stack coupon aggregator platform built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **Supabase**.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://mycoupon.co.il
```

### 3. Set up the database
Run the migration file in your Supabase SQL editor:
```
supabase/migrations/001_initial_schema.sql
```
This creates all tables, indexes, RLS policies, triggers, and seeds demo data.

### 4. Run development server
```bash
npm run dev
```

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout (RTL, Heebo font)
│   ├── not-found.tsx               # 404 page
│   ├── sitemap.ts                  # Dynamic sitemap
│   ├── robots.ts                   # robots.txt
│   ├── store/[slug]/page.tsx       # Store page (breadcrumbs, filters, FAQs, schema)
│   ├── coupon/[slug]/page.tsx      # Coupon SEO page
│   ├── stores/page.tsx             # All stores listing
│   ├── coupons/page.tsx            # All coupons listing
│   ├── categories/page.tsx         # Categories listing
│   ├── category/[slug]/page.tsx    # Single category page
│   └── admin/
│       ├── layout.tsx              # Admin sidebar layout
│       ├── page.tsx                # Dashboard overview
│       ├── stores/                 # Store CRUD
│       ├── coupons/                # Coupon CRUD
│       ├── faqs/                   # FAQ CRUD
│       └── settings/               # Site settings
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── hero.tsx
│   │   ├── breadcrumbs.tsx
│   │   └── section-title.tsx
│   ├── coupons/
│   │   ├── coupon-card.tsx         # Card with popup trigger
│   │   ├── coupon-grid.tsx         # Grid + popup state manager
│   │   ├── coupon-popup.tsx        # Modal with copy code + affiliate link
│   │   └── coupon-filters.tsx      # URL-based filter sidebar
│   ├── stores/
│   │   ├── store-card.tsx
│   │   └── faq-section.tsx         # FAQ accordion with JSON-LD
│   ├── admin/
│   │   ├── store-form.tsx
│   │   ├── coupon-form.tsx
│   │   ├── faq-form.tsx
│   │   └── settings-form.tsx
│   └── ui/                         # shadcn/ui primitives
├── lib/
│   ├── supabase.ts                 # Supabase client (browser + server)
│   ├── db.ts                       # All DB queries + admin CRUD
│   ├── utils.ts                    # cn(), formatDate(), fallback logic
│   └── schema.ts                   # JSON-LD schema generators
└── types/
    └── index.ts                    # Full TypeScript types
```

---

## 🗄️ Database Tables

| Table | Description |
|---|---|
| `categories` | Store categories with icon & slug |
| `stores` | Stores with SEO fields, logo, affiliate URL |
| `coupons` | Coupons with code, discount, badge, expiry |
| `faqs` | Per-store FAQ entries |
| `settings` | Key-value site settings |
| `admin_profiles` | Admin user metadata |

---

## ✨ Key Features

- **Homepage**: Hero, featured stores, featured coupons, popular categories
- **Store pages** `/store/[slug]`: Breadcrumbs, store hero, URL-based filters, coupon grid, SEO text, FAQ accordion with JSON-LD schema, similar stores
- **Coupon pages** `/coupon/[slug]`: Full SEO page with JSON-LD Offer schema
- **Coupon popup**: Triggered from cards — shows code, copy button, affiliate link, expiry info
- **Canonical URLs**: Filtered store pages always point canonical to the clean URL
- **Fallback logic**: `coupon.image_url → store.logo_url → placeholder`; `coupon.affiliate_url → store.affiliate_url → store.website_url`
- **Admin CRUD**: Full management for stores, coupons, FAQs, settings
- **RTL + Hebrew**: Full RTL layout using `dir="rtl"`, Heebo font, Hebrew UI
- **Sitemap + robots**: Auto-generated from DB
- **ISR**: `revalidate = 3600` on key pages

---

## 🔧 Install missing plugin

```bash
npm install tailwindcss-animate
```

---

## 🌐 Deploy

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy ✅

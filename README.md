# Local Connect Hub

🎯 OBJECTIVE
Generate a fully working, production-grade hyperlocal multi-category marketplace website using modern full-stack architecture.
This must be:
* Backend-connected
* Database-driven
* Authenticated
* Payment-enabled
* Deployment-ready
* Free from broken routes (no 404 errors)
* Free from mock logic or placeholder systems
This is NOT a UI demo.

🧱 CORE TECH STACK (LOCKED)
Use:
* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Supabase (Auth + PostgreSQL + Storage)
* Stripe (global) or Razorpay (India)
* Vercel deployment compatible
* Server-side logic using Next.js server actions or API routes
Do not use legacy Pages Router.

📁 REQUIRED FOLDER STRUCTURE (NO MISSING ROUTES)
Create this exact structure:

app/
  layout.tsx
  page.tsx
  not-found.tsx

  consumer/
    page.tsx
    listings/page.tsx
    listings/[id]/page.tsx

  seller/
    page.tsx
    listings/page.tsx
    listings/new/page.tsx
    leads/page.tsx
    payments/page.tsx

  admin/
    page.tsx

lib/
  supabase.ts
  auth.ts
  payments.ts
  ai.ts

middleware.ts
Every navigable route must exist physically.
All navigation must use next/link.

🔐 AUTHENTICATION (REAL USERS)
Implement Supabase Auth:
* Email + OTP login
* Server-side session validation
* Middleware protection
* Persistent sessions
* Role support:
    * consumer
    * seller
    * admin
Do not trust client identity.
All role checks must be validated server-side.

🗄 DATABASE SCHEMA + RLS
Create PostgreSQL schema:
Tables:
* users
* profiles
* listings
* categories
* locations
* leads
* reviews
* subscriptions
* payments
* boosts
* audit_logs
Enable Row Level Security on all tables.
RLS policies:
* Sellers can access only their own listings
* Consumers can read public listings only
* Admin has full access
* All sensitive writes require authenticated user
Provide SQL for schema and RLS policies.

🧑 CONSUMER FEATURES
Build:
* AI-powered natural language search
* Category browsing
* Paginated listing results
* Map/List toggle
* Listing detail page
* Reviews system
* Wishlist
* One-click call / WhatsApp redirect
Search must:
* Parse natural language server-side
* Convert to structured DB filters
* Use indexed queries
No mock listings allowed.

🧑‍💼 SELLER FEATURES
Seller Dashboard:
* Views
* Leads
* Listings count
* Earnings
Listings Management:
* Edit
* Pause
* Renew
* Boost
Add/Edit Flow:
* Step-based form
* AI-assisted title/description generation
* Save draft
* Publish activates immediately in DB
Leads Inbox:
* Track lead source
* Update status
* Rate limiting against spam
All statistics must derive from real database queries.

💳 REAL PAYMENT SYSTEM (MANDATORY)
Integrate Stripe or Razorpay:
Implement:
1. Server-side payment intent creation
2. Webhook endpoint for payment verification
3. Idempotent webhook handler
4. Subscription management
5. Boost purchase logic
6. Transaction + invoice persistence
Rules:
* Never activate paid features from frontend confirmation
* Only activate subscription/boost after verified webhook event
* Handle:
    * failed payments
    * duplicate webhooks
    * refunds
    * expired subscriptions
Store:
* transaction records
* subscription status
* boost status

🤖 AI FEATURES (FAIL SAFE)
Implement server-side AI utilities:
* Natural language search parsing
* Listing description generator
* Price suggestion helper
AI must:
* Run server-side
* Have fallback logic if API fails
* Not block core functionality

🛡 SECURITY HARDENING
Add:
* Rate limiting
* Input validation
* Abuse detection
* Audit logging for admin actions
* Consent tracking (ToS + Privacy)
* Secure environment variable handling
No sensitive logic in frontend.

📈 SCALABILITY REQUIREMENTS
Implement:
* Indexed DB queries
* Cursor-based pagination
* Caching for heavy endpoints
* Stateless backend APIs
* Multi-city filtering support
Design must support growth without structural redesign.

🌐 GLOBAL APP SHELL
Create persistent layout:
* Sticky header
* App logo
* Consumer | Seller mode toggle
* Location selector
* Profile dropdown
Mode switching:
* Must not log user out
* Must persist across refresh
Header must wrap all pages via layout.tsx.

🔄 SAFE ROUTING RULES
* No missing routes
* No hardcoded invalid links
* Implement not-found.tsx
* Middleware must redirect unauthorized users safely
* Refreshing any page must not break routing

🚀 DEPLOYMENT READINESS
Ensure:
* npm run dev works
* npm run build passes
* No TypeScript errors
* Environment variables documented in .env.example
* Ready for Vercel deployment
* Webhook endpoint configured for production

⚠️ STRICT ENFORCEMENT RULE
If any feature involves:
* Money
* Access control
* Identity
* Subscription status
It must be enforced:
* Server-side
* Database-level (RLS if applicable)
* Never UI-only

✅ FINAL VERIFICATION BEFORE COMPLETION
Before final output, confirm:
* All routes render
* No 404 errors
* Auth persists on refresh
* RLS blocks unauthorized queries
* Payments activate only via webhook
* No placeholder components remain
* All business logic is implemented

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1c77ec40-64ab-44e9-8828-bb75b477b57e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

# Chartered Insight Hub

A modern web application for Chartered Accountants (CA) and clients to collaborate on financial services.

## Features

- Role-based experience for **Client** and **CA/Admin**
- Service discovery and service request workflow
- Client document upload and CA document review
- Service progress tracking with status updates
- Payment flow after service completion
- Notifications and dashboard insights

## Tech stack

- Vite
- React (JavaScript / JSX)
- Plain CSS (compiled stylesheet committed in `src/index.css`)
- shadcn/ui + Radix UI primitives
- Supabase (Auth, Database, Storage, Edge Functions)

## Local development

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

By default the app runs on the Vite dev server.

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Project structure (high level)

- `src/pages` — route-level pages
- `src/components` — reusable UI and feature components
- `src/contexts` — auth and app contexts
- `src/hooks` — custom React hooks
- `src/lib` — utility modules and data helpers
- `src/integrations/supabase` — Supabase client/config integration
- `supabase/functions` — edge functions (payment/order verification etc.)
- `supabase/migrations` — DB schema migrations

## Payment flow notes

- Payment is intended to happen only after a CA marks a service request as completed.
- Razorpay order creation/verification is handled through Supabase Edge Functions.
- Keep environment variables configured for Supabase and Razorpay before testing payments.

## Configuration notes

- Main app entrypoint: `src/main.jsx`
- Vite config: `vite.config.js`
- Tailwind config (used for CSS generation workflow): `tailwind.config.js`

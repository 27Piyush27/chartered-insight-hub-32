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
- React + TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (Auth, Database, Storage, Edge Functions)

## Local development

### Prerequisites

- Node.js 18+
- npm

### Run locally

```bash
npm install
npm run dev
```

By default the app runs on Vite dev server.

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
- `src/lib` — utility modules and data helpers
- `supabase/functions` — edge functions (payment/order verification etc.)
- `supabase/migrations` — DB schema migrations

## Notes

- Payment is intended to happen only after a CA marks a service request as completed.
- Keep environment variables configured for Supabase and Razorpay before testing payments.

# Veranda Plastics - Outdoor Furniture Management System

A modern, scalable Next.js 15 application for managing outdoor furniture manufacturing and client requests. Built for Veranda Plastics, a company specializing in plastic-based outdoor furniture for hotels and resorts.

## Features

### Public Landing Page
- **Refined Hero Content**: High-impact furniture showcase.
- **Product Gallery**: Expanded catalog featuring 15+ premium products across 4 categories.
- **Dynamic Filters**: Real-time filtering by Category and Material.
- **"Request a Quote" CTA**: Integrated with the new multi-item quote system.

### Client Portal
- **Persistent Quote Basket**: Built with Zustand for a seamless "Add to Quote" experience.
- **Multi-item Requests**: Submit multiple products in a single inquiry.
- **Real-time Messaging**: Instant communication with admins via Pusher-powered chat.
- **Live Status Tracking**: Immediate updates on request status (Pending, Quoted, etc.).
- **Premium Feedback**: Modern toast notifications for every user action.

### Admin Dashboard
- **Request Oversight**: Itemized view of multi-product inquiries with full spec details.
- **Real-time Control**: Chat with clients instantly and update request statuses live.
- **Inventory Management**: Complete CRUD operations for Products, Categories, and Materials.
- **Performance Analytics**: Real-time dashboard statistics.
- **Cloudinary Integration**: Effortless image hosting for furniture catalog.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **State Management**: Zustand (for the Quote Basket)
- **Real-time**: Pusher Channels (Chat & Notifications)
- **Database**: PostgreSQL with Prisma ORM
- **Feedback**: Sonner (Modern Toast Notifications)
- **Authentication**: NextAuth.js
- **Image Storage**: Cloudinary
- **Form Handling**: React Hook Form, Zod

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Pusher account (for real-time features)
- Cloudinary account (for image uploads)

## Getting Started

### 1. Clone and Install

```bash
npm install
```

### 2. Start PostgreSQL Database

```bash
npm run docker:up
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials.

**Required for Real-time:**
- `PUSHER_APP_ID`
- `PUSHER_SECRET`
- `NEXT_PUBLIC_PUSHER_KEY`
- `NEXT_PUBLIC_PUSHER_CLUSTER`

### 4. Setup Database

```bash
npm run prisma:generate
npm run vercel-build # Runs build push and build
npm run seed
```

## Demo Credentials

**Admin Account:**
- Email: `admin@veranda.com`
- Password: `1qaz2wsx3edc`

**Client Account:**
- Email: `client@example.com`
- Password: `1qaz2wsx3edc`

## Project Structure

```
├── app/
│   ├── api/              # API routes (Pusher triggers, Prisma CRUD)
│   ├── admin/            # Executive Overview & Request Panels
│   ├── dashboard/        # Client Request Center
│   ├── layout.tsx        # Global Layout with BasketDrawer & Toaster
├── components/           # UI Components (ProductCard, Stats, Sidebar)
├── lib/
│   ├── store.ts          # Zustand Basket Store
│   ├── pusher.ts         # Pusher Client/Server config
│   └── prisma.ts         # Prisma Client
└── prisma/
    ├── schema.prisma     # Multi-item Relational Schema
    └── seed.ts           # Clean-state Seeding (15 Products)
```

## Architecture Notes

- **Real-time Messaging**: Uses Pusher WebSockets to eliminate polling latency.
- **Optimistic UI**: Chat messages and basket actions update locally first for zero perceived lag.
- **Persistence**: The Quote Basket survives refreshes using LocalStorage sync via Zustand.
- **Responsive Layout**: Designed for executive management on desktop and field-ready use on mobile.

## License

ISC

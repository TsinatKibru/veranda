# Veranda Plastics - Outdoor Furniture Management System

A modern, scalable Next.js 15 application for managing outdoor furniture manufacturing and client requests. Built for Veranda Plastics, a company specializing in plastic-based outdoor furniture for hotels and resorts.

## Features

### Public Landing Page
- Hero section showcasing outdoor furniture
- Product grid with category and material filters
- About, Sustainability, and Contact sections
- "Request a Quote" CTA for new clients

### Client Portal
- User registration and login
- Dashboard to submit and track quote requests
- Real-time messaging with admin
- View company details and request history

### Admin Dashboard
- Secure admin access
- Complete CRUD operations for Products, Categories, and Materials
- Manage quote requests and update statuses
- Two-way messaging with clients
- Dashboard statistics and analytics
- Cloudinary image upload support

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Docker) with Prisma ORM
- **Authentication**: NextAuth.js with Credentials provider
- **Image Storage**: Cloudinary
- **Validation**: Zod, React Hook Form

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Cloudinary account (optional, for image uploads)

## Getting Started

### 1. Clone and Install

```bash
npm install
```

### 2. Start PostgreSQL Database

```bash
npm run docker:up
```

This starts a PostgreSQL container on port 5432.

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update if needed:

```bash
cp .env.example .env
```

The default values are:

```env
DATABASE_URL="postgresql://veranda_admin:veranda_pass@localhost:5432/veranda_db?schema=public"
NEXTAUTH_SECRET=development-secret-key-replace-in-production
NEXTAUTH_URL=http://localhost:3000

# Optional - for image uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Run Database Migrations

```bash
npm run prisma:migrate
```

### 6. Seed the Database

```bash
npm run seed
```

This creates:
- Sample admin and client users
- Categories (Outdoor Chairs, Tables, Planters, Waste Bins)
- Materials (High-Density Plastic, Recycled Plastic, Metal Frame, Wood Composite)
- Sample products with specifications
- Sample quote request with messages

### 7. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Demo Credentials

After seeding, you can log in with:

**Admin Account:**
- Email: `admin@veranda.com`
- Password: `1qaz2wsx3edc`

**Client Account:**
- Email: `client@example.com`
- Password: `1qaz2wsx3edc`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run docker:up` | Start PostgreSQL container |
| `npm run docker:down` | Stop PostgreSQL container |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |
| `npm run seed` | Seed database with sample data |

## Database Schema

### User
- Stores client and admin user information
- Includes company details and contact info
- Password hashed with bcrypt

### Category
- Product categories (chairs, tables, etc.)
- Sortable with `categoryOrder`
- Can be activated/deactivated

### Material
- Material types (plastic, metal, wood composite)
- Linked to products

### Product
- Product catalog with specs stored as JSON
- Multiple images support via `productImageUrls`
- Stock tracking and availability

### Request
- Quote requests from clients
- Status tracking (PENDING, QUOTED, APPROVED, REJECTED)
- Custom specifications stored as JSON

### Message
- Two-way messaging between clients and admin
- Linked to specific requests

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth configuration
│   │   ├── categories/   # Category CRUD
│   │   ├── materials/    # Material CRUD
│   │   ├── products/     # Product CRUD
│   │   ├── requests/     # Request management
│   │   ├── messages/     # Messaging system
│   │   ├── upload/       # Cloudinary uploads
│   │   └── register/     # User registration
│   ├── admin/            # Admin dashboard
│   ├── dashboard/        # Client portal
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   ├── providers.tsx     # Session provider
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ProductCard.tsx
├── lib/
│   └── prisma.ts         # Prisma client singleton
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── docker-compose.yml    # PostgreSQL container
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## Deployment

### Database Migration

For production deployments:

1. Set `DATABASE_URL` to your production database
2. Run migrations: `npx prisma migrate deploy`
3. Set a secure `NEXTAUTH_SECRET`: `openssl rand -base64 32`

### Environment Variables

Ensure all environment variables are set in your deployment platform:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- Cloudinary credentials (if using image uploads)

### Build

```bash
npm run build
npm run start
```

## Features Roadmap

- [ ] Product image gallery management
- [ ] Bulk quote requests
- [ ] Email notifications
- [ ] Invoice generation
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Export data to CSV/PDF

## Architecture Notes

- **App Router**: Uses Next.js 15 App Router for improved performance and SEO
- **Server Components**: Leverages React Server Components where applicable
- **API Routes**: RESTful API design with proper error handling
- **Authentication**: JWT-based sessions with NextAuth
- **Database**: Prisma provides type-safe database access
- **Real-time**: Polling-based updates (can be extended with WebSockets)

## Troubleshooting

### Docker Issues

If PostgreSQL fails to start:
```bash
npm run docker:down
docker volume prune
npm run docker:up
```

### Database Connection

If you get connection errors, ensure:
1. PostgreSQL container is running: `docker ps`
2. `.env` DATABASE_URL matches docker-compose settings
3. Port 5432 is not in use by another service

### Prisma Issues

Reset database if needed:
```bash
npx prisma migrate reset
npm run seed
```

## License

ISC

## Support

For issues or questions, please create an issue in the repository.

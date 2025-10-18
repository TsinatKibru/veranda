# Quick Start Guide

Get your Veranda Plastics application running in 5 minutes.

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Start PostgreSQL
```bash
npm run docker:up
```

## Step 3: Set Up Database
```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

## Step 4: Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Demo Login Credentials

**Admin Dashboard:**
- Email: admin@veranda.com
- Password: 1qaz2wsx3edc
- Access: http://localhost:3000/admin

**Client Portal:**
- Email: client@example.com
- Password: 1qaz2wsx3edc
- Access: http://localhost:3000/dashboard

## What's Included

✅ Public landing page with product catalog
✅ Client registration and quote requests
✅ Admin dashboard with full CRUD operations
✅ Real-time messaging between clients and admin
✅ PostgreSQL database with sample data
✅ Authentication with NextAuth
✅ Beautiful UI with Tailwind CSS and animations

## Next Steps

1. Explore the landing page at http://localhost:3000
2. Register a new client account or use demo credentials
3. Submit quote requests as a client
4. Log in as admin to manage products and respond to requests
5. Check out the comprehensive README.md for detailed documentation

## Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run docker:up` | Start database |
| `npm run docker:down` | Stop database |
| `npm run prisma:studio` | Open database GUI |

## Troubleshooting

**Database connection error?**
Make sure Docker is running and PostgreSQL container is up:
```bash
docker ps
```

**Build errors?**
Clean install:
```bash
rm -rf node_modules .next
npm install
npm run build
```

**Need fresh data?**
Reset and reseed:
```bash
npx prisma migrate reset
npm run seed
```

Enjoy building with Veranda Plastics! 🪑

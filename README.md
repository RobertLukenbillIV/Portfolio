
# Personal Portfolio

A modern, full-stack portfolio website with an admin CMS for managing projects and dynamic pages. Built with React, TypeScript, Node.js, and PostgreSQL.

## Tech Stack

**Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router, React Quill  
**Backend**: Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL  
**Auth**: JWT with httpOnly cookies, role-based access control  
**Testing**: Jest, Supertest, ts-jest  
**Deploy**: Vercel (frontend), Render (backend), Neon DB (database)

## Features

- **Project Portfolio** - Showcase up to 3 featured projects on homepage, full project listings with detail pages
- **Dynamic Pages** - Editable About and Links pages with customizable hero descriptions
- **Admin CMS** - Rich text editor, image gallery, project management, site-wide settings
- **Image Management** - Upload to Cloudinary (persistent) or local storage (development), browse gallery, delete files
- **Authentication** - Secure JWT-based admin login with role-based permissions
- **Responsive Design** - Mobile-first UI that works on all devices

## Project Structure

```
Portfolio/
├── apps/
│   ├── frontend/          # React SPA
│   │   └── src/
│   │       ├── components/    # Navbar, Footer, UI components
│   │       ├── pages/         # Home, Projects, About, Admin, etc.
│   │       ├── routes/        # Login page
│   │       ├── state/         # Auth context
│   │       └── lib/           # API client
│   │
│   └── backend/           # Express.js API
│       ├── src/
│       │   ├── controllers/   # Request handlers
│       │   ├── services/      # Business logic
│       │   ├── repositories/  # Database access
│       │   ├── middleware/    # Auth middleware
│       │   ├── routes/        # API routes
│       │   └── utils/         # JWT, hashing, cookies
│       ├── prisma/            # Database schema & migrations
│       └── scripts/           # Admin utilities
│
└── pnpm-workspace.yaml    # Monorepo config
```

## Quick Start

### Prerequisites
- Node.js v18+, pnpm v8+, PostgreSQL

### Setup

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd Portfolio
   pnpm install
   ```

2. **Configure environment**
   
   Create `apps/backend/.env`:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/portfolio"
   JWT_SECRET="your-secret-key"
   CORS_ORIGINS="http://localhost:5173"
   
   # Optional: For persistent image storage (recommended for production)
   CLOUDINARY_CLOUD_NAME=""
   CLOUDINARY_API_KEY=""
   CLOUDINARY_API_SECRET=""
   ```
   
   Create `apps/frontend/.env`:
   ```env
   VITE_API_URL="http://localhost:4000/api"
   ```

3. **Setup database**
   ```bash
   cd apps/backend
   pnpm prisma generate
   pnpm prisma migrate deploy
   pnpm make-admin admin@example.com password123 "Admin"
   ```

4. **Start dev servers**
   ```bash
   cd ../..  # back to root
   pnpm -r dev
   ```
   
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000/api

## Scripts

**From root:**
- `pnpm -r dev` - Start both apps
- `pnpm -r build` - Build for production
- `pnpm -r test` - Run all tests

**Backend (`apps/backend/`):**
- `pnpm dev` - Dev server (port 4000)
- `pnpm test` - Run Jest tests
- `pnpm test:coverage` - Coverage report
- `pnpm make-admin <email> <password> [name]` - Create admin
- `pnpm seed` - Populate sample data

**Frontend (`apps/frontend/`):**
- `pnpm dev` - Dev server (port 5173)
- `pnpm build` - Production build

## Architecture

**Frontend**: React SPA with protected routes, auth context manages login state  
**Backend**: Express MVC pattern (Routes → Controllers → Services → Repositories)  
**Auth**: JWT in httpOnly cookies, role-based access (ADMIN/USER)  
**Database**: PostgreSQL with Prisma ORM, migrations for schema changes

## API Overview

**Auth**: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`  
**Posts**: CRUD + featured toggle at `/api/posts`  
**Pages**: Dynamic About/Links at `/api/pages/:slug`  
**Settings**: Site-wide config at `/api/settings`  
**Upload**: Image upload/delete at `/api/upload`

**Database Models**: User, Post, Page, Settings, Image

## Deployment

**Frontend (Vercel)**
- Build: `cd apps/frontend && pnpm build`
- Output: `apps/frontend/dist`
- Env: `VITE_API_URL`

**Backend (Render)**
- Build: `cd apps/backend && pnpm build`
- Start: `cd apps/backend && pnpm start`
- Env: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`, `CORS_ORIGINS`
- Optional: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Important:** Set up [Cloudinary](CLOUDINARY_SETUP.md) for persistent image storage

**Database (Neon)**
- Create project, copy connection string
- Run migrations: `pnpm migrate:deploy`

## Testing

**53 unit tests** with Jest + TypeScript covering utils, services, and business logic.

```bash
pnpm test              # Run all tests
pnpm test:coverage     # With coverage report
```

## License

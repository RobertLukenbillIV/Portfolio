# Copilot Instructions - Portfolio Project

## Architecture Overview
This is a **pnpm monorepo** with React frontend + Node.js backend + Prisma ORM. Apps are deployed separately: frontend to Vercel, backend to Render with Neon DB.

### Project Structure
- `apps/backend/` - Express.js API with MVC pattern, TypeScript, Prisma + PostgreSQL
- `apps/frontend/` - React SPA with Vite, TypeScript, Tailwind CSS, React Router
- Authentication: JWT cookies with role-based access (ADMIN/USER)

## Key Development Patterns

### Backend MVC Architecture
Follow strict layering: **Routes → Controllers → Services → Repositories**
- Controllers: Thin, handle HTTP concerns (`post.controller.ts`)
- Services: Business logic (`post.service.ts`) 
- Repositories: Data access (`post.repo.ts`)
- All use `export const functionName = ` pattern, imported as `* as moduleName`

### Authentication Flow
- JWT stored in httpOnly cookies via `COOKIE_NAME` from `utils/cookie.ts`
- `attachUser` middleware auto-attaches `req.user` to all requests
- Use `requireAuth` and `requireAdmin` middlewares for protection
- Frontend: `AuthContext` provides `{ user, loading, login, logout }`

### Database & Prisma
- Models: `User`, `Post`, `Page`, `Settings`, `Image` 
- Featured posts system: `Post.featured` boolean for homepage
- Use `prisma` from `lib/db.ts` - already instantiated
- Admin scripts: `make-admin.ts`, `change-password.ts` for user management

### CORS & Environment
- Backend allows Vercel preview deployments: `host.endsWith('.vercel.app')`
- Environment: `CORS_ORIGINS`, `JWT_SECRET`, `DATABASE_URL`, `NODE_ENV`
- Frontend API base: `VITE_API_URL` or fallback to `localhost:4000`

## Essential Commands
```bash
# Development (run from repo root)
pnpm -r dev          # Start both frontend and backend
pnpm -r build        # Build all apps

# Backend-specific (from apps/backend/)
pnpm seed            # Seed database
pnpm make-admin <email> <password> [name]  # Create admin user
pnpm migrate:deploy  # Deploy Prisma migrations
```

## Component Patterns

### Frontend State Management
- `AuthContext` for user state - wrap app in `AuthProvider`
- `Protected` component for auth-gated content
- API calls via `api` instance from `lib/api.ts` (axios with `withCredentials`)

### Route Protection
- Backend: Use middleware stack `requireAuth` → `requireAdmin` 
- Frontend: Check `user?.role === 'ADMIN'` in components

### File Naming Conventions
- Backend: `*.controller.ts`, `*.service.ts`, `*.repo.ts`, `*.routes.ts`
- Frontend: PascalCase components, camelCase utilities
- Both have parallel `.js` legacy files - prefer TypeScript versions

## Integration Points
- Cookie-based auth between frontend/backend (same-site/cross-origin handling)
- Prisma schema changes require: `prisma generate` → `prisma migrate deploy` 
- Image uploads go through backend `/api/posts` routes
- Rich text editor: React Quill for post content

## Deployment Context
- Backend expects `trust proxy` for Render deployment
- Frontend uses Vite with `@` alias for `src/`
- Both apps have independent `package.json` with overlapping TypeScript configs
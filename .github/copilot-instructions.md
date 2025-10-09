# Copilot Instructions - Portfolio Project

## Architecture Overview
This is a **pnpm monorepo** with React frontend + Node.js backend + Prisma ORM. Apps are deployed separately: frontend to Vercel, backend to Render with Neon DB.

### Project Structure
- `apps/backend/` - Express.js API with strict MVC pattern, TypeScript, Prisma + PostgreSQL
- `apps/frontend/` - React SPA with Vite, TypeScript, Tailwind CSS, React Router  
- `packages/shared/` - Shared types/utilities (future expansion)
- Authentication: JWT httpOnly cookies with role-based access (ADMIN/USER)

## Critical Development Patterns

### Backend MVC Architecture
**ALWAYS** follow strict layering: **Routes → Controllers → Services → Repositories**
```typescript
// Example: Post operations flow
// 1. routes/posts.routes.ts  → 2. controllers/post.controller.ts
// 3. services/post.service.ts → 4. repositories/post.repo.ts
```
- **Controllers**: Thin HTTP handlers, extract `req.user` from auth middleware
- **Services**: Pure business logic, coordinate between repositories  
- **Repositories**: Database-only operations using Prisma client
- **Pattern**: All modules use `export const functionName = ` and imported as `* as moduleName`

### Authentication Architecture
```typescript
// Backend middleware chain:
// 1. attachUser (on ALL routes) - silently attaches user if JWT exists
// 2. requireAuth - blocks if no user (401)  
// 3. requireAdmin - blocks if not admin (403)

// Frontend state:
// AuthContext provides { user, loading, login, logout }
// Wrap entire App in <AuthProvider> in main.tsx
```
- JWT stored in httpOnly cookies via `COOKIE_NAME` from `utils/cookie.ts`
- Backend: Access user via `(req as AuthRequest).user`
- Frontend: Access via `const { user } = useAuth()` hook

### Database Patterns & Prisma
- **Models**: `User`, `Post` (projects), `Page` (About/Links), `Settings` (hero), `Image`
- **Featured system**: `Post.featured` boolean, max 3 for homepage
- **Data access**: Use shared `prisma` instance from `lib/db.ts` (not local instances)
- **CRITICAL**: Always run `prisma generate` before tests/builds to avoid initialization errors
- **Schema changes**: Always run `prisma generate` → `prisma migrate deploy`

### CORS Configuration (Critical for Deployment)
```typescript
// Backend app.ts handles multi-layer origin validation:
// 1. CORS_ORIGINS env var (CSV)
// 2. Hardcoded defaults (localhost:3000, localhost:5173)  
// 3. All *.vercel.app domains (preview deployments)
// 4. Local network IPs for development
```
- Production: `CORS_ORIGINS`, `JWT_SECRET`, `DATABASE_URL` required
- Development: Frontend uses `VITE_API_URL` or `localhost:4000/api` fallback

## Essential Commands & Scripts
```bash
# Monorepo (from root)
pnpm -r dev          # Start both apps with hot reload
pnpm -r build        # Build both for production
pnpm -r test         # Run all test suites

# Backend (from apps/backend/)
pnpm make-admin <email> <password> [name]  # Create admin user
pnpm change-password <email> <newPassword> # Update user password
pnpm seed            # Populate dev database with sample data
pnpm test:coverage   # Run Jest with coverage report
```

## Testing Patterns (Jest + Supertest)
```typescript
// Mock auth middleware in all route tests:
jest.mock('../../middleware/auth', () => ({
  attachUser: (req, res, next) => { req.user = { id: 'test-user-id', role: 'ADMIN' }; next() },
  requireAuth: (req, res, next) => { req.user = { id: 'test-user-id', role: 'ADMIN' }; next() }
}))

// Import app AFTER mocking to ensure mocks are applied
import app from '../../app'
```
- Test files: `**/__tests__/**/*.test.ts` 
- Coverage excludes: `server.ts`, `lib/db.ts`, `*.d.ts` files
- Setup file: `src/__tests__/setup.ts` for global test configuration

### Frontend Component Patterns
- **State**: AuthContext for user state, local useState for UI state
- **API calls**: Use `api` instance from `lib/api.ts` (axios + `withCredentials: true`)
- **Route protection**: Check `user?.role === 'ADMIN'` for admin features
- **File naming**: PascalCase components, camelCase utilities

### Upload & File Handling
- **Images**: Upload via `POST /api/upload` with `multipart/form-data`
- **Storage**: Local filesystem at `uploads/images/` (timestamped filenames)
- **Serving**: Static files via Express at `/uploads` route
- **Gallery**: `GET /api/upload/list` returns uploaded image URLs

## Integration Points
- **Cookie auth**: Same-site for localhost, cross-origin for production (Vercel ↔ Render)
- **Rich text**: React Quill editor with image embedding support
- **Featured posts**: Homepage displays up to 3 posts where `featured = true`
- **Dynamic pages**: About/Links are editable via admin, stored in `Page` model

## CI/CD & Deployment Context
- **GitHub Actions**: Multi-node (18, 20, 22) testing with coverage reports
- **Backend**: Render with `trust proxy` enabled, auto-migration on deploy
- **Frontend**: Vercel with `@` alias for `src/`, automatic preview deployments
- **Database**: Neon PostgreSQL with connection pooling
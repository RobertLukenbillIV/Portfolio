# Personal Portfolio - Full-Stack Web Application

[![CI/CD Pipeline](https://github.com/RobertLukenbillIV/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/RobertLukenbillIV/Portfolio/actions/workflows/ci.yml)
[![Test Coverage](https://github.com/RobertLukenbillIV/Portfolio/actions/workflows/coverage.yml/badge.svg)](https://github.com/RobertLukenbillIV/Portfolio/actions/workflows/coverage.yml)
[![Security Scan](https://github.com/RobertLukenbillIV/Portfolio/actions/workflows/security.yml/badge.svg)](https://github.com/RobertLukenbillIV/Portfolio/actions/workflows/security.yml)
[![Deploy Status](https://github.com/RobertLukenbillIV/Portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/RobertLukenbillIV/Portfolio/actions/workflows/deploy.yml)

A modern, responsive portfolio website built with React frontend and Node.js backend, featuring a content management system for projects and dynamic pages. Designed for developers to showcase their work with a professional, customizable interface.

## Architecture Overview

This is a **pnpm monorepo** with separate frontend and backend applications:

- **Frontend**: React SPA with TypeScript, Vite, Tailwind CSS, and React Router
- **Backend**: Express.js API with MVC architecture, TypeScript, Prisma ORM, and PostgreSQL
- **Authentication**: JWT-based with httpOnly cookies and role-based access control

## Technologies Used

### Frontend Stack
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Quill** - Rich text editor for content

### Backend Stack
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework with MVC pattern
- **TypeScript** - Type-safe server development
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Testing & Development Tools
- **Jest** - JavaScript testing framework with TypeScript support
- **Supertest** - HTTP assertion library for API testing
- **ts-jest** - TypeScript preprocessor for Jest
- **Coverage Reporting** - Built-in test coverage analysis

### Web Services & Deployment
- **Frontend Hosting**: [Vercel](https://vercel.com/) - Automatic deployments from Git
- **Backend Hosting**: [Render](https://render.com/) - Managed Node.js hosting
- **Database**: [Neon DB](https://neon.tech/) - Serverless PostgreSQL
- **Domain**: Custom domain with SSL/TLS certificates

## Key Features

### For Visitors
- **Dynamic Homepage** - Customizable hero image and introduction text
- **Project Showcase** - Grid layout with featured projects on homepage
- **Individual Project Pages** - Detailed view for each project with full content and navigation
- **About Page** - Editable personal information and biography
- **Links Page** - Social media and contact links
- **Responsive Design** - Mobile-first, works on all devices

### For Admin Users
- **Content Management** - Create, edit, and delete projects/posts
- **Rich Text Editor** - Format content with images, links, and styling
- **Image Upload** - Direct file upload for project covers and content
- **Featured Projects** - Mark up to 3 projects for homepage display
- **Settings Management** - Update site-wide settings (hero image, intro text)
- **Authentication** - Secure login with role-based permissions

## Project Structure

```
Portfolio/
├── apps/
│   ├── frontend/                 # React SPA (TypeScript only)
│   │   ├── src/
│   │   │   ├── components/       # Reusable UI components (6 files)
│   │   │   │   ├── Navbar.tsx    # Navigation header with auth state
│   │   │   │   ├── Protected.tsx # Auth route wrapper component
│   │   │   │   ├── ProjectCard.tsx # Individual project display
│   │   │   │   ├── PostEditor.tsx  # Rich text content editor
│   │   │   │   ├── FeatureToggle.tsx # Admin featured post control
│   │   │   │   └── RichText.tsx  # Rich text display component
│   │   │   ├── pages/           # Main page components (8 files)
│   │   │   │   ├── Home.tsx     # Homepage with featured content
│   │   │   │   ├── Projects.tsx # Portfolio grid display
│   │   │   │   ├── PostDetail.tsx # Individual project details
│   │   │   │   ├── About.tsx    # Dynamic about page
│   │   │   │   ├── Links.tsx    # Dynamic links page
│   │   │   │   ├── SinglePage.tsx # Shared dynamic page template
│   │   │   │   ├── AdminDashboard.tsx # Content management
│   │   │   │   └── PostEditor.tsx # Create/edit post interface
│   │   │   ├── routes/          # Authentication routes only
│   │   │   │   └── Login.tsx    # Login form component
│   │   │   ├── state/           # Global state management
│   │   │   │   └── auth.tsx     # Authentication context & hooks
│   │   │   ├── lib/             # Utilities and configuration
│   │   │   │   └── api.ts       # Axios HTTP client setup
│   │   │   ├── App.tsx          # Main router and layout
│   │   │   ├── main.tsx         # Application entry point
│   │   │   └── index.css        # Global styles and Tailwind
│   │   └── package.json
│   │
│   └── backend/                 # Express.js API (TypeScript only)
│       ├── src/
│       │   ├── controllers/     # HTTP request handlers (4 files)
│       │   │   ├── auth.controller.ts    # Authentication endpoints
│       │   │   ├── post.controller.ts    # Project/post CRUD operations
│       │   │   ├── pages.controller.ts   # Dynamic page management
│       │   │   └── settings.controller.ts # Site configuration
│       │   ├── services/        # Business logic layer (2 files)
│       │   │   ├── auth.service.ts   # Authentication business logic
│       │   │   └── post.service.ts   # Post management logic
│       │   ├── repositories/    # Data access layer (2 files)
│       │   │   ├── post.repo.ts     # Post database operations
│       │   │   └── user.repo.ts     # User database operations
│       │   ├── middleware/      # Express middleware (1 file)
│       │   │   └── auth.ts      # JWT authentication & authorization
│       │   ├── routes/          # API route definitions (4 files)
│       │   │   ├── auth.routes.ts     # Authentication routes
│       │   │   ├── posts.routes.ts    # Post/project routes
│       │   │   ├── pages.routes.ts    # Dynamic page routes
│       │   │   └── settings.routes.ts # Settings routes
│       │   ├── utils/           # Utility functions (3 files)
│       │   │   ├── jwt.ts       # JWT token operations
│       │   │   ├── hash.ts      # Password hashing utilities
│       │   │   └── cookie.ts    # Secure cookie configuration
│       │   ├── lib/             # Shared libraries
│       │   │   └── db.ts        # Prisma client instance
│       │   ├── app.ts           # Express app configuration
│       │   └── server.ts        # Application entry point
│       ├── prisma/
│       │   ├── schema.prisma    # Database schema definition
│       │   ├── seed.ts          # Database seeding script
│       │   └── migrations/      # Database migration files
│       ├── scripts/
│       │   ├── make-admin.ts    # Admin user creation utility
│       │   └── change-password.ts # Password change utility
│       └── package.json
│
├── package.json                 # Workspace root configuration
├── pnpm-workspace.yaml         # pnpm monorepo configuration
└── README.md                   # Project documentation
```

> **Note**: This structure reflects a cleaned, production-ready codebase with duplicate JavaScript files removed and TypeScript as the single source of truth throughout the application.

## Development Setup

### Prerequisites
- **Node.js** (v18 or later)
- **pnpm** (v8 or later) - `npm install -g pnpm`
- **PostgreSQL database** (local or cloud)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   **Backend** (`apps/backend/.env`):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
   JWT_SECRET="your-super-secret-jwt-key-here"
   NODE_ENV="development"
   CORS_ORIGINS="http://localhost:5173"
   ```

   **Frontend** (`apps/frontend/.env`):
   ```env
   VITE_API_URL="http://localhost:4000/api"
   ```

4. **Set up the database**
   ```bash
   cd apps/backend
   pnpm prisma migrate deploy
   pnpm seed  # Optional: populate with sample data
   ```

5. **Create an admin user**
   ```bash
   cd apps/backend
   pnpm make-admin admin@example.com securepassword "Admin User"
   ```

6. **Start development servers**
   ```bash
   # From repository root - starts both frontend and backend
   pnpm -r dev
   ```

   **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000/api
   - Admin Login: Use the credentials from step 5

## Available Scripts

### Workspace Level (run from repository root)
```bash
pnpm -r dev          # Start both frontend and backend in development mode
pnpm -r build        # Build both applications for production
pnpm -r test         # Run tests for all packages
```

### Backend Specific (run from `apps/backend/`)
```bash
pnpm dev             # Start backend development server (port 4000)
pnpm build           # Build TypeScript to JavaScript
pnpm start           # Start production server
pnpm test            # Run all tests
pnpm test:watch      # Run tests in watch mode
pnpm test:coverage   # Run tests with coverage report
pnpm seed            # Populate database with sample data
pnpm make-admin      # Create admin user: pnpm make-admin <email> <password> [name]
pnpm migrate:deploy  # Apply database migrations
pnpm prisma:generate # Generate Prisma client
```

### Frontend Specific (run from `apps/frontend/`)
```bash
pnpm dev             # Start frontend development server (port 5173)  
pnpm build           # Build for production (outputs to dist/)
pnpm preview         # Preview production build locally
```

## Authentication System

### JWT Cookie Authentication
- **Secure httpOnly cookies** prevent XSS attacks
- **SameSite=Strict** protects against CSRF
- **Automatic token refresh** on valid requests
- **Role-based access control** (ADMIN/USER roles)

### Authentication Flow
1. User submits login credentials
2. Backend validates credentials and creates JWT
3. JWT stored in httpOnly cookie with secure settings
4. Frontend receives user data (excluding password)
5. Subsequent requests include cookie automatically
6. Backend middleware validates JWT on protected routes

### Admin Features
- Content management (create/edit/delete posts)
- Site settings (hero image, intro text)
- User management capabilities
- Protected admin-only routes

## Database Schema

### Core Models
- **User** - Authentication and user management
- **Post** - Projects/blog posts with rich content
- **Page** - Dynamic pages (About, Links)
- **Settings** - Site-wide configuration
- **Image** - File upload management

### Key Relationships
- Users can create multiple Posts
- Posts can be marked as "featured" for homepage display
- Settings store global site configuration
- Pages contain editable content for static routes

## Deployment Guide

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `cd apps/frontend && pnpm build`
3. Set output directory: `apps/frontend/dist`
4. Add environment variables:
   - `VITE_API_URL`: Your backend API URL

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `cd apps/backend && pnpm build`
4. Set start command: `cd apps/backend && pnpm start`
5. Add environment variables:
   - `DATABASE_URL`: Your Neon DB connection string
   - `JWT_SECRET`: Secure random string
   - `NODE_ENV`: `production`
   - `CORS_ORIGINS`: Your frontend domain

### Database (Neon DB)
1. Create new Neon DB project
2. Copy connection string to `DATABASE_URL`
3. Run migrations: `pnpm migrate:deploy`
4. Create admin user: `pnpm make-admin`

### GitHub Actions Setup
To enable the full CI/CD pipeline, configure these repository secrets in GitHub:

**Required Secrets:**
- `CODECOV_TOKEN` - For coverage reporting (optional but recommended)
  - Sign up at [Codecov.io](https://codecov.io/)
  - Connect your repository and copy the token
  - Add as repository secret in GitHub Settings > Secrets and variables > Actions

**Optional Secrets (for deployment automation):**
- `RENDER_API_KEY` - For automated backend deployments 
- `VERCEL_TOKEN` - For automated frontend deployments

**GitHub Repository Settings:**
1. **Branch Protection Rules** (Settings > Branches):
   - Require status checks to pass before merging
   - Require up-to-date branches before merging
   - Include administrators in restrictions

2. **Actions Permissions** (Settings > Actions > General):
   - Allow GitHub Actions to create and approve pull requests
   - Allow GitHub Actions to write to repository contents

The CI/CD pipeline will run automatically on push and pull requests, even without secrets configured. Codecov integration is gracefully skipped if the token isn't available.

## Testing Framework

### Comprehensive Unit Testing
- **Jest Configuration** - Complete TypeScript integration with coverage reporting
- **Mock Strategy** - External dependencies isolated (Prisma, bcryptjs, jsonwebtoken)
- **Test Organization** - Clear describe/it structure with meaningful assertions
- **53 Passing Tests** across utilities, services, and business logic

### Test Coverage
```bash
# Backend Test Suites (53 tests total)
├── Utility Tests (28 tests)
│   ├── JWT Operations (9 tests) - Token creation, verification, expiration
│   ├── Password Hashing (12 tests) - bcrypt integration, security validation  
│   └── Cookie Security (7 tests) - Environment-based configuration, CORS settings
├── Service Layer Tests (25 tests)
│   ├── Authentication Service (10 tests) - Login flow, token validation, error handling
│   └── Post Service (15 tests) - CRUD operations, repository integration
```

### Running Tests
```bash
# All tests
pnpm test

# Watch mode for development
pnpm test:watch

# Coverage report
pnpm test:coverage

# Specific test suites
pnpm test src/utils/__tests__/
pnpm test src/services/__tests__/
```

### Test Infrastructure
- **Prisma Mocking** - Database operations isolated for pure unit testing
- **Environment Setup** - Test-specific configuration with proper cleanup
- **Error Scenarios** - Comprehensive edge cases and failure condition testing
- **Type Safety** - Full TypeScript integration in test files

## CI/CD Pipeline

### GitHub Actions Workflows
- **CI/CD Pipeline** (`ci.yml`) - Comprehensive testing across multiple Node.js versions
- **Test Coverage** (`coverage.yml`) - Coverage analysis with quality gates and reporting
- **Security Scanning** (`security.yml`) - Vulnerability detection and dependency auditing
- **Performance Testing** (`performance.yml`) - Build performance and load testing benchmarks
- **Deployment** (`deploy.yml`) - Automated production deployments with health checks

### Quality Gates
- **Minimum Test Coverage**: 20% across all modules (target: 80%)
- **Security Compliance**: Zero moderate+ vulnerabilities
- **Performance Standards**: Build time < 60s, test execution < 30s
- **Dependency Management**: Automated security and license compliance checks

### Automated Workflows
```bash
# Triggers for each workflow
├── Pull Request → CI/CD + Coverage + Security
├── Push to Main → Full Pipeline + Deployment  
├── Daily Schedule → Security Audit
└── Manual Dispatch → Custom Environment Deployment
```

### Deployment Process
1. **Pre-deployment Validation** - All tests pass, security clear, version tagging
2. **Backend Deployment** - Automatic deployment to Render with health checks
3. **Frontend Deployment** - Vercel deployment with CDN optimization
4. **Post-deployment** - Smoke tests, monitoring updates, release notes

## Code Quality & Architecture

### Clean Codebase
- **TypeScript Only** - All duplicate JavaScript files removed for consistency
- **Single Source of Truth** - Eliminated duplicate route and context files
- **Comprehensive Documentation** - Every file includes detailed comments explaining functionality and connections
- **Proper Separation of Concerns** - Clear MVC architecture with distinct layers
- **Test-Driven Quality** - Unit tests ensure reliability and prevent regressions

### Recent Improvements
- **Removed 25+ unnecessary files** including duplicate JS/TS versions
- **Fixed missing project detail pages** - Individual project viewing now fully functional
- **Enhanced backend API** - Added proper endpoints for individual post access
- **Streamlined project structure** - Removed empty files and redundant type definitions
- **Improved error handling** - Better loading states and error messages
- **Complete routing** - All navigation links now properly functional
- **Professional Testing Framework** - Comprehensive unit testing with Jest and TypeScript

## Customization

### Styling
- **Tailwind CSS** with custom color palette
- **Brand colors** defined in `tailwind.config.ts`
- **Responsive design** with mobile-first approach
- **Custom components** with consistent styling

### Content Management
- **Rich text editor** for post content
- **Image upload** for visual content
- **Dynamic pages** editable through admin interface
- **SEO-friendly** URLs and meta tags

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with proper TypeScript typing
4. Add comments explaining functionality and connections
5. Test your changes locally
6. Submit a pull request with detailed description

## Support

For questions or issues:
1. Check the existing GitHub issues
2. Create a new issue with detailed description
3. Include relevant error messages and logs
4. Mention your environment details (Node.js version, OS, etc.)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

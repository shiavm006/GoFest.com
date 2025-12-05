# GoFest.com - College Fest Platform

**Building India's most trusted college fest network**

A comprehensive platform connecting college students with fest organizers across India. Discover, register, and manage college fests with ease.

**🌐 Live URLs:**
- **Frontend**: [https://gofest-com.vercel.app/](https://gofest-com.vercel.app/)
- **Backend API**: [https://gofest-com.onrender.com](https://gofest-com.onrender.com)

---

## Table of Contents

1. [Product Design Requirements](#1-product-design-requirements)
2. [Tech Stack](#2-tech-stack)
3. [App Flowchart](#3-app-flowchart)
4. [Project Rules](#4-project-rules)
5. [Implementation Plan](#5-implementation-plan)
6. [Frontend Guidelines](#6-frontend-guidelines)
7. [Backend Guidelines](#7-backend-guidelines)
8. [Optimised React Code Guidelines](#8-optimised-react-code-guidelines)
9. [Security Checklist](#9-security-checklist)

---

## 1. Product Design Requirements

### 1.1 Project Vision

**GoFest.com** is India's premier platform for college fest discovery and management, connecting students with fest organizers across India.

### 1.2 Target Users

- **Students**: Browse and register for college fests
- **Organizers**: Create and manage fests, track registrations
- **Administrators**: Platform moderation and management

### 1.3 Core Features

**For Students:**
- Event discovery with search, filters, and sorting
- Interactive maps with location visualization
- One-click registration with email confirmation
- Track all registered fests

**For Organizers:**
- Comprehensive fest creation form
- Media management (Cloudinary)
- Registration management with CSV export
- Email notifications for new registrations

**Platform:**
- JWT-based authentication
- User profiles with bio and avatar
- SendGrid email automation
- Responsive mobile-first design

### 1.4 Requirements

**Performance**: Page load < 2s, API response < 500ms  
**Security**: HTTPS only, secure authentication  
**Accessibility**: WCAG 2.1 AA compliance  
**Scalability**: Support 10,000+ concurrent users

---

## 2. Tech Stack

### Frontend
- **Next.js 16.0.7** (React 19.2.1) - SSR, routing, optimization
- **Tailwind CSS 4.0** - Utility-first styling
- **Framer Motion** - Animations
- **Radix UI** - Accessible components
- **Leaflet** - Interactive maps
- **Cloudinary** - Image management
- **TypeScript** - Type safety

### Backend
- **Node.js** + **Express.js 4.18.2** - REST API
- **MongoDB 8.0.3** + **Mongoose** - Database
- **JWT** (`jsonwebtoken`) - Authentication
- **bcryptjs** - Password hashing
- **SendGrid** - Email service

### Deployment
- **Frontend**: Vercel (automatic HTTPS, CDN, DDoS protection)
- **Backend**: Render (managed infrastructure, HTTPS)
- **Database**: MongoDB Atlas (managed, encrypted, backed up)

---

## 3. App Flowchart

### High-Level Architecture

```
User Browser (Next.js) → Express.js Backend → MongoDB
                              ↓
                    SendGrid (Email) + Cloudinary (Media)
```

### User Journey

**Student**: Landing → Browse Events → Event Details → Register → Email Confirmation  
**Organizer**: Login → Host Dashboard → Create Fest → View Registrations → Export CSV

---

## 4. Project Rules

### Code Style
- No comments in code - self-documenting code only
- camelCase for variables/functions, PascalCase for components
- kebab-case for file names
- One component per file

### Git Workflow
- **Main branch**: `main` (production-ready)
- **Feature branches**: `feature/feature-name`
- **Commit format**: `<type>(<scope>): <subject>`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Testing
- Component tests for user interactions
- API tests for endpoints
- E2E tests for critical flows

### Performance
- Code splitting for routes
- Image optimization with Next.js Image
- Bundle size < 200KB (gzipped)
- Database query optimization

---

## 5. Implementation Plan

### Phase 1: Foundation ✅
- Project setup, authentication system

### Phase 2: Core Features ✅
- Fest management, registration system

### Phase 3: Enhanced Features ✅
- Search, sorting, maps, media management

### Phase 4: Email Integration ✅
- SendGrid setup, email templates

### Phase 5: Organizer Dashboard ✅
- Registration viewing, CSV export

### Phase 6: UI/UX Polish ✅
- Responsive design, animations, accessibility

### Phase 7: Testing & Deployment
- Unit tests, integration tests, production deployment

---

## 6. Frontend Guidelines

### Design Principles
- **Minimalism**: Clean, uncluttered interfaces
- **Whitespace**: Generous spacing
- **Mobile-first**: Design for mobile, enhance for desktop
- **Accessibility**: WCAG 2.1 AA compliance

### Component Structure
```
components/
  ├── ui/              # Reusable UI components
  ├── hooks/           # Custom React hooks
  └── providers/       # Context providers
```

### Performance
- Lazy load heavy components with `dynamic()`
- Use Next.js `Image` component
- Memoize expensive calculations with `useMemo`
- Use `useCallback` for stable function references

### Styling
- Tailwind CSS utilities
- Responsive prefixes (`md:`, `lg:`)
- Avoid inline styles (use Tailwind classes)

---

## 7. Backend Guidelines

### API Design
```
GET    /api/fests              # List all fests
GET    /api/fests/:slug        # Get fest by slug
POST   /api/fests              # Create fest (auth)
POST   /api/fests/:id/register # Register (auth)
GET    /api/fests/:id/registrations # View registrations (auth)
```

### Database
- MongoDB with Mongoose ODM
- Schema validation on all models
- Indexed fields for performance
- Input sanitization before queries

### Security
- JWT authentication middleware
- Password hashing with bcrypt (10 rounds)
- Input validation and sanitization
- Generic error messages to clients

### Error Handling
```javascript
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    detail: err.message || "Internal server error"
  });
});
```

---

## 8. Optimised React Code Guidelines

### ❌ Problem: Inline Objects/Functions
```tsx
// BAD - Creates new object on every render
<MapComponent style={{ width: '100%' }} />
```

### ✅ Solution: Memoize Values
```tsx
// GOOD - Stable references
const mapStyle = useMemo(() => ({ width: '100%' }), []);
<MapComponent style={mapStyle} />
```

### Component Optimization
- Use `React.memo` for expensive components
- Use `useMemo` for expensive calculations
- Use `useCallback` for stable function references
- Use stable keys in lists (`fest._id`)

### State Management
- Avoid unnecessary state - use computed values
- Batch state updates when possible
- Use Context API for global state (theme, auth)

---

## 9. Security Checklist

### ✅ 9.1 Authentication
- JWT tokens with expiration
- Password hashing with bcrypt (10 rounds)
- **Recommendation**: Consider Clerk/Auth0 for production (MFA, sessions)

### ✅ 9.2 Protected Endpoints
- All protected routes use `authenticate` middleware
- Verify user permissions (e.g., fest ownership)

### ✅ 9.3 Secrets Management
- All secrets in `.env` files
- `.env` in `.gitignore`
- Only `NEXT_PUBLIC_*` vars exposed to client

### ✅ 9.4 Error Messages
- Generic messages to clients
- Detailed errors logged server-side only
- Never expose stack traces

### ✅ 9.5 Middleware Auth
- JWT verification on every protected route
- User validation and active status check

### ⚠️ 9.6 Role-Based Access Control
- Basic roles implemented (`student`, `organizer`, `admin`)
- **Recommendation**: Add comprehensive RBAC middleware

### ✅ 9.7 Secure Database
- Mongoose ODM (prevents NoSQL injection)
- Schema validation
- Use MongoDB Atlas with encryption

### ✅ 9.8 Secure Hosting
- **Frontend**: Vercel (HTTPS, DDoS protection, WAF)
- **Backend**: Render (HTTPS, managed infrastructure)
- **Database**: MongoDB Atlas (encryption, backups)

### ⚠️ 9.9 HTTPS Enforcement
- Vercel provides automatic HTTPS
- **Recommendation**: Add HTTPS redirect in backend

### ✅ 9.10 File Upload Security
- File type validation
- Size limits (5MB)
- Cloudinary handles malware scanning

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- SendGrid account
- Cloudinary account

### Installation

**Backend:**
```bash
cd Backend
npm install
cp .env.example .env  # Configure your .env
npm run dev
```

**Frontend:**
```bash
cd Frontend
npm install
cp .env.example .env  # Configure your .env
npm run dev
```

### Environment Variables

**Backend `.env`:**
```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=gofest
SECRET_KEY=your_jwt_secret_key_min_32_chars
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@gofest.com
```

**Frontend `.env`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

This project is proprietary and confidential.

---

**Last Updated**: December 2024  
**Version**: 1.0.0

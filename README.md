# GoFest.com - College Fest Platform

**Building India's most trusted college fest network**

A comprehensive platform connecting college students with fest organizers across India. Discover, register, and manage college fests with ease.

**🌐 Live URLs:**
- **Frontend**: [https://gofest-com.vercel.app/](https://gofest-com.vercel.app/)
- **Backend API**: [https://gofest-com.onrender.com](https://gofest-com.onrender.com)

---

## Tech Stack Used

### Frontend
- **Next.js 16.0.7** - React framework with SSR
- **React 19.2.1** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4.0** - Utility-first CSS
- **Framer Motion 12.23.24** - Animation library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Leaflet 1.9.4** - Interactive maps
- **React Leaflet 5.0.0** - React wrapper for Leaflet
- **Cloudinary 2.8.0** - Media management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web framework
- **MongoDB 8.0.3** - NoSQL database
- **Mongoose 8.0.3** - MongoDB ODM
- **jsonwebtoken 9.0.2** - JWT authentication
- **bcryptjs 2.4.3** - Password hashing
- **@sendgrid/mail 8.1.6** - Email service
- **dotenv 16.3.1** - Environment variables
- **cors 2.8.5** - CORS middleware

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting

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

## 5. Frontend Guidelines

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

## 6. Backend Guidelines

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

## 7. Optimised React Code Guidelines

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

**Last Updated**: December 2024  
**Version**: 1.0.0

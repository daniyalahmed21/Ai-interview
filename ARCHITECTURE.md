# PrepView - Application Architecture

## Overview
PrepView is an AI-powered interview preparation platform built with Next.js, Express, and Supabase PostgreSQL.

## Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT tokens

## Project Structure

```
project/
├── app/                      # Next.js app directory (pages)
│   ├── page.tsx             # Homepage
│   ├── signup/              # User registration page
│   ├── login/               # User login page
│   ├── cv-creation/         # CV creation page (after signup)
│   ├── dashboard/           # User dashboard
│   └── interview/           # Interview pages
├── components/              # Reusable React components
│   ├── CVForm.tsx           # Reusable CV form component
│   ├── DashboardHome.tsx    # Dashboard home view
│   ├── Hero.tsx             # Landing page hero section
│   └── ...
├── backend/                 # Express server
│   ├── server.js            # Main server entry point
│   ├── services/            # Business logic (Single Responsibility)
│   │   ├── userService.js   # User operations
│   │   ├── cvService.js     # CV operations
│   │   └── authService.js   # Authentication logic
│   ├── routes/              # API endpoints
│   │   ├── auth.js          # Authentication routes
│   │   ├── cv.js            # CV CRUD routes
│   │   └── interview.js     # Interview routes
│   ├── middleware/          # Express middleware
│   │   └── auth.js          # JWT verification
│   └── lib/                 # Utilities
│       └── prisma.js        # Prisma client instance
└── prisma/                  # Database schema and migrations
    └── schema.prisma        # Database schema definition
```

## Application Flow

### User Signup Flow
1. User visits `/signup` and fills registration form
2. Backend validates input and creates user account
3. JWT token is generated and returned
4. User is automatically redirected to `/cv-creation`
5. User creates their CV/resume
6. CV is saved to database
7. User is redirected to `/dashboard`

### User Login Flow
1. User visits `/login` and enters credentials
2. Backend verifies email and password
3. JWT token is generated and returned
4. User is redirected to `/dashboard`

## Backend Architecture (Single Responsibility Principle)

### Services Layer
Each service handles one specific domain:

**userService.js**
- Find user by email
- Find user by ID
- Create new user
- Verify password

**cvService.js**
- Find CV by user ID
- Create CV
- Update CV
- Save CV (upsert)
- Check if user has CV

**authService.js**
- Generate JWT token
- Verify JWT token

### Routes Layer
Routes handle HTTP requests and responses:

**auth.js**
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login existing user

**cv.js**
- `GET /api/cv` - Get user's CV
- `POST /api/cv` - Create/update CV
- `PUT /api/cv` - Upsert CV
- `GET /api/cv/check` - Check if user has CV

### Middleware Layer
**auth.js** - Verifies JWT tokens for protected routes

## Database Schema

### users
- id (TEXT, primary key)
- name (TEXT)
- email (TEXT, unique)
- password (TEXT, hashed)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### cvs
- id (TEXT, primary key)
- user_id (TEXT, unique, foreign key)
- personal_info (JSONB) - Name, email, phone, links
- summary (TEXT) - Professional summary
- skills (JSONB) - Array of skills
- projects (JSONB) - Array of projects
- education (JSONB) - Array of education entries
- experience (JSONB) - Array of work experience
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### interview_sessions
- id (TEXT, primary key)
- session_id (TEXT) - Groups questions in one interview
- user_id (TEXT, foreign key)
- field_id (TEXT) - Interview category
- question_id (INTEGER)
- video_path (TEXT)
- video_filename (TEXT)
- created_at (TIMESTAMPTZ)

## Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt
- All API routes (except auth) require authentication

## Running the Application

### Prerequisites
- Node.js 18+
- PostgreSQL (Supabase)

### Setup
1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Run Prisma migrations: `npx prisma generate`
4. Start backend server: `npm run server`
5. Start frontend: `npm run dev`

### Build
```bash
npm run build
```

## Key Features
- User authentication with JWT
- CV/Resume builder with live preview
- Interview practice sessions
- User dashboard with analytics
- Responsive design

## Code Quality
- Clean, commented code for junior developers
- Single Responsibility Principle in services
- Type safety with TypeScript
- Reusable components
- Clear naming conventions

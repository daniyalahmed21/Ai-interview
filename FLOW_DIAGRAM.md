# PrepView - Application Flow Diagrams

## User Signup Flow

```
┌──────────────┐
│   Browser    │
│  /signup     │
└──────┬───────┘
       │
       │ User fills form:
       │ - Name
       │ - Email
       │ - Password
       │
       ▼
┌──────────────────────────────────────┐
│  Frontend (signup/page.tsx)          │
│  1. Validate passwords match         │
│  2. Check password length >= 6       │
└──────────────┬───────────────────────┘
               │
               │ POST /api/auth/signup
               │ { name, email, password }
               ▼
┌──────────────────────────────────────┐
│  Backend (routes/auth.js)            │
│  1. Validate input with Zod          │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  userService.findUserByEmail()       │
│  Check if email already exists       │
└──────────────┬───────────────────────┘
               │
               │ User doesn't exist? ✓
               ▼
┌──────────────────────────────────────┐
│  userService.createUser()            │
│  1. Hash password with bcrypt        │
│  2. Save user to database            │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  authService.generateToken()         │
│  Create JWT token with user info     │
└──────────────┬───────────────────────┘
               │
               │ Return: { token, user, needsCV: true }
               ▼
┌──────────────────────────────────────┐
│  Frontend                            │
│  1. Store token in localStorage      │
│  2. Store user in localStorage       │
│  3. Redirect to /cv-creation         │
└──────────────────────────────────────┘
```

## CV Creation Flow

```
┌──────────────┐
│   Browser    │
│ /cv-creation │
└──────┬───────┘
       │
       │ Check authentication
       ▼
┌──────────────────────────────────────┐
│  Frontend (cv-creation/page.tsx)     │
│  1. Check if token exists            │
│  2. Show CVForm component            │
└──────────────┬───────────────────────┘
               │
               │ User fills CV form:
               │ - Personal info
               │ - Experience
               │ - Education
               │ - Skills
               │
               │ User clicks "Save"
               ▼
┌──────────────────────────────────────┐
│  CVForm Component                    │
│  1. Collect all form data            │
│  2. Call onSave() function           │
└──────────────┬───────────────────────┘
               │
               │ POST /api/cv
               │ Authorization: Bearer <token>
               │ { personalInfo, summary, skills, ... }
               ▼
┌──────────────────────────────────────┐
│  Backend (routes/cv.js)              │
│  1. authMiddleware checks token      │
│  2. Extract userId from token        │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  cvService.findCVByUserId()          │
│  Check if user already has a CV      │
└──────────────┬───────────────────────┘
               │
               │ CV exists?
               ├─ Yes ──▶ cvService.updateCV()
               │
               └─ No ───▶ cvService.createCV()
                          │
                          ▼
┌──────────────────────────────────────┐
│  Database (Supabase PostgreSQL)      │
│  Save CV data in 'cvs' table         │
└──────────────┬───────────────────────┘
               │
               │ Return: { message, cv }
               ▼
┌──────────────────────────────────────┐
│  Frontend                            │
│  1. Show success message             │
│  2. Redirect to /dashboard           │
└──────────────────────────────────────┘
```

## Login Flow

```
┌──────────────┐
│   Browser    │
│   /login     │
└──────┬───────┘
       │
       │ User enters:
       │ - Email
       │ - Password
       │
       ▼
┌──────────────────────────────────────┐
│  Frontend (login/page.tsx)           │
│  Submit login form                   │
└──────────────┬───────────────────────┘
               │
               │ POST /api/auth/login
               │ { email, password }
               ▼
┌──────────────────────────────────────┐
│  Backend (routes/auth.js)            │
│  1. Validate input with Zod          │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  userService.findUserByEmail()       │
│  Find user in database               │
└──────────────┬───────────────────────┘
               │
               │ User found? ✓
               ▼
┌──────────────────────────────────────┐
│  userService.verifyPassword()        │
│  Compare password with hashed one    │
└──────────────┬───────────────────────┘
               │
               │ Password correct? ✓
               ▼
┌──────────────────────────────────────┐
│  authService.generateToken()         │
│  Create new JWT token                │
└──────────────┬───────────────────────┘
               │
               │ Return: { token, user }
               ▼
┌──────────────────────────────────────┐
│  Frontend                            │
│  1. Store token in localStorage      │
│  2. Store user in localStorage       │
│  3. Redirect to /dashboard           │
└──────────────────────────────────────┘
```

## Backend Architecture

```
┌─────────────────────────────────────────────────┐
│                   CLIENT REQUEST                │
│         (Browser sends HTTP request)            │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│                ROUTES LAYER                     │
│  (/backend/routes)                              │
│                                                 │
│  • auth.js      - /api/auth/*                   │
│  • cv.js        - /api/cv/*                     │
│  • interview.js - /api/interview/*              │
│                                                 │
│  Responsibilities:                              │
│  - Receive HTTP requests                        │
│  - Validate input data                          │
│  - Call services                                │
│  - Send responses                               │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│               MIDDLEWARE LAYER                  │
│  (/backend/middleware)                          │
│                                                 │
│  • auth.js - Verify JWT tokens                  │
│                                                 │
│  Responsibilities:                              │
│  - Check authentication                         │
│  - Extract user info from token                 │
│  - Add userId to request                        │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│               SERVICES LAYER                    │
│  (/backend/services)                            │
│                                                 │
│  • userService.js   - User operations           │
│  • cvService.js     - CV operations             │
│  • authService.js   - Auth operations           │
│                                                 │
│  Responsibilities:                              │
│  - Business logic                               │
│  - Database operations                          │
│  - Data transformations                         │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│               DATABASE LAYER                    │
│  (Supabase PostgreSQL via Prisma)               │
│                                                 │
│  Tables:                                        │
│  • users                                        │
│  • cvs                                          │
│  • interview_sessions                           │
│                                                 │
│  Features:                                      │
│  - Row Level Security (RLS)                     │
│  - Automatic timestamps                         │
│  - Foreign key constraints                      │
└─────────────────────────────────────────────────┘
```

## Data Flow Example: Creating a CV

```
User fills CV form ──▶ Frontend validates ──▶ POST request
                                                    │
                                                    ▼
                                        Backend receives request
                                                    │
                                                    ▼
                                        Auth middleware checks token
                                                    │
                                                    ▼
                                        Routes layer receives data
                                                    │
                                                    ▼
                                        Calls cvService.createCV()
                                                    │
                                                    ▼
                                        Service talks to database
                                                    │
                                                    ▼
                                        Prisma inserts CV record
                                                    │
                                                    ▼
                                        Database returns saved CV
                                                    │
                                                    ▼
                                        Service returns to route
                                                    │
                                                    ▼
                                        Route sends response
                                                    │
                                                    ▼
                                        Frontend receives success
                                                    │
                                                    ▼
                                        Redirect to dashboard
```

## Key Design Principles

### Single Responsibility Principle (SRP)
```
❌ BAD: One file does everything
routes/api.js (1000 lines)
├── User authentication
├── CV operations
├── Interview logic
└── Payment processing

✅ GOOD: Separate files for separate concerns
routes/
├── auth.js        (Only authentication)
├── cv.js          (Only CV operations)
├── interview.js   (Only interview logic)
└── payment.js     (Only payment processing)
```

### Layered Architecture Benefits

1. **Easy to Find**: Know exactly where to look for code
2. **Easy to Test**: Test each layer independently
3. **Easy to Change**: Modify one layer without affecting others
4. **Easy to Understand**: Clear separation of concerns

### Authentication Pattern

```
Every protected route follows this pattern:

1. Client sends: Authorization: Bearer <token>
2. Middleware extracts token
3. Middleware verifies token
4. Middleware adds userId to request
5. Route handler uses req.userId
6. Service performs operation for that user
7. Database enforces user can only access their data (RLS)
```

This multi-layered security ensures users can only access their own data!

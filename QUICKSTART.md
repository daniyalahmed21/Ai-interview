# PrepView - Quick Start Guide

## For Junior Developers

This guide will help you understand and run the PrepView application.

## What is PrepView?

PrepView is an interview preparation platform where users can:
1. Create an account
2. Build their CV/resume
3. Practice mock interviews
4. Track their performance

## How to Run the Application

### Step 1: Install Dependencies
```bash
npm install
```
This downloads all the packages the app needs to run.

### Step 2: Start the Backend Server
```bash
npm run server
```
This starts the API server on `http://localhost:5000`
- The backend handles user authentication, CV storage, and interview data
- Keep this terminal window running

### Step 3: Start the Frontend (in a new terminal)
```bash
npm run dev
```
This starts the Next.js app on `http://localhost:3000`
- The frontend is what users see and interact with
- Keep this terminal window running too

### Step 4: Open the App
Open your browser and go to: `http://localhost:3000`

## User Flow (How it Works)

### 1. New User Signs Up
- User goes to `/signup`
- Fills in name, email, and password
- Clicks "Create Account"
- **Backend**: Creates user in database with hashed password
- **Backend**: Generates JWT token for authentication
- **Frontend**: Stores token in browser localStorage
- **Frontend**: Redirects user to `/cv-creation`

### 2. User Creates CV
- User fills in their information:
  - Personal info (name, email, phone)
  - Work experience
  - Education
  - Skills
- Live preview shows on the right side
- Clicks "Save & Continue to Dashboard"
- **Backend**: Saves CV data to database
- **Frontend**: Redirects to `/dashboard`

### 3. User Logs In (Next Time)
- User goes to `/login`
- Enters email and password
- **Backend**: Verifies credentials
- **Backend**: Generates new JWT token
- **Frontend**: Stores token and redirects to `/dashboard`

## Understanding the Code

### Frontend (React/Next.js)
**Location**: `/app` and `/components` folders

- **Pages** (in `/app`): Each folder is a route
  - `/app/page.tsx` = Homepage (`/`)
  - `/app/signup/page.tsx` = Signup page (`/signup`)
  - `/app/cv-creation/page.tsx` = CV creation page (`/cv-creation`)

- **Components** (in `/components`): Reusable UI pieces
  - `CVForm.tsx` = The CV form (used in cv-creation page)
  - `Hero.tsx` = Hero section on homepage
  - `Navbar.tsx` = Navigation bar

### Backend (Express.js)
**Location**: `/backend` folder

The backend is organized into layers:

#### 1. Services (Business Logic)
**Location**: `/backend/services`

Think of services as "workers" that do specific jobs:

- `userService.js` - Everything about users
  - Creating users
  - Finding users
  - Verifying passwords

- `cvService.js` - Everything about CVs
  - Creating CVs
  - Updating CVs
  - Finding CVs

- `authService.js` - Everything about authentication
  - Creating tokens
  - Verifying tokens

**Why separate services?**
- Each file has one clear purpose (Single Responsibility Principle)
- Easy to find where things happen
- Easy to test
- Easy to modify without breaking other things

#### 2. Routes (API Endpoints)
**Location**: `/backend/routes`

Routes handle incoming HTTP requests:

- `auth.js` - Authentication endpoints
  - `POST /api/auth/signup` - Create account
  - `POST /api/auth/login` - Login

- `cv.js` - CV endpoints
  - `GET /api/cv` - Get user's CV
  - `POST /api/cv` - Save CV
  - `PUT /api/cv` - Update CV

**How routes work:**
1. Receive request from frontend
2. Validate the data
3. Call the appropriate service
4. Send response back to frontend

#### 3. Middleware
**Location**: `/backend/middleware`

- `auth.js` - Checks if user is logged in
  - Extracts JWT token from request
  - Verifies token is valid
  - Adds user ID to request
  - If invalid, returns error

### Database (PostgreSQL with Prisma)
**Location**: `/prisma` folder

- `schema.prisma` - Defines database structure
  - What tables exist
  - What columns each table has
  - Relationships between tables

**Tables:**
- `users` - User accounts
- `cvs` - User resumes
- `interview_sessions` - Interview practice records

## Common Tasks

### Add a New API Endpoint

1. **Create service function** (if needed)
```javascript
// backend/services/userService.js
async function getUserProfile(userId) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true }
  });
}
```

2. **Add route handler**
```javascript
// backend/routes/user.js
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await userService.getUserProfile(req.userId);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});
```

3. **Use in frontend**
```javascript
const response = await fetch('http://localhost:5000/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const profile = await response.json();
```

### Add a New Page

1. **Create page file**
```typescript
// app/profile/page.tsx
export default function ProfilePage() {
  return <div>Profile Page</div>;
}
```

2. **Access at**: `http://localhost:3000/profile`

## Important Concepts

### JWT Tokens
- Like a "ticket" that proves you're logged in
- Created when you signup/login
- Sent with every API request
- Stored in browser localStorage

### Authentication Flow
1. User logs in
2. Backend creates JWT token
3. Frontend stores token
4. Frontend sends token with every request
5. Backend verifies token before processing request

### Single Responsibility Principle
Each file/function should do ONE thing:
- ✅ Good: `userService.js` only handles user operations
- ❌ Bad: One file that handles users, CVs, and interviews

### Why This Matters
- Easier to understand
- Easier to debug
- Easier to add features
- Less likely to break things

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Make sure `.env` file exists with database URL

### Frontend won't connect to backend
- Make sure backend is running on port 5000
- Check browser console for errors

### Database errors
- Run `npx prisma generate` to regenerate Prisma client
- Check if database URL in `.env` is correct

## Learning Resources

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/learn
- **Express.js**: https://expressjs.com/
- **Prisma**: https://www.prisma.io/docs

## Need Help?

Check the main documentation in `ARCHITECTURE.md` for more detailed information about the app structure.

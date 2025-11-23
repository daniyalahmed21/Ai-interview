# PrepView - AI Interview Simulator

## ✅ Project Status

The project is now fully functional and running with:
- **Backend**: Express.js + Prisma + SQLite (running on port 5000)
- **Frontend**: Next.js 14 (running on port 3000)
- **Database**: SQLite with migrations

## Quick Start

### Prerequisites
- Node.js v18+
- npm

### Backend Setup & Run

```bash
cd backend
npm install
npx prisma migrate reset --force   # Initialize database
npm run dev
```

Backend runs on: **http://localhost:5000**

### Frontend Setup & Run

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:3000**

### Running Both (Recommended)

**Terminal 1:**
```bash
cd backend
npm run dev
# Initializes Prisma with database if needed: npx prisma migrate reset --force
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

Then visit: **http://localhost:3000**

## Project Structure

```
Ai-interview/
├── backend/                  # Express.js API Server
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Migration history
│   ├── routes/              # API endpoints
│   │   ├── auth.js          # Auth endpoints
│   │   ├── cv.js            # CV endpoints
│   │   └── interview.js     # Interview endpoints
│   ├── services/            # Business logic
│   │   ├── userService.js
│   │   ├── cvService.js
│   │   └── authService.js
│   ├── middleware/          # Custom middleware
│   │   └── auth.js          # JWT verification
│   ├── lib/
│   │   └── prisma.js        # Prisma client setup
│   ├── .env                 # Environment variables
│   ├── server.js            # Express setup
│   └── package.json
│
└── frontend/                # Next.js Web Application
    ├── app/                 # Next.js pages
    │   ├── page.tsx         # Homepage
    │   ├── signup/page.tsx  # Signup page
    │   ├── login/page.tsx   # Login page
    │   ├── cv-creation/     # CV creation
    │   ├── dashboard/       # Main dashboard
    │   └── interview/       # Interview practice
    ├── components/          # React components
    ├── .env                 # Environment variables
    └── package.json
```

## Database

- **Type**: SQLite
- **Location**: `backend/dev.db`
- **ORM**: Prisma 7

### Database Commands

**Reset Database (development only):**
```bash
cd backend
npx prisma migrate reset --force
```

**View Database:**
```bash
cd backend
npx prisma studio
```

**Create New Migration:**
```bash
cd backend
npx prisma migrate dev --name migration_name
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### CV Management
- `GET /api/cv` - Get user's CV
- `POST /api/cv` - Create/update CV
- `PUT /api/cv` - Upsert CV
- `GET /api/cv/check` - Check if CV exists

### Interview
- `POST /api/interview/upload` - Upload interview video
- `GET /api/interview/sessions/:userId` - Get interview sessions

### Health Check
- `GET /api/health` - Server health check

## Environment Variables

### Backend (`.env`)
```properties
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=5000
```

### Frontend (`.env`)
```properties
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Architecture

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **State Management**: localStorage for auth
- **HTTP Client**: Fetch API
- **Language**: TypeScript

### Backend
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens
- **Password Hashing**: bcryptjs
- **File Uploads**: Multer
- **Validation**: Zod
- **Language**: JavaScript/Node.js

## User Flow

### 1. Signup
- User navigates to `/signup`
- Fills in name, email, password
- Backend creates user with hashed password
- JWT token is generated and returned
- User is redirected to `/cv-creation`

### 2. CV Creation
- User fills in personal info, education, experience, skills
- Live preview on the right
- User clicks "Save & Continue"
- Backend stores CV in database
- User is redirected to `/dashboard`

### 3. Dashboard
- User can see their CV
- Practice mock interviews
- View performance metrics
- Select interview fields

### 4. Interview Practice
- User selects interview field
- AI generates questions
- User practices with video/audio recording
- Responses are stored

## Known Issues & Fixes

### Database not syncing
If you see "The table `main.User` does not exist":
```bash
cd backend
npx prisma migrate reset --force
```

### PORT already in use
Kill existing process:
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Environment variables not loading
Ensure `.env` files exist in both `backend/` and `frontend/` directories.

### Frontend can't connect to backend
1. Verify backend is running on port 5000
2. Check `NEXT_PUBLIC_API_URL` in frontend `.env`
3. Check browser console for CORS errors
4. Ensure `backend/server.js` has `app.use(cors())`

## Development Workflow

1. **Make backend changes** → Restart backend server
2. **Make frontend changes** → Next.js auto-reloads
3. **Update database schema** → Update `backend/prisma/schema.prisma`, run `npx prisma migrate dev`
4. **Test API** → Use browser network tab or Postman

## Testing

### Test Signup (Backend)
```bash
cd backend
node test-signup.js
```

### Test API Health
```bash
curl http://localhost:5000/api/health
```

## Production Deployment

Before deploying:
1. Change `JWT_SECRET` to a strong random value
2. Set `DATABASE_URL` to production database
3. Build frontend: `npm run build`
4. Set `NEXT_PUBLIC_API_URL` to production backend URL
5. Use production-grade database (PostgreSQL recommended)
6. Add SSL/HTTPS
7. Set up CI/CD pipeline

## License

ISC


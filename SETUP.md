# Setup Guide for PrepView

## Step-by-Step Setup Instructions

### 1. Install Node.js
Make sure you have Node.js 18+ installed. You can download it from [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Neon Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string (it will look like: `postgresql://user:password@host/database?sslmode=require`)

### 4. Configure Environment Variables

Create a `.env` file in the root directory:
```env
DATABASE_URL="your-neon-connection-string-here"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

Create a `backend/.env` file:
```env
DATABASE_URL="your-neon-connection-string-here"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
```

### 5. Set Up Database Schema

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init
```

### 6. Start the Application

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend will run on http://localhost:3000

**Terminal 2 - Backend:**
```bash
npm run server
```
Backend will run on http://localhost:5000

### 7. Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

## Troubleshooting

### Database Connection Issues
- Make sure your Neon database is running
- Verify your DATABASE_URL is correct
- Check if SSL mode is required (add `?sslmode=require` to connection string)

### Port Already in Use
- Change the PORT in `backend/.env` if 5000 is taken
- Change Next.js port: `npm run dev -- -p 3001`

### Prisma Issues
- Run `npx prisma generate` again
- Check if DATABASE_URL is set correctly
- Try `npx prisma migrate reset` (WARNING: This deletes all data)

### Video Upload Issues
- Make sure `backend/uploads` directory exists
- Check file permissions
- Verify multer configuration

## Production Deployment

1. Set environment variables in your hosting platform
2. Run `npx prisma migrate deploy` for production migrations
3. Build frontend: `npm run build`
4. Start production server: `npm start`

## Features to Test

1. ✅ Sign up a new account
2. ✅ Create your CV
3. ✅ Browse interview fields
4. ✅ Start an interview (requires camera/mic permissions)
5. ✅ Record and upload video responses
6. ✅ View performance analytics

## Notes

- The application uses JWT tokens stored in localStorage
- Video files are saved in `backend/uploads/`
- Make sure to allow camera and microphone permissions in your browser
- The Monaco editor requires a modern browser


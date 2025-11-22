# PrepView - AI Interview Simulator

A production-ready AI interview simulator application built with Next.js, Node.js, Express, and Prisma.

## Features

- 🏠 **Beautiful Homepage** with smooth scrolling sections
- 🔐 **Authentication** (Login/Signup) with JWT
- 📄 **CV Builder** with live preview
- 📊 **Dashboard** with multiple sections
- 💻 **AI Interview Simulator** with:
  - Real-time coding in Monaco Editor
  - Video recording per question
  - Multiple IT/CS interview fields
- 📈 **Performance Analytics**

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Monaco Editor
- React Hooks

### Backend
- Node.js
- Express.js
- Prisma ORM
- Neon (PostgreSQL)
- JWT Authentication
- Multer (File Upload)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Neon PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   cd "ai interview simulator"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your-neon-postgresql-connection-string"
   JWT_SECRET="your-super-secret-jwt-key"
   ```

   Create a `backend/.env` file:
   ```env
   DATABASE_URL="your-neon-postgresql-connection-string"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
   ```

4. **Set up Prisma**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Run the development server**

   Frontend (Terminal 1):
   ```bash
   npm run dev
   ```

   Backend (Terminal 2):
   ```bash
   npm run server
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── cv-creation/       # CV builder page
│   ├── dashboard/         # Dashboard page
│   └── interview/         # Interview pages
├── components/             # React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── Reviews.tsx
│   └── ...
├── backend/               # Express backend
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cv.js
│   │   └── interview.js
│   └── uploads/           # Video uploads directory
├── prisma/
│   └── schema.prisma      # Database schema
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### CV
- `GET /api/cv` - Get user's CV
- `POST /api/cv` - Create CV
- `PUT /api/cv` - Update CV

### Interview
- `POST /api/interview/upload` - Upload interview video
- `GET /api/interview/sessions` - Get user's interview sessions

## Database Schema

- **User**: User accounts
- **CV**: User resumes
- **InterviewSession**: Interview recordings

## Features in Detail

### Homepage
- Responsive navbar with smooth scrolling
- Hero section
- Features showcase
- How it works section
- Reviews/testimonials

### CV Builder
- Split-screen interface
- Real-time preview
- Multiple sections (Personal Info, Experience, Education, Skills)

### Interview Interface
- AI simulator visualization
- Monaco code editor
- Camera recording
- Question-by-question video uploads
- Multiple IT/CS fields (Data Science, Software Engineering, etc.)

## Production Deployment

1. Set up environment variables in your hosting platform
2. Run database migrations: `npx prisma migrate deploy`
3. Build the frontend: `npm run build`
4. Start the production server: `npm start`

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.


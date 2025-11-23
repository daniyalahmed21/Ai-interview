# PrepView - AI Interview Simulator

A production-ready AI interview simulator application built with Next.js, Node.js, Express, and Prisma.

## Features

- 🏠 **Beautiful Homepage** with smooth scrolling sections
- 🔐 **Authentication** (Login/Signup) with JWT
- 📄 **Enhanced CV Builder** with:
  - Live preview
  - **Projects section** with tech stack badges
  - **Optional work experience** (perfect for students)
  - Optional fields (phone, location, social links)
  - Real-time form validation
  - Add/remove functionality for all sections
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
   cd prepview
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   npm run install:all
   ```

   Or install separately:
   ```bash
   # Frontend
   cd frontend
   npm install --production=false

   # Backend
   cd ../backend
   npm install
   ```

3. **Set up environment variables**

   Create a `frontend/.env` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   Create a `backend/.env` file:
   ```env
   DATABASE_URL="your-database-connection-string"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
   ```

4. **Run the development server**

   From the root directory:
   ```bash
   npm run dev
   ```

   Or run separately:

   Frontend (Terminal 1):
   ```bash
   npm run dev:frontend
   ```

   Backend (Terminal 2):
   ```bash
   npm run dev:backend
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
prepview/
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js app directory
│   │   ├── page.tsx      # Homepage
│   │   ├── login/        # Login page
│   │   ├── signup/       # Signup page
│   │   ├── cv-creation/  # CV builder page
│   │   ├── dashboard/    # Dashboard page
│   │   └── interview/    # Interview pages
│   ├── components/       # React components
│   │   ├── CVForm.tsx    # Enhanced CV form with projects
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── InterviewInterface.tsx
│   │   └── ...
│   ├── prisma/           # Database schema
│   ├── supabase/         # Supabase migrations
│   ├── package.json
│   └── next.config.js
│
├── backend/              # Express.js backend API
│   ├── server.js         # Main server file
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication endpoints
│   │   ├── cv.js         # CV endpoints
│   │   └── interview.js  # Interview endpoints
│   ├── services/         # Business logic
│   ├── middleware/       # Auth middleware
│   ├── lib/             # Database client
│   ├── package.json
│   └── .env
│
└── package.json          # Root package.json for monorepo scripts
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
- Split-screen interface with real-time preview
- **Projects Section** - Showcase personal and academic projects with:
  - Project title and role
  - Tech stack (displayed as badges)
  - Detailed project description
  - Add/remove functionality
- **Optional Work Experience** - Perfect for students without work history
- **Flexible Fields** - Optional phone, location, LinkedIn, and GitHub
- Professional Summary (optional)
- Education with Final Year Project field
- Skills with dynamic addition

### Interview Interface
- AI simulator visualization
- Monaco code editor
- Camera recording
- Question-by-question video uploads
- Multiple IT/CS fields (Data Science, Software Engineering, etc.)

## Recent Updates

### Version 2.0 - Enhanced CV Builder & Monorepo Structure

**🎨 CV Builder Improvements:**
- ✨ Added Projects section for showcasing personal and academic projects
- 🔧 Made work experience optional (perfect for students and early-career professionals)
- 📝 Optional fields for phone, location, LinkedIn, and GitHub URLs
- 🎯 Tech stack badges in project display
- ➕ Add/remove functionality for both projects and experience entries
- 👁️ Real-time preview with improved UI

**🏗️ Project Structure:**
- 📁 Reorganized into monorepo structure with separate `frontend/` and `backend/` directories
- 📦 Independent package management for frontend and backend
- 🚀 Improved development workflow with unified scripts
- 🔄 Better separation of concerns

**🛠️ Developer Experience:**
- 💻 Added root-level scripts for easy development (`npm run dev`, `npm run install:all`)
- 📝 Updated documentation with clear installation instructions
- ⚡ Webpack path alias configuration for cleaner imports
- 🔍 Enhanced TypeScript configuration
- 🐛 Fixed NODE_ENV production build issues

## Production Deployment

1. Set up environment variables in your hosting platform
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Build the frontend:
   ```bash
   npm run build
   ```
4. Start both services:
   ```bash
   npm run start
   ```

### Deploying Separately

**Frontend (Vercel/Netlify):**
- Deploy the `frontend/` directory
- Set environment variables: `NEXT_PUBLIC_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Build command: `npm run build`
- Output directory: `.next`

**Backend (Heroku/Railway/Render):**
- Deploy the `backend/` directory
- Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`
- Start command: `node server.js`

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.


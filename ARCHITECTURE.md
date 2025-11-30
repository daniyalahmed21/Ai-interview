# PrepView - AI Interview Platform Architecture

## Overview
PrepView is an AI-powered interview preparation platform with real-time voice interaction, live coding environment, and automated evaluation. Built with Next.js, Express, Socket.IO, and Prisma.

## Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Monaco Editor, xterm.js
- **Backend**: Express.js, Node.js, TypeScript
- **Real-time**: Socket.IO (WebSockets)
- **Database**: SQLite (Dev) / PostgreSQL (Prod)
- **ORM**: Prisma
- **Authentication**: JWT tokens
- **AI Services**: Mock (Dev) → OpenAI/Google (Prod)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Monaco  │  │ Terminal │  │  Audio   │  │ Socket   │   │
│  │  Editor  │  │ (xterm)  │  │ Capture  │  │  Client  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │ WebSocket + HTTP
┌─────────────────────────┴───────────────────────────────────┐
│                    Backend (Express + Socket.IO)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Socket.IO Server                        │   │
│  │  • Audio streaming    • Code sync                    │   │
│  │  • Terminal I/O       • Room management              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Speech     │  │     Code     │  │  Evaluation  │     │
│  │   Service    │  │  Execution   │  │   Service    │     │
│  │  (STT/TTS)   │  │   Service    │  │   (AI)       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Prisma ORM                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────────────┐
│                    Database (SQLite/PostgreSQL)              │
│  • Users              • Transcripts                          │
│  • CVs                • CodeSnapshots                        │
│  • InterviewSessions  • Evaluations                          │
└──────────────────────────────────────────────────────────────┘
```

## Project Structure

```
prepview/
├── frontend/                    # Next.js app
│   ├── app/                    # App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── login/             # Auth pages
│   │   ├── signup/
│   │   ├── cv-creation/       # CV builder
│   │   ├── dashboard/         # User dashboard
│   │   └── interview/         # Interview interface
│   │       ├── [id]/          # Active interview
│   │       └── [id]/report/   # Post-interview report
│   ├── components/            # React components
│   │   ├── Terminal.tsx       # xterm.js terminal
│   │   ├── CVForm.tsx         # CV form
│   │   ├── InterviewInterface.tsx
│   │   └── ...
│   └── lib/
│       └── socket.ts          # Socket.IO client
│
├── backend/                   # Express server
│   ├── src/
│   │   ├── server.ts         # Main entry + Socket.IO
│   │   ├── services/         # Business logic
│   │   │   ├── socketService.ts      # WebSocket handling
│   │   │   ├── speechService.ts      # STT/TTS (mock)
│   │   │   ├── codeExecutionService.ts # Code runner
│   │   │   └── evaluationService.ts   # AI evaluation
│   │   ├── routes/           # REST API
│   │   │   ├── auth.ts       # Authentication
│   │   │   ├── cv.ts         # CV CRUD
│   │   │   └── interview.ts  # Interview endpoints
│   │   ├── middleware/
│   │   │   └── auth.ts       # JWT verification
│   │   └── lib/
│   │       └── prisma.ts     # Prisma client
│   └── prisma/
│       └── schema.prisma     # Database schema
│
├── docker-compose.yml        # Container orchestration
└── Dockerfiles              # Container definitions
```

## Application Flow

### 1. User Signup Flow
1. User visits `/signup` and fills registration form
2. Backend validates input and creates user account
3. JWT token is generated and returned
4. User is redirected to `/cv-creation`
5. User creates their CV/resume
6. CV is saved to database
7. User is redirected to `/dashboard`

### 2. User Login Flow
1. User visits `/login` and enters credentials
2. Backend verifies email and password
3. JWT token is generated and returned
4. User is redirected to `/dashboard`

### 3. Interview Flow (NEW)

#### Pre-Interview
1. User selects role, difficulty, language from lobby
2. Frontend creates session via `POST /api/interview/start`
3. Backend creates `InterviewSession` record
4. User is redirected to `/interview/[sessionId]`

#### During Interview
1. **Connection**
   - Frontend connects to Socket.IO
   - Joins room with `sessionId`

2. **Voice Interaction**
   - User speaks → Audio captured via Web Audio API
   - Audio streamed to server via `audio-stream` event
   - Backend calls `speechService.transcribeAudio()`
   - Transcript saved to `Transcript` table
   - Broadcast to client for live display

3. **AI Questions**
   - Backend generates question text
   - Calls `speechService.generateSpeech()`
   - Audio URL sent to client
   - Client plays via `<audio>` element

4. **Live Coding**
   - User types in Monaco Editor
   - Code synced via `code-update` event
   - Saved to `CodeSnapshot` every 10 seconds
   - User runs code via terminal
   - Backend executes via `codeExecutionService`
   - Output streamed back to terminal

#### Post-Interview
1. User clicks "End Interview"
2. Frontend calls `POST /api/interview/end`
3. Backend:
   - Fetches all transcripts and code snapshots
   - Calls `evaluationService.evaluateSession()`
   - Saves `Evaluation` to database
4. User redirected to `/interview/[id]/report`
5. Report displays:
   - Overall score
   - 7 metric scores
   - Strengths/weaknesses/suggestions
   - Full transcript
   - Code snapshots
   - Terminal output replay

## Backend Architecture

### Services Layer (Single Responsibility)

#### **socketService.ts**
- Initialize Socket.IO server
- Handle WebSocket events:
  - `join-room` - Session management
  - `audio-stream` - Voice data
  - `code-update` - Code synchronization
  - `terminal-input` - Command execution

#### **speechService.ts**
- `transcribeAudio(audioChunk)` - STT
  - **Dev**: Mock responses
  - **Prod**: OpenAI Whisper API
- `generateSpeech(text)` - TTS
  - **Dev**: Mock audio URL
  - **Prod**: ElevenLabs/Google TTS

#### **codeExecutionService.ts**
- `executeCode(language, code)` - Run code safely
  - **Dev**: Child process with timeout
  - **Prod**: Docker container with resource limits
- Supports: JavaScript, Python (extensible)

#### **evaluationService.ts**
- `evaluateSession(sessionId)` - Generate feedback
  - **Dev**: Mock scores (7 metrics)
  - **Prod**: GPT-4 analysis
- Returns:
  - Scores (clarity, understanding, correctness, etc.)
  - Feedback (strengths, weaknesses, suggestions)
  - Overall score

### Routes Layer

#### **auth.ts**
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login user

#### **cv.ts**
- `GET /api/cv` - Get user's CV
- `POST /api/cv` - Create/update CV
- `PUT /api/cv` - Upsert CV
- `GET /api/cv/check` - Check if CV exists

#### **interview.ts** (NEW)
- `POST /api/interview/start` - Create session
- `POST /api/interview/end` - Trigger evaluation
- `GET /api/interview/:id` - Get session details
- `GET /api/interview/:id/report` - Get evaluation
- `GET /api/interview/sessions` - List user sessions

### Middleware Layer
- **auth.ts** - JWT verification for protected routes

## Database Schema

### Existing Models

#### **User**
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  cv                CV?
  interviewSessions InterviewSession[]
}
```

#### **CV**
```prisma
model CV {
  id           String   @id @default(cuid())
  userId       String   @unique
  personalInfo Json     // Name, email, phone, links
  summary      String?
  skills       Json     // Array of skills
  projects     Json     // Array of projects
  education    Json     // Array of education
  experience   Json     // Array of work experience
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id])
}
```

### New AI Platform Models

#### **InterviewSession**
```prisma
model InterviewSession {
  id            String   @id @default(cuid())
  sessionId     String   // Groups questions in one interview
  userId        String
  fieldId       String   // Interview category (e.g., "software-eng")
  questionId    Int
  videoPath     String?
  videoFilename String?
  status        String   @default("in_progress") // in_progress, completed, abandoned
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user          User           @relation(fields: [userId], references: [id])
  transcripts   Transcript[]
  codeSnapshots CodeSnapshot[]
  evaluation    Evaluation?
  
  @@index([userId])
  @@index([fieldId])
  @@index([sessionId])
}
```

#### **Transcript**
```prisma
model Transcript {
  id                 String           @id @default(cuid())
  interviewSessionId String
  speaker            String           // "candidate" or "ai"
  text               String
  timestamp          DateTime         @default(now())
  
  interviewSession InterviewSession @relation(fields: [interviewSessionId], references: [id])
  
  @@index([interviewSessionId])
}
```

#### **CodeSnapshot**
```prisma
model CodeSnapshot {
  id                 String           @id @default(cuid())
  interviewSessionId String
  code               String
  language           String
  timestamp          DateTime         @default(now())
  
  interviewSession InterviewSession @relation(fields: [interviewSessionId], references: [id])
  
  @@index([interviewSessionId])
}
```

#### **Evaluation**
```prisma
model Evaluation {
  id                 String           @id @default(cuid())
  interviewSessionId String           @unique
  scores             Json             // { clarity, understanding, correctness, ... }
  feedback           Json             // { strengths, weaknesses, suggestions }
  overallScore       Int
  createdAt          DateTime         @default(now())
  
  interviewSession InterviewSession @relation(fields: [interviewSessionId], references: [id])
}
```

## Real-Time Communication

### WebSocket Events

#### Client → Server
- `join-room(roomId)` - Join interview session
- `audio-stream(audioData)` - Send audio chunk
- `code-update(codeData)` - Sync code changes
- `terminal-input(command)` - Execute command

#### Server → Client
- `transcript-update(transcript)` - New transcription
- `code-update(codeData)` - Code from other participant
- `terminal-output(output)` - Command result
- `ai-question(question)` - New question from AI

## Security

### Authentication
- JWT tokens with 7-day expiration
- Passwords hashed with bcrypt
- HTTP-only cookies (optional)

### Authorization
- Row Level Security (RLS) on database
- Users can only access their own data
- JWT verification middleware on protected routes

### Code Execution
- **Dev**: Process timeout (5s), memory limits
- **Prod**: Docker sandbox with:
  - CPU limits
  - Memory limits
  - Network isolation
  - Filesystem restrictions

### WebSocket Security
- JWT verification on connection
- Room-based isolation
- Rate limiting on events

## Deployment

### Development
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Docker
```bash
docker-compose up
```

### Production
- Frontend: Vercel/Netlify
- Backend: Railway/Render/Heroku
- Database: Neon/Supabase PostgreSQL
- File Storage: S3/Cloudinary (for recordings)

## Testing

### Backend Tests
```bash
cd backend
npm test
```

**Coverage:**
- Socket.IO Service (4 tests)
- Code Execution Service (3 tests)
- Speech Service (2 tests)
- Evaluation Service (2 tests)

### Frontend Tests
```bash
cd frontend
npm test
```

## Performance Considerations

### Real-Time Optimization
- WebSocket connection pooling
- Event debouncing (code updates)
- Efficient binary audio streaming

### Database Optimization
- Indexed foreign keys
- Efficient JSON queries
- Connection pooling

### Caching Strategy
- Session data in Redis (future)
- Static assets via CDN
- API response caching

## Monitoring & Logging

### Metrics to Track
- WebSocket connection count
- Average interview duration
- Code execution time
- Evaluation generation time
- Error rates

### Logging
- Winston for structured logging
- Request/response logging
- Error tracking (Sentry)
- Performance monitoring (New Relic)

## Future Enhancements

### Phase 1: Production AI
- OpenAI Whisper for STT
- GPT-4 for evaluation
- Docker code sandbox
- Video recording

### Phase 2: Advanced Features
- Multi-language support (Java, C++, Go)
- Custom question banks
- Team collaboration mode
- Analytics dashboard
- Interview replay with sync

### Phase 3: Enterprise
- SSO integration
- Custom branding
- API access
- Bulk user management
- Advanced analytics

---

**Status:** Backend MVP Complete | Frontend Integration In Progress

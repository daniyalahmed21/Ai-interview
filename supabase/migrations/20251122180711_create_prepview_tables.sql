/*
  # Create PrepView Application Tables

  1. New Tables
    - `users`
      - `id` (text, primary key) - Unique user identifier
      - `name` (text) - User's full name
      - `email` (text, unique) - User's email address
      - `password` (text) - Hashed password
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `cvs`
      - `id` (text, primary key) - Unique CV identifier
      - `user_id` (text, unique, foreign key) - References users table
      - `personal_info` (jsonb) - Personal information (name, email, phone, etc.)
      - `summary` (text, nullable) - Professional summary
      - `skills` (jsonb) - List of skills
      - `projects` (jsonb) - List of projects
      - `education` (jsonb) - Educational background
      - `experience` (jsonb) - Work experience
      - `created_at` (timestamptz) - CV creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `interview_sessions`
      - `id` (text, primary key) - Unique session identifier
      - `session_id` (text) - Groups all questions in one interview
      - `user_id` (text, foreign key) - References users table
      - `field_id` (text) - Interview field/category identifier
      - `question_id` (integer) - Question number in the interview
      - `video_path` (text) - Path to recorded video
      - `video_filename` (text) - Name of the video file
      - `created_at` (timestamptz) - Session creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Users can only access their own CVs and interview sessions
    
  3. Indexes
    - Add indexes on foreign keys for better query performance
    - Add index on session_id for grouping interview questions
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create cvs table
CREATE TABLE IF NOT EXISTS cvs (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  personal_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary TEXT,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  education JSONB NOT NULL DEFAULT '[]'::jsonb,
  experience JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create interview_sessions table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  field_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  video_path TEXT NOT NULL,
  video_filename TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_session_id ON interview_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_field_id ON interview_sessions(field_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;

-- Users table policies (users can only read/update their own data)
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = current_setting('app.user_id', true));

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = current_setting('app.user_id', true))
  WITH CHECK (id = current_setting('app.user_id', true));

-- CVs table policies
CREATE POLICY "Users can view own CV"
  ON cvs FOR SELECT
  TO authenticated
  USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can insert own CV"
  ON cvs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update own CV"
  ON cvs FOR UPDATE
  TO authenticated
  USING (user_id = current_setting('app.user_id', true))
  WITH CHECK (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can delete own CV"
  ON cvs FOR DELETE
  TO authenticated
  USING (user_id = current_setting('app.user_id', true));

-- Interview sessions table policies
CREATE POLICY "Users can view own interview sessions"
  ON interview_sessions FOR SELECT
  TO authenticated
  USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can insert own interview sessions"
  ON interview_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update own interview sessions"
  ON interview_sessions FOR UPDATE
  TO authenticated
  USING (user_id = current_setting('app.user_id', true))
  WITH CHECK (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can delete own interview sessions"
  ON interview_sessions FOR DELETE
  TO authenticated
  USING (user_id = current_setting('app.user_id', true));
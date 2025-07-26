# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be set up (this may take a few minutes)

## 2. Create the Database Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create the quiz_submissions table
CREATE TABLE quiz_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  quiz_title TEXT NOT NULL,
  user_responses JSONB NOT NULL,
  total_pages INTEGER NOT NULL,
  completed_pages INTEGER NOT NULL,
  submission_status TEXT NOT NULL CHECK (submission_status IN ('completed', 'partial')),
  metadata JSONB
);

-- Enable Row Level Security (RLS)
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can customize this based on your needs)
CREATE POLICY "Allow all operations" ON quiz_submissions FOR ALL USING (true);

-- Create an index for better query performance
CREATE INDEX idx_quiz_submissions_created_at ON quiz_submissions(created_at DESC);
CREATE INDEX idx_quiz_submissions_status ON quiz_submissions(submission_status);
```

## 3. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - Project URL
   - anon/public key

## 4. Configure Environment Variables

Create a `.env.local` file in your project root with:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 5. Test the Integration

1. Start your development server: `npm run dev`
2. Fill out the quiz and submit
3. Check your Supabase dashboard > Table Editor > quiz_submissions to see the data

## 6. Optional: View Submissions

You can create a simple admin page to view submissions by using the `getQuizSubmissions()` function from `src/lib/quizService.ts`.

## 7. Set Up Analytics Authentication

1. **Enable Email Auth in Supabase:**
   - Go to Authentication > Settings
   - Enable "Enable email confirmations" (optional)
   - Enable "Enable email signups"

2. **Create Admin User:**
   - Get your Service Role Key from Settings > API
   - Add it to your `.env.local`:
     ```
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     ```
   - Run the admin creation script:
     ```bash
     npm install dotenv
     node scripts/create-admin.js
     ```

3. **Default Admin Credentials:**
   - Email: `admin@example.com`
   - Password: `admin123456`
   - **Important:** Change the password after first login!

## 8. Access Analytics Dashboard

1. Start your development server: `npm run dev`
2. Navigate to `/analytics` or click "View Analytics" on the quiz page
3. Sign in with the admin credentials
4. View comprehensive analytics and insights

## Security Notes

- The current setup allows all operations on the quiz_submissions table
- For production, consider implementing proper authentication and row-level security policies
- The anon key is safe to use in the browser as it has limited permissions
- The service role key should be kept secure and only used for admin operations 
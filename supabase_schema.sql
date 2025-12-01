-- Create diagnostic_questions table
create table if not exists diagnostic_questions (
  id uuid default gen_random_uuid() primary key,
  topic text not null,
  question_text text not null,
  options jsonb not null, -- Array of strings ["A", "B", "C", "D"]
  correct_answer text not null,
  difficulty text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_answers table
create table if not exists user_answers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null, -- Can be anon user id or auth user id
  question_id uuid references diagnostic_questions(id) not null,
  selected_answer text not null,
  is_correct boolean not null,
  time_taken_seconds integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create learning_paths table
create table if not exists learning_paths (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  topic text not null,
  analysis_json jsonb not null, -- Gemini analysis result
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create module_progress table
create table if not exists module_progress (
  user_id UUID NOT NULL,
  module_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, module_id)
);

-- Enable RLS (Row Level Security)
alter table diagnostic_questions enable row level security;
alter table user_answers enable row level security;
alter table learning_paths enable row level security;
alter table module_progress enable row level security;

-- Create policies (for demonstration, allowing public access since we use anon key)
-- In production, you would restrict this to authenticated users

-- Diagnostic Questions Policies
create policy "Allow public read access to diagnostic_questions"
  on diagnostic_questions for select
  using (true);

create policy "Allow public insert access to diagnostic_questions"
  on diagnostic_questions for insert
  with check (true);

-- User Answers Policies
create policy "Allow public insert access to user_answers"
  on user_answers for insert
  with check (true);

create policy "Allow public read access to user_answers"
  on user_answers for select
  using (true);

-- Learning Paths Policies
create policy "Allow public read access to learning_paths"
  on learning_paths for select
  using (true);

create policy "Allow public insert access to learning_paths"
  on learning_paths for insert
  with check (true);

-- Module Progress Policies
create policy "Allow all access to module_progress" 
  on module_progress for all 
  using (true);

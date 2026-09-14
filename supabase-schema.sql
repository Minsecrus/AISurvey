-- Run this once in Supabase Dashboard -> SQL Editor.
-- The public client can insert anonymous responses, but cannot read, edit, or delete them.

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  answers jsonb not null,
  answer_text text not null
);

alter table public.survey_responses enable row level security;

revoke all on table public.survey_responses from anon, authenticated;
grant insert on table public.survey_responses to anon;

drop policy if exists "Allow anonymous survey inserts" on public.survey_responses;

create policy "Allow anonymous survey inserts"
on public.survey_responses
for insert
to anon
with check (
  jsonb_typeof(answers) = 'object'
  and char_length(answer_text) between 1 and 50000
);

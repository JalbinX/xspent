-- Run this once in your Supabase project: SQL Editor → New query → paste → Run

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  amount numeric not null,
  currency text not null,
  category text not null,
  expense_date timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

create index if not exists expenses_user_id_idx on public.expenses(user_id);

-- Enable real-time sync: lets the app get instant updates when a row
-- changes (on any device signed into the same account), instead of
-- only refreshing on next load.
alter publication supabase_realtime add table public.expenses;

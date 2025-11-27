-- Create memberships table
create table if not exists public.memberships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text not null,
  status text not null,
  start_date timestamp with time zone default timezone('utc'::text, now()) not null,
  end_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Enable RLS
alter table public.memberships enable row level security;

-- Create policies
create policy "Users can view their own membership"
  on public.memberships for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own membership"
  on public.memberships for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own membership"
  on public.memberships for update
  using ( auth.uid() = user_id );

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Trigger to create profile on signup (optional but recommended)
-- This requires superuser privileges usually, so we might rely on client-side creation for now if this fails in the dashboard.

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

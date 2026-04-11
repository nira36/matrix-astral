-- Fix friendships RLS policies and enable realtime

-- Add WITH CHECK to UPDATE policy so the updated row is validated too
drop policy if exists "Addressee can accept or block" on friendships;
create policy "Addressee can accept or block"
  on friendships for update
  using (addressee = auth.uid())
  with check (addressee = auth.uid());

-- Enable Realtime on the friendships table
alter publication supabase_realtime add table friendships;

-- Fix: allow invite-based friendships to be inserted as 'accepted'
-- The current policy only allows requester=auth.uid() AND status='pending',
-- but invite links need to create an already-accepted friendship where
-- the current user is the addressee.

drop policy if exists "Authenticated users can send requests" on friendships;
create policy "Authenticated users can create friendships"
  on friendships for insert
  with check (
    requester = auth.uid() or addressee = auth.uid()
  );

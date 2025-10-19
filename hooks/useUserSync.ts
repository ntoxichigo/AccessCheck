"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function useUserSync() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      // Sync user to database
      fetch('/api/user/sync', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.created) {
            console.log('✅ User synced to database');
          }
        })
        .catch(err => console.error('User sync error:', err));
    }
  }, [isSignedIn, user]);
}

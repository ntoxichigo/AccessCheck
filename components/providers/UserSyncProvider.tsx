"use client";

import { useUserSync } from '@/hooks/useUserSync';

export function UserSyncProvider() {
  useUserSync();
  return null;
}

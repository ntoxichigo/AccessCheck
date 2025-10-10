/**
 * React Query Hooks for API Calls
 * High-quality implementations with caching, optimistic updates, and error handling
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analytics } from '@/lib/analytics';

// Query Keys
export const queryKeys = {
  scans: ['scans'] as const,
  scan: (id: string) => ['scans', id] as const,
  scanHistory: ['scans', 'history'] as const,
  user: ['user'] as const,
  subscription: ['subscription'] as const,
};

// Types
interface ScanResult {
  id: string;
  url: string;
  violations: Array<{
    id: string;
    impact: string;
    description: string;
    wcagTags: string[];
  }>;
  passes: number;
  violations_count: number;
  incomplete: number;
  createdAt: string;
}

interface ScanHistory {
  scans: ScanResult[];
  total: number;
}

/**
 * Fetch scan by ID with caching
 */
export function useScan(scanId: string | null) {
  return useQuery({
    queryKey: queryKeys.scan(scanId || ''),
    queryFn: async () => {
      if (!scanId) throw new Error('Scan ID is required');
      
      const response = await fetch(`/api/scans/${scanId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch scan');
      }
      
      return response.json() as Promise<ScanResult>;
    },
    enabled: !!scanId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch scan history with caching
 */
export function useScanHistory() {
  return useQuery({
    queryKey: queryKeys.scanHistory,
    queryFn: async () => {
      const response = await fetch('/api/scans/history');
      if (!response.ok) {
        throw new Error('Failed to fetch scan history');
      }
      
      return response.json() as Promise<ScanHistory>;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Create new scan with optimistic updates
 */
export function useCreateScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (url: string) => {
      const startTime = Date.now();
      
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create scan');
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      // Track analytics
      analytics.trackScan({
        scanId: data.id,
        url,
        duration,
        violationsCount: data.violations_count || 0,
        wcagLevel: 'AA',
        userTier: 'free', // TODO: Get from user context
      });

      return data as ScanResult;
    },
    onSuccess: (newScan) => {
      // Invalidate and refetch scan history
      queryClient.invalidateQueries({ queryKey: queryKeys.scanHistory });
      
      // Optimistically add to cache
      queryClient.setQueryData(queryKeys.scan(newScan.id), newScan);
    },
  });
}

/**
 * Delete scan with optimistic updates
 */
export function useDeleteScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scanId: string) => {
      const response = await fetch(`/api/scans/${scanId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete scan');
      }

      return scanId;
    },
    onMutate: async (scanId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.scanHistory });

      // Snapshot previous value
      const previousHistory = queryClient.getQueryData<ScanHistory>(queryKeys.scanHistory);

      // Optimistically update
      if (previousHistory) {
        queryClient.setQueryData<ScanHistory>(queryKeys.scanHistory, {
          ...previousHistory,
          scans: previousHistory.scans.filter((scan) => scan.id !== scanId),
          total: previousHistory.total - 1,
        });
      }

      return { previousHistory };
    },
    onError: (_err, _scanId, context) => {
      // Rollback on error
      if (context?.previousHistory) {
        queryClient.setQueryData(queryKeys.scanHistory, context.previousHistory);
      }
    },
    onSuccess: () => {
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.scanHistory });
    },
  });
}

/**
 * Fetch user subscription
 */
export function useSubscription() {
  return useQuery({
    queryKey: queryKeys.subscription,
    queryFn: async () => {
      const response = await fetch('/api/billing/subscription');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }
      
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Create checkout session
 */
export function useCreateCheckout() {
  return useMutation({
    mutationFn: async (opts: { plan?: string; priceId?: string }) => {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opts),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error || 'Failed to create checkout session');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Track conversion attempt
      analytics.track('checkout_started', {
        priceId: data.priceId,
        sessionId: data.sessionId,
      });
    },
  });
}

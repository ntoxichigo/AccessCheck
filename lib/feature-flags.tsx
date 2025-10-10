/**
 * Feature Flag System
 * Simple, type-safe feature flags for gradual rollouts
 */

'use client';

import { createContext, useContext, type ReactNode } from 'react';

/**
 * Define all feature flags here
 */
export const FEATURES = {
  // Analytics features
  ADVANCED_ANALYTICS: 'advanced_analytics',
  EXPORT_PDF: 'export_pdf',
  
  // Pro features
  UNLIMITED_SCANS: 'unlimited_scans',
  PRIORITY_SUPPORT: 'priority_support',
  API_ACCESS: 'api_access',
  
  // Experimental features
  AI_SUGGESTIONS: 'ai_suggestions',
  BULK_SCANNING: 'bulk_scanning',
  SCHEDULED_SCANS: 'scheduled_scans',
  
  // UI features
  DARK_MODE: 'dark_mode',
  NOTIFICATION_CENTER: 'notification_center',
  
  // Admin features
  ADMIN_DASHBOARD: 'admin_dashboard',
  USER_MANAGEMENT: 'user_management',
  AUDIT_LOGS: 'audit_logs',
} as const;

export type FeatureFlag = (typeof FEATURES)[keyof typeof FEATURES];

/**
 * Feature flag configuration
 * Set to true to enable, false to disable
 */
const featureConfig: Record<FeatureFlag, boolean> = {
  // Analytics features - enabled
  [FEATURES.ADVANCED_ANALYTICS]: true,
  [FEATURES.EXPORT_PDF]: true,
  
  // Pro features - enabled
  [FEATURES.UNLIMITED_SCANS]: true,
  [FEATURES.PRIORITY_SUPPORT]: true,
  [FEATURES.API_ACCESS]: false, // Not implemented yet
  
  // Experimental features - disabled by default
  [FEATURES.AI_SUGGESTIONS]: false,
  [FEATURES.BULK_SCANNING]: false,
  [FEATURES.SCHEDULED_SCANS]: false,
  
  // UI features - enabled
  [FEATURES.DARK_MODE]: true,
  [FEATURES.NOTIFICATION_CENTER]: true,
  
  // Admin features - enabled
  [FEATURES.ADMIN_DASHBOARD]: true,
  [FEATURES.USER_MANAGEMENT]: true,
  [FEATURES.AUDIT_LOGS]: true,
};

/**
 * Environment-based overrides
 * Can be controlled via environment variables
 */
const getFeatureOverrides = (): Partial<Record<FeatureFlag, boolean>> => {
  if (typeof window === 'undefined') return {};
  
  const overrides: Partial<Record<FeatureFlag, boolean>> = {};
  
  // Check localStorage for overrides (useful for testing)
  try {
    const stored = localStorage.getItem('feature_flags');
    if (stored) {
      return JSON.parse(stored) as Partial<Record<FeatureFlag, boolean>>;
    }
  } catch {
    // Ignore errors
  }
  
  return overrides;
};

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = (feature: FeatureFlag): boolean => {
  const overrides = getFeatureOverrides();
  
  // Check override first
  if (feature in overrides) {
    return overrides[feature] ?? false;
  }
  
  // Fall back to config
  return featureConfig[feature] ?? false;
};

/**
 * Feature Flag Context
 */
interface FeatureFlagContextValue {
  isEnabled: (feature: FeatureFlag) => boolean;
  enable: (feature: FeatureFlag) => void;
  disable: (feature: FeatureFlag) => void;
  toggle: (feature: FeatureFlag) => void;
  getAllFlags: () => Record<FeatureFlag, boolean>;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

/**
 * Feature Flag Provider
 */
export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const enable = (feature: FeatureFlag) => {
    if (typeof window === 'undefined') return;
    
    const overrides = getFeatureOverrides();
    overrides[feature] = true;
    localStorage.setItem('feature_flags', JSON.stringify(overrides));
    
    // Force re-render
    window.dispatchEvent(new Event('feature-flags-changed'));
  };

  const disable = (feature: FeatureFlag) => {
    if (typeof window === 'undefined') return;
    
    const overrides = getFeatureOverrides();
    overrides[feature] = false;
    localStorage.setItem('feature_flags', JSON.stringify(overrides));
    
    window.dispatchEvent(new Event('feature-flags-changed'));
  };

  const toggle = (feature: FeatureFlag) => {
    if (isFeatureEnabled(feature)) {
      disable(feature);
    } else {
      enable(feature);
    }
  };

  const getAllFlags = (): Record<FeatureFlag, boolean> => {
    const overrides = getFeatureOverrides();
    return Object.keys(featureConfig).reduce((acc, key) => {
      const feature = key as FeatureFlag;
      acc[feature] = overrides[feature] ?? featureConfig[feature];
      return acc;
    }, {} as Record<FeatureFlag, boolean>);
  };

  const value: FeatureFlagContextValue = {
    isEnabled: isFeatureEnabled,
    enable,
    disable,
    toggle,
    getAllFlags,
  };

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
}

/**
 * Hook to use feature flags
 */
export function useFeatureFlag(feature: FeatureFlag): boolean {
  const context = useContext(FeatureFlagContext);
  
  if (!context) {
    // Fallback if provider not found
    return isFeatureEnabled(feature);
  }
  
  return context.isEnabled(feature);
}

/**
 * Hook to get feature flag controls
 */
export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagProvider');
  }
  
  return context;
}

/**
 * Component to conditionally render based on feature flag
 */
interface FeatureGateProps {
  feature: FeatureFlag;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  const isEnabled = useFeatureFlag(feature);
  
  return <>{isEnabled ? children : fallback}</>;
}

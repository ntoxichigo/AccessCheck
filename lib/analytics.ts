/**
 * Analytics Tracking Library
 * High-level abstraction for tracking events across multiple providers
 */

import { track as vercelTrack } from '@vercel/analytics';

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

export interface AnalyticsEvent {
  name: string;
  properties?: AnalyticsProperties;
  userId?: string;
  timestamp?: Date;
}

export interface ScanAnalytics {
  scanId: string;
  url: string;
  duration: number;
  violationsCount: number;
  wcagLevel: string;
  userTier: 'free' | 'pro';
}

export interface ConversionAnalytics {
  from: 'free' | 'pro';
  to: 'free' | 'pro';
  plan: string;
  revenue?: number;
}

/**
 * Track custom analytics events
 */
export const analytics = {
  /**
   * Track a scan completion
   */
  trackScan: (data: ScanAnalytics) => {
    vercelTrack('scan_completed', {
      scanId: data.scanId,
      url: data.url,
      duration: data.duration,
      violations: data.violationsCount,
      wcagLevel: data.wcagLevel,
      tier: data.userTier,
    });

    // Track in console for dev
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Scan completed:', data);
    }
  },

  /**
   * Track a conversion (free -> pro)
   */
  trackConversion: (data: ConversionAnalytics) => {
    vercelTrack('conversion', {
      from: data.from,
      to: data.to,
      plan: data.plan,
      revenue: data.revenue ?? 0,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Conversion:', data);
    }
  },

  /**
   * Track export action
   */
  trackExport: (format: 'json' | 'csv' | 'pdf', scanId: string) => {
    vercelTrack('export', {
      format,
      scanId,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Export:', { format, scanId });
    }
  },

  /**
   * Track page views
   */
  trackPageView: (page: string, properties?: AnalyticsProperties) => {
    vercelTrack('page_view', {
      page,
      ...properties,
    });
  },

  /**
   * Track user signup
   */
  trackSignup: (method: 'google' | 'github' | 'email') => {
    vercelTrack('signup', {
      method,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Signup:', { method });
    }
  },

  /**
   * Track accessibility violations by type
   */
  trackViolations: (violations: Array<{ impact: string; wcagTag: string }>) => {
    const grouped = violations.reduce((acc, v) => {
      const key = `${v.impact}_${v.wcagTag}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    vercelTrack('violations_summary', grouped);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Violations:', grouped);
    }
  },

  /**
   * Track feature usage
   */
  trackFeature: (feature: string, properties?: AnalyticsProperties) => {
    vercelTrack('feature_used', {
      feature,
      ...properties,
    });
  },

  /**
   * Generic event tracking
   */
  track: (eventName: string, properties?: AnalyticsProperties) => {
    if (properties) {
      vercelTrack(eventName, properties as Record<string, string | number | boolean | null>);
    } else {
      vercelTrack(eventName);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${eventName}:`, properties);
    }
  },
};

/**
 * Initialize analytics (call in root layout)
 */
export const initAnalytics = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Initialized');
  }
};

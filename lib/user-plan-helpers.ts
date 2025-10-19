/**
 * User Plan Helper Functions
 * Utilities for checking user subscription status, trial status, and feature access
 */

import { User } from '@prisma/client';

export interface UserPlanInfo {
  plan: 'free' | 'trial' | 'pro' | 'enterprise';
  isTrialActive: boolean;
  trialDaysRemaining: number;
  canExportPDF: boolean;
  canScheduleScans: boolean;
  scanLimit: {
    used: number;
    limit: number;
    period: 'total' | 'daily';
  };
}

/**
 * Check if user is currently on an active trial
 */
export function isTrialUser(user: Partial<User>): boolean {
  if (!user.trialStarted || !user.trialEnds) return false;
  const now = new Date();
  return now >= user.trialStarted && now <= user.trialEnds;
}

/**
 * Get days remaining in trial
 */
export function getTrialDaysRemaining(user: Partial<User>): number {
  if (!isTrialUser(user) || !user.trialEnds) return 0;
  const now = new Date();
  const daysRemaining = Math.ceil((user.trialEnds.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysRemaining);
}

/**
 * Get comprehensive user plan information
 */
export function getUserPlanInfo(user: Partial<User>): UserPlanInfo {
  const isTrial = isTrialUser(user);
  const subscription = user.subscription || 'free';
  
  // Determine effective plan
  let plan: 'free' | 'trial' | 'pro' | 'enterprise';
  if (isTrial) {
    plan = 'trial';
  } else if (subscription === 'pro' || subscription === 'starter') {
    plan = 'pro';
  } else if (subscription === 'enterprise') {
    plan = 'enterprise';
  } else {
    plan = 'free';
  }

  // PDF export available for trial, pro, and enterprise
  const canExportPDF = plan === 'trial' || plan === 'pro' || plan === 'enterprise';

  // Scheduled scans only for pro and enterprise
  const canScheduleScans = plan === 'pro' || plan === 'enterprise';

  // Determine scan limits
  let scanLimit: UserPlanInfo['scanLimit'];
  if (plan === 'free') {
    scanLimit = {
      used: user.freeScansUsed || 0,
      limit: user.freeScansLimit || 5,
      period: 'total'
    };
  } else if (plan === 'trial') {
    scanLimit = {
      used: user.trialScansUsed || 0,
      limit: user.trialScansLimit || 10,
      period: 'total'
    };
  } else {
    // Pro and enterprise get daily limits
    scanLimit = {
      used: 0, // Will be calculated from today's scans
      limit: 10,
      period: 'daily'
    };
  }

  return {
    plan,
    isTrialActive: isTrial,
    trialDaysRemaining: getTrialDaysRemaining(user),
    canExportPDF,
    canScheduleScans,
    scanLimit
  };
}

/**
 * Check if user has reached their scan limit
 */
export function hasReachedScanLimit(user: Partial<User>): boolean {
  const planInfo = getUserPlanInfo(user);
  return planInfo.scanLimit.used >= planInfo.scanLimit.limit;
}

/**
 * Get remaining scans for user
 */
export function getRemainingScans(user: Partial<User>): number {
  const planInfo = getUserPlanInfo(user);
  return Math.max(0, planInfo.scanLimit.limit - planInfo.scanLimit.used);
}

/**
 * Check if user can access a specific feature
 */
export function canAccessFeature(user: Partial<User>, feature: string): boolean {
  const planInfo = getUserPlanInfo(user);

  switch (feature) {
    case 'pdf_export':
      return planInfo.canExportPDF;
    case 'scheduled_scans':
      return planInfo.canScheduleScans;
    case 'batch_scans':
      return planInfo.plan === 'pro' || planInfo.plan === 'enterprise';
    case 'api_access':
      return planInfo.plan === 'pro' || planInfo.plan === 'enterprise';
    case 'priority_support':
      return planInfo.plan === 'enterprise';
    case 'custom_branding':
      return planInfo.plan === 'enterprise';
    case 'scan_history':
      return planInfo.plan !== 'free';
    case 'email_notifications':
      return planInfo.plan !== 'free';
    default:
      return false;
  }
}

/**
 * Get upgrade message for a feature
 */
export function getUpgradeMessage(feature: string): string {
  const messages: Record<string, string> = {
    pdf_export: 'Upgrade to Pro to export full PDF reports',
    scheduled_scans: 'Upgrade to Pro for scheduled scans',
    batch_scans: 'Upgrade to Pro for batch scanning',
    api_access: 'Upgrade to Pro for API access',
    priority_support: 'Upgrade to Enterprise for priority support',
    custom_branding: 'Upgrade to Enterprise for custom branding',
    scan_history: 'Upgrade to view scan history',
    email_notifications: 'Upgrade to receive email notifications'
  };

  return messages[feature] || 'Upgrade to Pro to unlock this feature';
}

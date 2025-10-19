import crypto from 'crypto';

/**
 * Generates a secure API key with prefix
 * Format: ak_live_<random-32-char-string>
 */
export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(24);
  const randomString = randomBytes.toString('base64')
    .replace(/\+/g, '')
    .replace(/\//g, '')
    .replace(/=/g, '')
    .substring(0, 32);

  return `ak_live_${randomString}`;
}

/**
 * Hash API key for storage
 */
export function hashApiKey(apiKey: string): string {
  return crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');
}

/**
 * Validate API key format
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
  return /^ak_live_[A-Za-z0-9]{32}$/.test(apiKey);
}

import { prisma } from '../db/prisma';
import { hashApiKey, isValidApiKeyFormat } from './api-key';

/**
 * Validates an API key and returns the associated user
 * @param apiKey - The plain API key from the request header
 * @returns User object if valid, null if invalid
 */
export async function validateApiKey(apiKey: string) {
  // Check format first
  if (!isValidApiKeyFormat(apiKey)) {
    return null;
  }

  // Hash the provided key to compare with stored hash
  const hashedKey = hashApiKey(apiKey);

  // Find the API key in database
  const dbApiKey = await prisma.apiKey.findFirst({
    where: {
      key: hashedKey,
      isActive: true,
    },
    include: {
      user: true,
    },
  });

  if (!dbApiKey) {
    return null;
  }

  // Check if key is expired
  if (dbApiKey.expiresAt && new Date() > dbApiKey.expiresAt) {
    return null;
  }

  // Update last used timestamp (fire and forget)
  prisma.apiKey
    .update({
      where: { id: dbApiKey.id },
      data: { lastUsedAt: new Date() },
    })
    .catch((error) => console.error('Failed to update lastUsedAt:', error));

  return dbApiKey.user;
}

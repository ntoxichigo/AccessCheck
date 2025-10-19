-- Add API rate limiting fields to User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "apiKeysLimit" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "apiRequestsLimit" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "apiRequestsUsed" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "billingCycleStart" TIMESTAMP;

-- Add requestsUsed to ApiKey table
ALTER TABLE "ApiKey" 
ADD COLUMN IF NOT EXISTS "requestsUsed" INTEGER DEFAULT 0;

-- Create ApiUsageLog table
CREATE TABLE IF NOT EXISTS "ApiUsageLog" (
  "id" TEXT PRIMARY KEY,
  "apiKeyId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "endpoint" TEXT NOT NULL,
  "timestamp" TIMESTAMP DEFAULT NOW(),
  "responseStatus" INTEGER,
  "responseTime" INTEGER,
  CONSTRAINT "ApiUsageLog_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE CASCADE,
  CONSTRAINT "ApiUsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create indexes for ApiUsageLog
CREATE INDEX IF NOT EXISTS "ApiUsageLog_apiKeyId_idx" ON "ApiUsageLog"("apiKeyId");
CREATE INDEX IF NOT EXISTS "ApiUsageLog_userId_idx" ON "ApiUsageLog"("userId");
CREATE INDEX IF NOT EXISTS "ApiUsageLog_timestamp_idx" ON "ApiUsageLog"("timestamp");

-- Update existing Pro users with API limits
UPDATE "User" 
SET 
  "apiKeysLimit" = 1,
  "apiRequestsLimit" = 1000,
  "billingCycleStart" = NOW()
WHERE "subscription" = 'pro' OR "subscription" = 'Pro';

-- Update existing Business users with API limits (if any)
UPDATE "User" 
SET 
  "apiKeysLimit" = 5,
  "apiRequestsLimit" = 10000,
  "billingCycleStart" = NOW()
WHERE "subscription" = 'business' OR "subscription" = 'Business';

-- Update existing Enterprise users with API limits (if any)
UPDATE "User" 
SET 
  "apiKeysLimit" = 999999,
  "apiRequestsLimit" = 999999,
  "billingCycleStart" = NOW()
WHERE "subscription" = 'enterprise' OR "subscription" = 'Enterprise';

# API Rate Limiting Implementation Guide

## Overview
This guide walks through implementing tier-based API access with rate limiting for AccessCheck.

---

## Step 1: Database Migration

### Run the migration script:
```powershell
# Navigate to the project directory
cd c:\Users\anton\OneDrive\Desktop\AccessCheck-main\accessibility-checker

# Apply the migration directly to the database
$env:DATABASE_URL="your-connection-string-here"
psql $env:DATABASE_URL < prisma\migrations\add_api_rate_limiting.sql

# OR use Prisma to generate and apply migrations
npx prisma migrate dev --name add_api_rate_limiting
```

### Regenerate Prisma Client:
```powershell
npx prisma generate
```

---

## Step 2: Update User Subscription Limits

When a user subscribes or changes their plan, update their API limits:

### Create webhook handler for Stripe (if not exists):
**File**: `app/api/webhooks/stripe/route.ts`

```typescript
import { getTierConfig } from '@/lib/api/rateLimiter';
import { prisma } from '@/lib/db/prisma';

// In your Stripe webhook handler, when subscription is created/updated:
export async function POST(request: Request) {
  // ... existing webhook logic ...
  
  const event = await stripe.webhooks.constructEvent(/* ... */);
  
  if (event.type === 'customer.subscription.created' || 
      event.type === 'customer.subscription.updated') {
    const subscription = event.data.object;
    
    // Get user ID from metadata
    const userId = subscription.metadata.userId;
    
    // Determine subscription tier (pro, business, enterprise)
    const tier = subscription.items.data[0].price.lookup_key; // e.g., 'pro', 'business'
    
    // Get tier configuration
    const config = getTierConfig(tier);
    
    // Update user limits
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: tier,
        apiKeysLimit: config.apiKeysLimit,
        apiRequestsLimit: config.apiRequestsLimit,
        apiRequestsUsed: 0, // Reset on plan change
        billingCycleStart: new Date(),
      },
    });
  }
  
  return new Response('OK', { status: 200 });
}
```

---

## Step 3: Protect API Endpoints with Rate Limiting

### Create API middleware:
**File**: `middleware.ts` (root level)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, incrementUsage, createRateLimitError, createRateLimitHeaders } from './lib/api/rateLimiter';

export async function middleware(request: NextRequest) {
  // Only apply rate limiting to /api/v1/* endpoints (external API)
  if (request.nextUrl.pathname.startsWith('/api/v1/')) {
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required. Include your API key in the X-API-Key header.' },
        { status: 401 }
      );
    }
    
    // Check rate limit
    const rateLimitResult = await checkRateLimit(apiKey);
    
    if (!rateLimitResult.allowed) {
      return createRateLimitError(rateLimitResult);
    }
    
    // Add rate limit headers to response
    const response = NextResponse.next();
    const headers = createRateLimitHeaders(rateLimitResult);
    
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/v1/:path*',
};
```

---

## Step 4: Track API Usage

### In your API endpoint:
**File**: `app/api/v1/scan/route.ts` (example)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { incrementUsage } from '@/lib/api/rateLimiter';
import { prisma } from '@/lib/db/prisma';
import { hashApiKey } from '@/lib/auth/api-key';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Find API key
    const hashedKey = hashApiKey(apiKey);
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key: hashedKey },
    });
    
    if (!apiKeyRecord || !apiKeyRecord.isActive) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }
    
    // Your API logic here
    const body = await request.json();
    const { url } = body;
    
    // Perform scan...
    const result = { /* ... scan results ... */ };
    
    // Track usage
    const responseTime = Date.now() - startTime;
    await incrementUsage(
      apiKeyRecord.id,
      apiKeyRecord.userId,
      '/api/v1/scan',
      200,
      responseTime
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    
    // Track failed request
    const responseTime = Date.now() - startTime;
    // ... increment usage with error status ...
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Step 5: Create Dashboard UI for API Management

### API Key Management Component:
**File**: `components/ApiKeyManagement.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt: string | null;
  isActive: boolean;
}

interface Usage {
  limit: number;
  used: number;
  remaining: number;
  resetDate: string;
  percentage: number;
}

export function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [keyName, setKeyName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadApiKeys();
  }, []);

  async function loadApiKeys() {
    const res = await fetch('/api/user/api-key');
    const data = await res.json();
    setApiKeys(data.apiKeys);
    setUsage(data.usage);
  }

  async function createApiKey() {
    if (!keyName.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/user/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setNewKey(data.apiKey);
        setKeyName('');
        await loadApiKeys();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Failed to create API key');
    } finally {
      setLoading(false);
    }
  }

  async function revokeKey(keyId: string) {
    if (!confirm('Are you sure you want to revoke this API key?')) return;
    
    await fetch(`/api/user/api-key?keyId=${keyId}`, {
      method: 'DELETE',
    });
    
    await loadApiKeys();
  }

  return (
    <div className="space-y-6">
      {/* Usage Stats */}
      {usage && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">API Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Used: {usage.used.toLocaleString()} / {usage.limit.toLocaleString()} requests</span>
              <span className="font-semibold">{usage.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${usage.percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Resets on: {new Date(usage.resetDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Create New Key */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Create New API Key</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Key name (e.g., Production Server)"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
          />
          <Button onClick={createApiKey} disabled={loading}>
            Create
          </Button>
        </div>
        
        {newKey && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-semibold text-yellow-800 mb-2">
              ⚠️ Save this API key now! You won't be able to see it again.
            </p>
            <code className="block p-2 bg-white rounded border">
              {newKey}
            </code>
            <Button 
              className="mt-2" 
              onClick={() => {
                navigator.clipboard.writeText(newKey);
                alert('Copied to clipboard!');
              }}
            >
              Copy to Clipboard
            </Button>
          </div>
        )}
      </div>

      {/* API Keys List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Your API Keys</h3>
        <div className="space-y-2">
          {apiKeys.map((key) => (
            <div 
              key={key.id} 
              className="flex justify-between items-center p-4 border rounded"
            >
              <div>
                <p className="font-semibold">{key.name}</p>
                <code className="text-sm text-gray-600">{key.key}</code>
                <p className="text-xs text-gray-500">
                  Created: {new Date(key.createdAt).toLocaleDateString()}
                  {key.lastUsedAt && ` • Last used: ${new Date(key.lastUsedAt).toLocaleDateString()}`}
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => revokeKey(key.id)}
              >
                Revoke
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Step 6: Update Pricing Page

Add clear tier comparison with API access:

```typescript
const tiers = [
  {
    name: 'Free',
    price: '$0',
    features: [
      '10 scans/month',
      'Web UI only',
      '❌ No API access',
      '❌ No PDF export',
    ],
  },
  {
    name: 'Pro',
    price: '$19',
    features: [
      'Unlimited scans',
      '✅ 1 API key',
      '✅ 1,000 API requests/month',
      '✅ PDF export',
      '✅ Bulk scanning',
    ],
  },
  {
    name: 'Business',
    price: '$99',
    features: [
      'Everything in Pro',
      '✅ 5 API keys',
      '✅ 10,000 API requests/month',
      '✅ Team collaboration',
      '✅ Custom branding',
    ],
  },
];
```

---

## Step 7: Testing

### Test API key creation:
```powershell
# 1. Login as a Pro user
# 2. Navigate to /dashboard/api-keys
# 3. Create a new API key
# 4. Copy the key

# Test the API with your key
$apiKey = "ak_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$url = "http://localhost:3000/api/v1/scan"

$headers = @{
    "X-API-Key" = $apiKey
    "Content-Type" = "application/json"
}

$body = @{
    url = "https://example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body
```

### Test rate limiting:
```powershell
# Send multiple requests to hit the limit
for ($i = 1; $i -le 1005; $i++) {
    Write-Host "Request $i"
    try {
        Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body
    } catch {
        Write-Host "Rate limit hit at request $i"
        Write-Host $_.Exception.Message
        break
    }
}
```

---

## Step 8: Monitoring & Analytics

### Create analytics dashboard query:
```sql
-- API usage by user (last 30 days)
SELECT 
  u.email,
  u.subscription,
  COUNT(l.id) as total_requests,
  COUNT(DISTINCT DATE(l.timestamp)) as active_days,
  AVG(l."responseTime") as avg_response_time
FROM "User" u
JOIN "ApiUsageLog" l ON u.id = l."userId"
WHERE l.timestamp >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.email, u.subscription
ORDER BY total_requests DESC;

-- Most popular endpoints
SELECT 
  endpoint,
  COUNT(*) as request_count,
  AVG("responseTime") as avg_response_time
FROM "ApiUsageLog"
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY endpoint
ORDER BY request_count DESC;

-- Users approaching their limits
SELECT 
  u.email,
  u.subscription,
  u."apiRequestsUsed",
  u."apiRequestsLimit",
  ROUND((u."apiRequestsUsed"::FLOAT / u."apiRequestsLimit"::FLOAT) * 100, 2) as usage_percentage
FROM "User" u
WHERE u."apiRequestsLimit" > 0
  AND (u."apiRequestsUsed"::FLOAT / u."apiRequestsLimit"::FLOAT) > 0.8
ORDER BY usage_percentage DESC;
```

---

## Step 9: Email Notifications

### Send warning emails at 80%, 90%, 100% usage:

**File**: `lib/email/usageWarnings.ts`

```typescript
export async function checkUsageAndNotify(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      apiRequestsUsed: true,
      apiRequestsLimit: true,
    },
  });
  
  if (!user || !user.apiRequestsLimit) return;
  
  const percentage = (user.apiRequestsUsed / user.apiRequestsLimit) * 100;
  
  if (percentage >= 80 && percentage < 90) {
    // Send 80% warning
    await sendEmail({
      to: user.email,
      subject: 'AccessCheck: You\'ve used 80% of your API limit',
      body: '...',
    });
  } else if (percentage >= 90 && percentage < 100) {
    // Send 90% warning
  } else if (percentage >= 100) {
    // Send limit exceeded notification
  }
}
```

---

## Step 10: Documentation

### Create API documentation page at `/api-docs`:

Include:
- Authentication (API key in header)
- Rate limits by tier
- Available endpoints
- Request/response examples
- Error codes
- SDKs (if available)

---

## Next Steps

1. ✅ Review strategy document (`API_PRICING_STRATEGY.md`)
2. ⏳ Run database migration
3. ⏳ Regenerate Prisma client
4. ⏳ Test API key creation
5. ⏳ Implement middleware
6. ⏳ Create dashboard UI
7. ⏳ Update pricing page
8. ⏳ Set up email notifications
9. ⏳ Create API documentation
10. ⏳ Launch and monitor

---

## Troubleshooting

### Issue: Prisma client doesn't recognize new fields
**Solution**: Run `npx prisma generate` after updating schema

### Issue: Rate limit not resetting
**Solution**: Check `billingCycleStart` date, ensure it's set when subscription created

### Issue: API key validation failing
**Solution**: Ensure you're hashing the API key before database lookup

### Issue: TypeScript errors in rateLimiter.ts
**Solution**: These will resolve after running `npx prisma generate` with the updated schema

---

**Ready to implement?** Start with Step 1 (Database Migration)!

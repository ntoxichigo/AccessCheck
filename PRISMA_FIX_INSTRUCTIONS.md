# Fix: Prisma Client Initialization Error

## Problem
API key generation fails with error:
```
TypeError: Cannot read properties of undefined (reading 'findMany')
```

This happens because the Prisma client needs to be regenerated, but the dev server has the files locked.

## Solution

### Option 1: Using the Batch Script (Easiest)
1. **Stop your development server** (press `Ctrl+C` in the terminal running `npm run dev`)
2. Run the fix script:
   ```bash
   fix-prisma.bat
   ```
3. Restart your dev server:
   ```bash
   npm run dev
   ```

### Option 2: Manual Steps
1. **Stop your development server** (press `Ctrl+C`)
2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
3. Restart your dev server:
   ```bash
   npm run dev
   ```

### Option 3: Full Reinstall (If above don't work)
1. **Stop your development server**
2. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```
   (The `postinstall` script will automatically run `prisma generate`)
3. Restart your dev server:
   ```bash
   npm run dev
   ```

## Verification
After restarting the dev server, test API key generation:
1. Go to Settings → API Access
2. Click "Create API Key"
3. Enter a name and create
4. You should now see the API key successfully created!

## Why This Happens
The Prisma client is generated code that lives in `node_modules/.prisma/client/`. When you:
- Update the schema (`prisma/schema.prisma`)
- Install dependencies
- Or when the dev server locks the files

The client needs to be regenerated. The dev server caching can prevent this from happening automatically.

## Prevention
The `postinstall` script in `package.json` automatically runs `prisma generate` after `npm install`, so this shouldn't happen often. If you modify the Prisma schema, always run:
```bash
npx prisma generate
```
before testing changes.

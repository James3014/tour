# 🚀 Deployment Guide - Zeabur

## Prerequisites

- Zeabur account
- GitHub repository connected to Zeabur

## Steps

### 1. Add PostgreSQL Service

1. Go to your Zeabur project dashboard
2. Click **"Add Service"**
3. Select **"PostgreSQL"**
4. Zeabur will automatically:
   - Create a PostgreSQL database
   - Inject `DATABASE_URL` environment variable to your app

### 2. Deploy Your App

Zeabur will automatically:
- Run `npm install`
- Run `npm run build` which includes:
  - `prisma generate` - Generate Prisma Client
  - `prisma migrate deploy` - Run migrations
  - `next build` - Build Next.js app

### 3. Verify Deployment

Visit your app URL (e.g., `https://tour-app-2.zeabur.app`) and test:
- Create a trip
- Add items
- Refresh page - data should persist

## Troubleshooting

### Error: "the server responded with a status of 500"

**Cause**: Database not configured

**Solution**: 
1. Make sure PostgreSQL service is added to your Zeabur project
2. Check that `DATABASE_URL` environment variable is set
3. Redeploy the app

### Error: "Prisma Client could not locate the Query Engine"

**Cause**: Prisma Client not generated

**Solution**: 
- The build script should handle this automatically
- If not, manually add `prisma generate` to build script

### Migration Issues

If migrations fail:
```bash
# Locally, create a new migration
npx prisma migrate dev --name init

# Push to GitHub
git add prisma/migrations
git commit -m "Add initial migration"
git push

# Zeabur will auto-deploy
```

## Environment Variables

Zeabur automatically injects:
- `DATABASE_URL` - PostgreSQL connection string (when PostgreSQL service is added)

No manual configuration needed! ✨

## Local Development vs Production

| Environment | Database | Provider |
|------------|----------|----------|
| Local | SQLite (`dev.db`) | `file:./dev.db` |
| Production | PostgreSQL | Zeabur-injected URL |

The Prisma schema now uses PostgreSQL for both environments. For local development with SQLite, you can temporarily change the provider in `schema.prisma`.

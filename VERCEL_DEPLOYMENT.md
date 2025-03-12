# Vercel Deployment Guide

This guide will help you deploy the Konstituzzjoni.mt application to Vercel with a proper database setup.

## Prerequisites

1. A Vercel account
2. A PostgreSQL database (you can use Vercel Postgres, Supabase, Neon, or any other PostgreSQL provider)

## Setup Steps

### 1. Set Up a PostgreSQL Database

You need a PostgreSQL database for production. Here are some options:

#### Option A: Vercel Postgres

1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Follow the setup instructions
4. Copy the connection string

#### Option B: Supabase

1. Create a Supabase account
2. Create a new project
3. Go to Settings > Database
4. Get the connection string (format: `postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres`)

#### Option C: Neon

1. Create a Neon account
2. Create a new project
3. Get the connection string from the dashboard

### 2. Configure Environment Variables in Vercel

In your Vercel project settings, add the following environment variables:

- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXT_PUBLIC_SITE_URL`: The URL of your deployed site (e.g., `https://your-app.vercel.app`)

### 3. Deploy Your Project

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure the build settings:
   - Framework Preset: Next.js
   - Build Command: `npx prisma generate && next build`
   - Install Command: `npm install`
   - Output Directory: `.next`

### 4. Run Database Migrations

After the first deployment, you need to run the database migrations:

```bash
# Install Vercel CLI if you haven't already
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env

# Run migrations
npx prisma migrate deploy
```

## Troubleshooting

### Database Connection Issues

If you're experiencing database connection issues:

1. Check that your `DATABASE_URL` is correct
2. Ensure your database allows connections from Vercel's IP addresses
3. Check for any firewall rules that might be blocking connections

### 500 Errors in API Routes

If your API routes are returning 500 errors:

1. Check the Vercel logs for detailed error messages
2. Verify that your database schema matches what your code expects
3. Make sure you've run the migrations correctly

## Monitoring

To monitor your application:

1. Set up Vercel Analytics
2. Check the Vercel logs regularly
3. Consider setting up error tracking with a service like Sentry

## Local Development with Production Database

To use your production database locally (be careful!):

1. Add your production `DATABASE_URL` to your local `.env` file
2. Run your application with `npm run dev`

Remember to be cautious when connecting to production databases from local environments! 
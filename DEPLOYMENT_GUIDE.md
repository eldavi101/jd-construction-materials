# J&D Construction Materials - Production Deployment Guide

**Status**: ✅ GitHub repo ready at https://github.com/eldavi101/jd-construction-materials  
**Date**: May 12, 2026  
**Goal**: Deploy full-stack ecommerce to production in ~2 hours

---

## Phase 1: Database Setup (Neon PostgreSQL)

### 1.1 Create Neon Account
- Visit: https://neon.tech
- Sign up with email (or GitHub account)
- Verify email

### 1.2 Create PostgreSQL Database
1. Click "New Project"
2. Choose a project name: `jd-construction`
3. Choose region closest to your users (default: us-east-1)
4. Postgres version: 17 (or latest available)
5. Click "Create project"

### 1.3 Get Connection String
1. In Neon dashboard, go to "Connection strings"
2. Copy the **Pooled Connection String** (ends with `?sslmode=require`)
3. Format: `postgresql://user:password@host/dbname?sslmode=require`
4. **Save this** - you'll need it for Railway

### 1.4 Initialize Database Schema
```bash
# Clone the repo locally on your machine
git clone https://github.com/eldavi101/jd-construction-materials.git
cd jd-construction-materials

# Set environment variables
$env:DATABASE_URL = "your-neon-connection-string-here"

# Install dependencies
pnpm install

# Run migrations and seed data
cd apps/api
npx prisma migrate deploy
npx prisma db seed
```

**Expected output**: 
- Migrations applied
- Categories created (11 total)
- Sample products created (8 total)
- Admin user created: `admin@jd.com` / `AdminPass123!`

---

## Phase 2: Backend API Deployment (Railway)

### 2.1 Create Railway Account
- Visit: https://railway.app
- Sign up with GitHub account (easiest)
- Authorize Railway access to your GitHub

### 2.2 Deploy API Service
1. Go to Railway dashboard
2. Click "New" → "Deploy from GitHub repo"
3. Select `eldavi101/jd-construction-materials`
4. Choose `apps/api` as the root directory
5. Click "Deploy"

### 2.3 Configure Environment Variables
In Railway project, add these variables:

```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_ACCESS_SECRET=your-secret-key-here-min-32-chars
JWT_REFRESH_SECRET=your-secret-key-here-min-32-chars
STRIPE_SECRET_KEY=sk_test_51TW56sKozJx2LcP9...
STRIPE_WEBHOOK_SECRET=whsec_3ec52b93506b6019...
FRONTEND_URL=https://your-vercel-domain.vercel.app
PORT=3001
NODE_ENV=production
```

**Generate secure secrets:**
```bash
# Run this locally to generate random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Verify Deployment
1. Wait for build to complete (~3-5 minutes)
2. Copy the Railway public URL (e.g., `https://jd-api-prod-xxxx.railway.app`)
3. Test the API:
   ```bash
   curl https://jd-api-prod-xxxx.railway.app/api/health
   # Should return: {"status":"ok"}
   ```

**Save the Railway URL** - you'll need it for frontend configuration.

---

## Phase 3: Frontend Deployment (Vercel)

### 3.1 Create Vercel Account
- Visit: https://vercel.com
- Sign up with GitHub account
- Authorize Vercel

### 3.2 Deploy Frontend
1. Go to Vercel dashboard
2. Click "Add New..." → "Project"
3. Import `eldavi101/jd-construction-materials`
4. Framework preset: `Next.js`
5. Root directory: `apps/web`

### 3.3 Configure Environment Variables
In Vercel environment settings, add:

```
NEXT_PUBLIC_API_URL=https://jd-api-prod-xxxx.railway.app
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build (~2-3 minutes)
3. Copy the Vercel URL (e.g., `https://jd-construction-materials.vercel.app`)

**Test the frontend:**
- Visit the Vercel URL in browser
- Try to register new account
- Navigate to admin (if you're admin@jd.com)

**Save the Vercel URL** - you'll need it for GoDaddy DNS.

---

## Phase 4: Domain Configuration (GoDaddy)

### 4.1 Purchase Domain
1. Visit: https://www.godaddy.com
2. Search for domain (e.g., `jdconstructionmaterials.com`)
3. Add to cart and purchase
4. Complete checkout

### 4.2 Configure DNS Records
1. Log into GoDaddy account
2. Go to "My Products" → "Domains"
3. Click the domain name to manage it
4. Go to "DNS" tab

**Add these DNS records:**

| Type | Name | Value |
|------|------|-------|
| CNAME | www | cname.vercel-dns.com |
| A | @ | 76.76.19.21 |
| A | @ | 76.76.19.22 |
| A | @ | 76.76.19.23 |
| A | @ | 76.76.19.24 |

(Vercel's current IP addresses - check https://vercel.com/docs/concepts/projects/domains/verify-domain for latest)

### 4.3 Configure in Vercel
1. Go to Vercel project → Domains
2. Click "Add Domain"
3. Enter your domain name (e.g., `jdconstructionmaterials.com`)
4. Vercel will show you the exact DNS records needed
5. Click "Add" and Vercel will verify automatically

**Expected time to propagate**: 5-48 hours (usually 1-2 hours)

---

## Phase 5: Stripe Live Mode Setup

### 5.1 Switch Stripe to Live Mode
1. Visit: https://dashboard.stripe.com
2. Click "Test Mode" toggle in top-left (currently ON)
3. Toggle it OFF to switch to Live Mode
4. Copy your **Live Secret Key** (`sk_live_...`)
5. Copy your **Live Publishable Key** (`pk_live_...`)

### 5.2 Create Live Webhook Endpoint
1. In Stripe dashboard, go to "Webhooks"
2. Click "Add endpoint"
3. Endpoint URL: `https://jd-api-prod-xxxx.railway.app/stripe/webhook` (your Railway API URL)
4. Events to send:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click "Add endpoint"
6. Copy the **Signing Secret** (`whsec_live_...`)

### 5.3 Update Railway Environment Variables
In Railway project, update:

```
STRIPE_SECRET_KEY=sk_live_xxx...
STRIPE_WEBHOOK_SECRET=whsec_live_xxx...
```

Click "Deploy" to restart the API with new keys.

---

## Phase 6: End-to-End Testing

### 6.1 Test Customer Flow
1. Open your live domain in browser
2. Register new account
3. Browse products
4. Add items to cart
5. Checkout with test card: `4242 4242 4242 4242` (exp: any future date, CVC: any 3 digits)
6. Verify payment succeeded

### 6.2 Test Admin Panel
1. Log in as `admin@jd.com` / `AdminPass123!`
2. Navigate to `/admin/products`
3. Create a new product
4. Navigate to `/admin/inventory`
5. Adjust inventory levels
6. Navigate to `/admin/orders`
7. View recent orders from your test purchase

### 6.3 Verify Stripe Webhooks
1. In Stripe dashboard → Webhooks
2. Click on your endpoint
3. Check that events are being received (green checkmarks)
4. Click on a recent event to see the payload

---

## Phase 7: Post-Deployment Checklist

- [ ] Database migrations completed and seed data loaded
- [ ] API deployed to Railway and responding to health checks
- [ ] Frontend deployed to Vercel
- [ ] Domain DNS records configured in GoDaddy
- [ ] Domain added to Vercel project (awaiting verification if recent)
- [ ] Stripe in Live Mode with webhook endpoint configured
- [ ] Test customer purchase completed successfully
- [ ] Admin panel functional with product/inventory management
- [ ] Email confirmations working (if configured)
- [ ] Analytics/monitoring set up (optional)

---

## Common Issues & Troubleshooting

### "502 Bad Gateway" from Vercel
- **Cause**: Frontend can't reach API
- **Fix**: Check `NEXT_PUBLIC_API_URL` in Vercel is correct Railway URL
- **Fix**: Check Railway API is running (`pnpm --filter api build` passes)

### Stripe webhook not firing
- **Cause**: Webhook URL not registered or API not responding
- **Fix**: Test: `curl https://railway-url/stripe/webhook` (should return 405 if not configured)
- **Fix**: Check Railway logs for errors

### Domain not working (404/timeout)
- **Cause**: DNS propagation pending or records incorrect
- **Fix**: Wait 1-2 hours and try again
- **Fix**: Verify Vercel shows domain as "Valid"
- **Tool**: Use https://www.whatsmydns.net to check DNS propagation

### API returns 401 on login
- **Cause**: JWT secrets don't match between deployment
- **Fix**: Verify `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` match between local and Railway
- **Fix**: Restart Railway API service

### Products not showing in admin
- **Cause**: Database seed didn't run or migration failed
- **Fix**: Manually run: `npx prisma db seed` locally, then push changes
- **Fix**: Check Neon logs for migration errors

---

## Next Steps (Future Enhancements)

- [ ] Set up email notifications (SendGrid or similar)
- [ ] Enable payment retry logic for failed charges
- [ ] Set up database backups (Neon offers automated backups)
- [ ] Configure Sentry for error tracking
- [ ] Set up GitHub Actions CI/CD for automated deployments
- [ ] Enable analytics (Vercel Analytics built-in)
- [ ] Optimize Core Web Vitals (Lighthouse audits)

---

## Support Resources

- **Neon Docs**: https://neon.tech/docs
- **Railway Docs**: https://railway.app/docs
- **Vercel Docs**: https://vercel.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **NestJS Docs**: https://docs.nestjs.com

---

**Repository**: https://github.com/eldavi101/jd-construction-materials  
**Last Updated**: May 12, 2026

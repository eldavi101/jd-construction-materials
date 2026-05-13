# J&D Construction Materials - Deployment Quick Checklist

**Print this out or keep it open while deploying!**

---

## Quick Reference URLs

- Repository: https://github.com/eldavi101/jd-construction-materials
- Neon: https://neon.tech
- Railway: https://railway.app
- Vercel: https://vercel.app
- GoDaddy: https://godaddy.com
- Stripe: https://dashboard.stripe.com

---

## ⚡ Deployment Checklist (2-3 hours)

### Phase 1: Neon Database (15 min)
- [ ] Create Neon account (use GitHub login)
- [ ] Create project named `jd-construction`
- [ ] Copy pooled connection string
- [ ] Locally: Set `$env:DATABASE_URL = "..."`
- [ ] Locally: Run `cd apps/api && npx prisma migrate deploy`
- [ ] Locally: Run `npx prisma db seed`
- [ ] Verify: Check Neon dashboard shows 8 products created
- [ ] **SAVE**: Neon connection string for Railway

### Phase 2: Railway API (30 min)
- [ ] Create Railway account (use GitHub login)
- [ ] Click "New" → "Deploy from GitHub"
- [ ] Select `eldavi101/jd-construction-materials`
- [ ] Set root directory to `apps/api`
- [ ] Click "Deploy" and wait for build (~3-5 min)
- [ ] Add environment variables:
  - [ ] `DATABASE_URL` = [from Neon]
  - [ ] `JWT_ACCESS_SECRET` = [random 64 char hex]
  - [ ] `JWT_REFRESH_SECRET` = [random 64 char hex]
  - [ ] `STRIPE_SECRET_KEY` = `sk_test_51TW56sKozJx2LcP9...`
  - [ ] `STRIPE_WEBHOOK_SECRET` = `whsec_3ec52b93506b6019...`
  - [ ] `FRONTEND_URL` = [leave blank for now, update after Vercel]
  - [ ] `NODE_ENV` = `production`
- [ ] Deploy service
- [ ] Verify: Test API is responding: `curl https://[railway-url]/api/health`
- [ ] **SAVE**: Railway public URL for Vercel

### Phase 3: Vercel Frontend (20 min)
- [ ] Create Vercel account (use GitHub login)
- [ ] Click "Add New" → "Project"
- [ ] Select `eldavi101/jd-construction-materials`
- [ ] Set root directory to `apps/web`
- [ ] Framework: Next.js
- [ ] Add environment variable:
  - [ ] `NEXT_PUBLIC_API_URL` = [Railway URL]
- [ ] Click "Deploy" and wait for build (~2-3 min)
- [ ] **SAVE**: Vercel URL (e.g., `jd-construction-materials.vercel.app`)

### Phase 4: Update Railway with Vercel URL (2 min)
- [ ] Go back to Railway project
- [ ] Update env var: `FRONTEND_URL` = [Vercel URL]
- [ ] Redeploy API
- [ ] Verify API restarts successfully

### Phase 5: GoDaddy Domain (15 min)
- [ ] Go to https://godaddy.com
- [ ] Search for desired domain (e.g., `jdconstructionmaterials.com`)
- [ ] Add to cart and purchase
- [ ] Once purchased, go to "My Products" → "Domains"
- [ ] Click domain name
- [ ] Go to "DNS" tab
- [ ] Delete all existing A/CNAME records
- [ ] Add Vercel DNS records:
  - [ ] `www` CNAME → `cname.vercel-dns.com`
  - [ ] `@` A → `76.76.19.21`
  - [ ] `@` A → `76.76.19.22`
  - [ ] `@` A → `76.76.19.23`
  - [ ] `@` A → `76.76.19.24`
- [ ] Go to Vercel → Domains
- [ ] Click "Add Domain"
- [ ] Enter domain name
- [ ] Vercel verifies automatically (may take 5-48 hours, usually 1-2 hours)
- [ ] **NOTE**: Domain won't work until DNS propagates (~1-2 hours)

### Phase 6: Stripe Live Mode (15 min)
- [ ] Go to https://dashboard.stripe.com
- [ ] Click "Test Mode" toggle in top-left to turn OFF
- [ ] Copy live secret key (starts with `sk_live_`)
- [ ] Copy live webhook signing secret (starts with `whsec_live_`)
- [ ] Go back to Stripe → Webhooks
- [ ] Click "Add endpoint"
- [ ] Endpoint URL: `https://[railway-url]/stripe/webhook`
- [ ] Select events:
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
  - [ ] `charge.refunded`
- [ ] Click "Add endpoint"
- [ ] Copy signing secret
- [ ] Go to Railway → Environment variables
- [ ] Update:
  - [ ] `STRIPE_SECRET_KEY` = [live secret key]
  - [ ] `STRIPE_WEBHOOK_SECRET` = [live signing secret]
- [ ] Redeploy API

### Phase 7: End-to-End Testing (15 min)
- [ ] Open Vercel URL in browser
- [ ] Click "Register" and create test account
- [ ] Browse products
- [ ] Add item to cart
- [ ] Go to checkout
- [ ] Use card: `4242 4242 4242 4242` (exp: 12/26, CVC: 123)
- [ ] Verify payment succeeded
- [ ] Verify order appears in order history
- [ ] Log in as `admin@jd.com` / `AdminPass123!`
- [ ] Go to `/admin/orders` and verify your test order shows
- [ ] Go to `/admin/products` and verify products display
- [ ] Go to `/admin/inventory` and verify inventory levels
- [ ] Go to Stripe dashboard and verify webhook was received

---

## 🔑 Important Credentials

### Admin Test Account (Save This!)
```
Email: admin@jd.com
Password: AdminPass123!
```

### Stripe Test Card (For Phase 7 Testing)
```
Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/26)
CVC: Any 3 digits (e.g., 123)
```

### JWT Secret Generation (PowerShell)
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚨 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Frontend shows "502 Bad Gateway" | Check `NEXT_PUBLIC_API_URL` is correct Railway URL in Vercel |
| Stripe webhook not firing | Go to Railway logs and check API is running |
| Domain not working (404) | Wait for DNS propagation (check with whatsmydns.net) |
| Login returns 401 | Verify JWT_ACCESS_SECRET matches between local and Railway |
| Products not showing | Run `npx prisma db seed` locally, verify in Neon |
| Payment fails with "Invalid API Key" | Ensure Stripe keys are correct (test vs. live mode mismatch) |

---

## 📞 Support Resources

If you get stuck:
1. Check **DEPLOYMENT_GUIDE.md** for detailed step-by-step instructions
2. Check **PROJECT_STATUS.md** for technical overview
3. Vercel logs: Project Settings → Deployments → Build Logs
4. Railway logs: Deployments → Logs
5. Stripe dashboard: Developers → Webhooks (check for event delivery)

---

## ⏱️ Timing Expectations

- Neon setup: 5-10 minutes
- Railway build & deploy: 5-10 minutes
- Vercel build & deploy: 3-5 minutes
- GoDaddy DNS: 5 minutes (propagation takes 1-2 hours)
- Stripe setup: 5 minutes
- Testing: 10-15 minutes
- **Total active time**: ~40-60 minutes
- **Total elapsed time**: 2-3 hours (mostly DNS propagation)

---

## ✅ Success Indicators

You'll know everything is working when:
- [ ] API responds to health check: `curl https://[railway-url]/api/health` → `{"status":"ok"}`
- [ ] Frontend loads without 502 errors
- [ ] You can register a new account
- [ ] You can add products to cart
- [ ] You can complete checkout with test card
- [ ] Admin panel shows your test order
- [ ] Domain resolves (after DNS propagation)
- [ ] Stripe webhook has successful deliveries

---

## 🎉 Deployment Complete!

Once all checkboxes are checked, your site is live!

- Live URL: `https://[your-domain]`
- Admin URL: `https://[your-domain]/admin/products` (as admin@jd.com)
- API URL: `https://[railway-url]`
- Database: Neon PostgreSQL

**Time from this checklist to live**: ~2-3 hours ⚡

---

**Repository**: https://github.com/eldavi101/jd-construction-materials  
**Status**: ✅ Ready for production  
**Date**: May 12, 2026

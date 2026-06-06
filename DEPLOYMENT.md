# Deployment Guide

Complete guide for deploying the Notes App to Railway (backend) and Vercel (frontend).

## Prerequisites

- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- Git repository
- Railway CLI (optional): `npm i -g @railway/cli`
- Vercel CLI (optional): `npm i -g vercel`

## Backend Deployment (Railway)

### 1. Initial Setup

1. **Create Railway Project**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` directory as root

2. **Add PostgreSQL Database**
   - In your Railway project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL` environment variable

### 2. Environment Variables

Set these in Railway dashboard (Settings → Variables):

```env
# Required
SECRET_KEY=<generate-using-command-below>
ENVIRONMENT=production
DEBUG=False

# Hosts (add your Railway domain)
ALLOWED_HOSTS=.railway.app,your-custom-domain.com

# CORS (add your Vercel frontend URL)
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com

# Security (Production)
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

**Generate SECRET_KEY:**
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 3. Deploy

Railway automatically deploys on git push. For manual deployment:

```bash
railway login
railway link
railway up
```

### 4. Run Migrations

After first deployment:

```bash
railway run python manage.py migrate
railway run python manage.py createsuperuser
```

Or via Railway dashboard:
- Go to your service
- Click "Settings" → "Deploy"
- Add to start command: `python manage.py migrate && gunicorn config.wsgi --bind 0.0.0.0:$PORT`

### 5. Verify Deployment

- Check health endpoint: `https://your-app.up.railway.app/api/health/`
- Test API: `https://your-app.up.railway.app/api/auth/register/`

## Frontend Deployment (Vercel)

### 1. Initial Setup

1. **Import Project**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your Git repository
   - Select the `frontend` directory as root

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 2. Environment Variables

Set in Vercel dashboard (Settings → Environment Variables):

```env
# Required - Your Railway backend URL
VITE_API_URL=https://your-backend.up.railway.app/api

# Optional
VITE_ENV=production
```

### 3. Deploy

Vercel automatically deploys on git push. For manual deployment:

```bash
vercel login
vercel
vercel --prod
```

### 4. Update Backend CORS

After getting your Vercel URL, update Railway environment variables:

```env
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app
```

### 5. Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

**Railway:**
1. Go to Service Settings → Networking
2. Add custom domain
3. Configure DNS CNAME record

## Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with local settings
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with local backend URL
npm run dev
```

## Environment-Specific Configuration

### Development (.env)
```env
ENVIRONMENT=development
DEBUG=True
SECRET_KEY=dev-key-only
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:pass@localhost:5432/notesdb
CORS_ALLOWED_ORIGINS=http://localhost:3000
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
```

### Production (Railway/Vercel)
```env
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=<strong-random-key>
ALLOWED_HOSTS=.railway.app,yourdomain.com
DATABASE_URL=<railway-provides-this>
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
```

## Post-Deployment Tasks

### 1. Run Migrations
```bash
railway run python manage.py migrate
```

### 2. Create Superuser
```bash
railway run python manage.py createsuperuser
```

### 3. Collect Static Files (if needed)
```bash
railway run python manage.py collectstatic --noinput
```

### 4. Test Endpoints

**Health Check:**
```bash
curl https://your-backend.up.railway.app/api/health/
```

**Register User:**
```bash
curl -X POST https://your-backend.up.railway.app/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'
```

## Monitoring & Logs

### Railway
- View logs: Railway dashboard → Service → Logs
- Metrics: Railway dashboard → Service → Metrics
- CLI: `railway logs`

### Vercel
- View logs: Vercel dashboard → Deployments → [deployment] → Logs
- Analytics: Vercel dashboard → Analytics
- CLI: `vercel logs`

## Troubleshooting

### Backend Issues

**Database Connection Error:**
- Verify `DATABASE_URL` is set in Railway
- Check PostgreSQL service is running
- Verify migrations have run

**CORS Error:**
- Check `CORS_ALLOWED_ORIGINS` includes frontend URL
- Verify Vercel deployment URL is correct
- Check for trailing slashes

**Static Files Not Loading:**
- Verify WhiteNoise is in `MIDDLEWARE`
- Run `collectstatic` command
- Check `STATIC_ROOT` and `STATIC_URL` settings

### Frontend Issues

**API Connection Error:**
- Verify `VITE_API_URL` is set correctly
- Check backend is deployed and running
- Verify CORS configuration

**Build Failure:**
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

**Environment Variables Not Working:**
- Ensure variables start with `VITE_`
- Rebuild after adding new variables
- Check Vercel dashboard for correct values

## Security Checklist

Before going live:

- [ ] `DEBUG=False` in production
- [ ] Strong `SECRET_KEY` generated and set
- [ ] `ALLOWED_HOSTS` configured correctly
- [ ] HTTPS enforced (`SECURE_SSL_REDIRECT=True`)
- [ ] Secure cookies enabled
- [ ] CORS origins properly configured
- [ ] Database backups enabled (Railway automatic)
- [ ] Environment variables secured
- [ ] `.env` files not committed to git
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] SSL certificates active

## Scaling

### Railway
- Automatic scaling based on usage
- Upgrade plan for more resources
- Add replicas for high availability

### Vercel
- Automatic edge caching
- Serverless functions scale automatically
- Upgrade plan for more bandwidth

## Backup & Recovery

### Database (Railway)
- Automatic daily backups
- Point-in-time recovery available
- Export database: `railway run pg_dump`

### Code
- Git repository is source of truth
- Tag releases: `git tag v1.0.0`
- Keep production branch stable

## Cost Optimization

### Railway
- Free tier: $5 credit/month
- Optimize database queries
- Use connection pooling
- Monitor resource usage

### Vercel
- Free tier: Generous limits
- Optimize bundle size
- Use edge caching
- Monitor bandwidth usage

## Support

- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- Django: https://docs.djangoproject.com
- React: https://react.dev

## Next Steps

After successful deployment:

1. Set up custom domain
2. Configure monitoring/alerting
3. Set up CI/CD pipeline
4. Implement backup strategy
5. Plan for scaling
6. Regular security updates

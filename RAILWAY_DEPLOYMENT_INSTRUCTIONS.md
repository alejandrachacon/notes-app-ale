# Railway Deployment Instructions - Django Backend

## Project Structure
This is a monorepo with the following structure:
```
notes-app-ale/              # Root directory
├── backend/                # Django backend (deploy this to Railway)
│   ├── apps/
│   ├── config/
│   ├── manage.py
│   ├── requirements.txt
│   ├── railway.toml
│   └── ...
├── frontend/               # Next.js app (deployed to Vercel)
└── ...
```

## Railway Dashboard Configuration

### 1. Create New Project
- Go to Railway Dashboard
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your `notes-app-ale` repository

### 2. Configure Project Settings

**Root Directory:**
- **CRITICAL:** Set to `backend`
- Location: Project Settings → Service Settings → Root Directory
- This tells Railway to treat the `backend/` folder as the project root

**Build Settings:**
- Builder: Nixpacks (auto-detected)
- Build Command: (leave empty - auto-detected)
- Start Command: (configured in `railway.toml`)

### 3. Add PostgreSQL Database

**Create Database Service:**
- In your project, click "New" → "Database" → "Add PostgreSQL"
- Railway will automatically create a PostgreSQL instance
- The `DATABASE_URL` environment variable will be auto-populated

**Database Configuration:**
- Railway automatically links the database to your service
- No manual connection string needed
- Database credentials are managed by Railway

### 4. Configure Environment Variables

**Required Variables:**

```bash
# Django Settings
SECRET_KEY=your-secret-key-here-generate-a-long-random-string
DEBUG=False
DJANGO_SETTINGS_MODULE=config.settings
ALLOWED_HOSTS=your-app-name.up.railway.app

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://your-frontend-vercel-app.vercel.app
CORS_ALLOW_CREDENTIALS=True

# Database (auto-populated by Railway)
DATABASE_URL=postgresql://... (automatically set by Railway)

# Security (optional but recommended)
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

**How to Add Variables:**
1. Go to your service in Railway
2. Click "Variables" tab
3. Add each variable with its value
4. Click "Add" for each one

**Generate SECRET_KEY:**
```python
# Run this in Python to generate a secure secret key
import secrets
print(secrets.token_urlsafe(50))
```

### 5. Configure Custom Domain (Optional)

**Railway Domain:**
- Railway provides: `your-app-name.up.railway.app`
- Update `ALLOWED_HOSTS` with this domain

**Custom Domain:**
1. Go to Settings → Domains
2. Click "Generate Domain" or "Custom Domain"
3. Update `ALLOWED_HOSTS` to include your custom domain

### 6. Deploy

**Initial Deployment:**
- Railway will automatically deploy when you push to your main branch
- Monitor deployment in the "Deployments" tab
- Check logs for any errors

**Deployment Process:**
1. Railway detects Python project
2. Installs dependencies from `requirements.txt`
3. Runs database migrations (`python manage.py migrate`)
4. Starts Gunicorn server
5. Health check at `/api/health/`

## Configuration Files

### railway.toml
Located at: `backend/railway.toml`

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "python manage.py migrate && gunicorn config.wsgi --bind 0.0.0.0:$PORT"
healthcheckPath = "/api/health/"
healthcheckTimeout = 100
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10
```

**Features:**
- Automatic database migrations on deploy
- Health check endpoint monitoring
- Automatic restart on failure
- Up to 10 retry attempts

### requirements.txt
Located at: `backend/requirements.txt`

Includes all necessary dependencies:
- Django 5.0
- Django REST Framework
- PostgreSQL driver (psycopg2-binary)
- Gunicorn (WSGI server)
- CORS headers
- JWT authentication
- Security packages

## Health Check Endpoint

**Endpoint:** `/api/health/`
**Method:** GET
**Response:**
```json
{
  "status": "healthy",
  "message": "Notes API is running"
}
```

**Purpose:**
- Railway uses this to monitor service health
- Automatic restarts if health check fails
- Configured in `railway.toml`

## Database Migrations

**Automatic Migrations:**
- Migrations run automatically on each deployment
- Configured in `railway.toml` start command
- Runs before Gunicorn starts

**Manual Migrations (if needed):**
```bash
# In Railway CLI or dashboard terminal
python manage.py migrate
python manage.py makemigrations
python manage.py createsuperuser
```

## Static Files

**Configuration:**
- Whitenoise is configured in `requirements.txt`
- Serves static files without separate server
- Automatic collection on deployment

**Collect Static Files (if needed):**
```bash
python manage.py collectstatic --noinput
```

## CORS Configuration

**Frontend Integration:**
- Update `CORS_ALLOWED_ORIGINS` with your Vercel frontend URL
- Example: `https://your-app.vercel.app`
- Multiple origins can be comma-separated

**Settings Location:**
- `backend/config/settings.py`
- CORS middleware is already configured

## Monitoring and Logs

**View Logs:**
1. Go to your service in Railway
2. Click "Deployments" tab
3. Click on a deployment to view logs
4. Real-time log streaming available

**Common Log Checks:**
- Database connection success
- Migration completion
- Gunicorn startup
- Health check responses

## Troubleshooting

### Build Fails
**Check:**
- Root Directory is set to `backend`
- `requirements.txt` has all dependencies
- Python version compatibility

### Database Connection Fails
**Check:**
- PostgreSQL service is running
- `DATABASE_URL` is set (auto-populated)
- Database migrations completed

### CORS Errors
**Check:**
- `CORS_ALLOWED_ORIGINS` includes frontend URL
- Frontend URL is correct (https, not http)
- No trailing slash in origin URL

### Health Check Fails
**Check:**
- `/api/health/` endpoint is accessible
- Django server is running
- No errors in application logs

### Static Files Not Loading
**Check:**
- Whitenoise is in `INSTALLED_APPS`
- `STATIC_ROOT` is configured
- `collectstatic` ran successfully

## Re-deployment

**Automatic:**
- Push to main branch triggers deployment
- Railway pulls latest code
- Runs migrations and restarts

**Manual:**
- Go to Deployments tab
- Click "Deploy" button
- Select branch to deploy

## Environment-Specific Settings

**Production Checklist:**
- ✅ `DEBUG=False`
- ✅ `SECRET_KEY` is unique and secure
- ✅ `ALLOWED_HOSTS` configured
- ✅ Database backups enabled
- ✅ HTTPS enforced
- ✅ CORS properly configured
- ✅ Rate limiting enabled

## API Endpoints

Once deployed, your API will be available at:
- Base URL: `https://your-app-name.up.railway.app/api/`
- Health: `https://your-app-name.up.railway.app/api/health/`
- Auth: `https://your-app-name.up.railway.app/api/auth/`
- Notes: `https://your-app-name.up.railway.app/api/notes/`

## Connecting Frontend to Backend

**Update Frontend Environment Variable:**
In Vercel, set:
```bash
NEXT_PUBLIC_API_URL=https://your-app-name.up.railway.app/api
```

**Update Backend CORS:**
In Railway, set:
```bash
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

## Security Notes

**Configured Security Features:**
- HTTPS enforcement
- Secure cookies
- CSRF protection
- XSS protection
- Rate limiting
- SQL injection protection (Django ORM)
- Input sanitization (bleach)

**Environment Variables:**
- Never commit `.env` files
- Use Railway's environment variables
- Rotate `SECRET_KEY` periodically
- Keep `DATABASE_URL` private

## Support

**Railway Documentation:**
- https://docs.railway.app/

**Django Documentation:**
- https://docs.djangoproject.com/

**Project Issues:**
- Check deployment logs first
- Verify environment variables
- Test health endpoint
- Review CORS configuration

# Vercel Deployment Instructions

## Project Structure
This is a monorepo with the following structure:
```
notes-app-ale/              # Root directory
├── backend/                # Django backend (not deployed to Vercel)
├── frontend/               # Next.js app (deploy this to Vercel)
│   ├── src/
│   ├── package.json
│   ├── vercel.json
│   └── ...
└── ...
```

## Vercel Dashboard Configuration

When deploying to Vercel, configure the following settings:

### 1. Import Project
- Connect your Git repository (GitHub/GitLab/Bitbucket)
- Select the `notes-app-ale` repository

### 2. Configure Project Settings

**Framework Preset:**
- Framework: `Next.js` (should auto-detect)

**Root Directory:**
- **IMPORTANT:** Set to `frontend`
- This tells Vercel to treat the `frontend/` folder as the project root

**Build & Development Settings:**
- Build Command: (leave empty - auto-detected as `npm run build`)
- Output Directory: (leave empty - auto-detected as `.next`)
- Install Command: (leave empty - auto-detected as `npm install`)

**Environment Variables:**
Add the following environment variable:
- `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://your-backend-url.com/api`)

### 3. Deploy
- Click "Deploy"
- Vercel will automatically:
  - Detect Next.js from `package.json`
  - Run `npm install` in the `frontend/` directory
  - Run `next build`
  - Deploy the application

## Landing Page
The application is configured to show `/register` as the landing page:
- Root route (`/`) redirects to `/register` (configured in `frontend/src/app/page.tsx`)
- Users will see the registration/login page first

## Security Headers
Security headers are configured in `frontend/vercel.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

## Troubleshooting

### Build Fails
- Verify "Root Directory" is set to `frontend`
- Check that `NEXT_PUBLIC_API_URL` environment variable is set
- Review build logs for specific errors

### Wrong Page Shows
- Confirm `frontend/src/app/page.tsx` contains redirect to `/register`
- Clear browser cache and try again

### API Calls Fail
- Verify `NEXT_PUBLIC_API_URL` environment variable is correct
- Check CORS settings on backend
- Ensure backend is accessible from Vercel's servers

## Re-deployment
Any push to your main branch will trigger automatic redeployment on Vercel.

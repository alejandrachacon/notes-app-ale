# Security Policy

## Overview

This document outlines the security measures implemented in the Notes App and provides guidelines for secure deployment and usage.

## Security Features

### 1. Authentication & Authorization

- **JWT-based Authentication**: Secure token-based authentication using `djangorestframework-simplejwt`
- **Token Blacklisting**: Refresh tokens are blacklisted on logout and rotation
- **Token Rotation**: Refresh tokens are rotated on each use
- **Short-lived Access Tokens**: 15-minute expiration for access tokens
- **Password Requirements**: Minimum 12 characters with complexity validation

### 2. Rate Limiting

Protection against brute force attacks:
- **Login**: 5 attempts per 15 minutes per IP
- **Registration**: 3 attempts per hour per IP
- **API Endpoints**: Protected by authentication

### 3. Input Validation & Sanitization

- **Email Normalization**: Emails are lowercased and trimmed
- **HTML Sanitization**: Note content is sanitized using `bleach` library
- **Length Limits**: 
  - Title: 200 characters max
  - Content: 10,000 characters max
  - Email: 254 characters max
- **XSS Protection**: Dangerous HTML/JavaScript stripped from user input

### 4. HTTPS & Transport Security

**Production Only:**
- HTTPS enforcement via `SECURE_SSL_REDIRECT`
- Strict Transport Security (HSTS) with 1-year max-age
- Secure cookies (httpOnly, secure flags)
- CSRF protection enabled

### 5. Security Headers

**Backend (Django):**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- Content Security Policy (CSP)

**Frontend (Vercel):**
- Same security headers via `vercel.json`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` for camera/microphone/geolocation

### 6. CORS Configuration

- Environment-based CORS origins
- Credentials allowed for authenticated requests
- Vercel preview deployment support via regex patterns

### 7. Database Security

- Connection pooling with `conn_max_age=600`
- Parameterized queries via Django ORM
- PostgreSQL with SSL in production (Railway)

### 8. Request Size Limits

- Maximum upload size: 5MB
- Prevents DoS attacks via large payloads

## Environment Configuration

### Development

```env
ENVIRONMENT=development
DEBUG=True
SECRET_KEY=dev-key-not-for-production
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
```

### Production

```env
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=<strong-random-key>
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
ALLOWED_HOSTS=.railway.app,yourdomain.com
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

## Deployment Security

### Railway (Backend)

1. **Environment Variables**: Set via Railway dashboard
2. **Database**: Use Railway PostgreSQL with SSL
3. **Secrets**: Never commit `.env` files
4. **Migrations**: Run `railway run python manage.py migrate`
5. **HTTPS**: Automatic SSL certificate

### Vercel (Frontend)

1. **Environment Variables**: Set via Vercel dashboard
2. **Build**: Automatic on git push
3. **HTTPS**: Automatic SSL certificate
4. **Security Headers**: Configured in `vercel.json`

## Security Checklist

Before deploying to production:

- [ ] Generate strong `SECRET_KEY` (use `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`)
- [ ] Set `DEBUG=False`
- [ ] Set `ENVIRONMENT=production`
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Configure `CORS_ALLOWED_ORIGINS` with frontend URL
- [ ] Enable all security settings in `.env`
- [ ] Run database migrations
- [ ] Verify `.gitignore` excludes `.env` files
- [ ] Test rate limiting
- [ ] Verify HTTPS enforcement
- [ ] Check security headers with online scanner
- [ ] Review and rotate secrets regularly

## Reporting Security Issues

If you discover a security vulnerability, please email the maintainers directly. Do not create public GitHub issues for security vulnerabilities.

## Security Updates

- Keep dependencies updated: `pip install -U -r requirements.txt`
- Monitor Django security releases
- Review Railway/Vercel security advisories
- Update tokens and secrets periodically

## Password Policy

- Minimum 12 characters
- Cannot be entirely numeric
- Cannot be too similar to username/email
- Cannot be a commonly used password
- Must pass Django's password validators

## Token Lifecycle

1. **Login**: User receives access token (15 min) and refresh token (7 days)
2. **API Requests**: Access token sent in `Authorization: Bearer <token>` header
3. **Token Refresh**: Use refresh token to get new access token
4. **Logout**: Refresh token is blacklisted
5. **Rotation**: Old refresh token is blacklisted when new one is issued

## Best Practices

### For Developers

1. Never commit `.env` files or secrets
2. Use environment variables for all sensitive data
3. Keep dependencies updated
4. Run security audits regularly
5. Use HTTPS in all environments except local development
6. Validate and sanitize all user input
7. Follow principle of least privilege

### For Users

1. Use strong, unique passwords
2. Enable 2FA if available (future feature)
3. Don't share authentication tokens
4. Log out when finished
5. Report suspicious activity

## Compliance

This application implements security best practices based on:

- OWASP Top 10
- Django Security Guidelines
- REST API Security Best Practices
- GDPR considerations for user data

## License

This security policy is part of the Notes App project and follows the same license (MIT).

## Last Updated

June 2026

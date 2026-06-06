# Notes App - Backend API

Django REST Framework backend for the Notes App with JWT authentication.

## Features

- User registration and authentication with JWT tokens
- CRUD operations for notes
- User-specific note isolation
- PostgreSQL database
- Comprehensive test coverage

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `POST /api/auth/token/refresh/` - Refresh access token

### Notes
- `GET /api/notes/` - List all user notes
- `POST /api/notes/` - Create new note
- `GET /api/notes/{id}/` - Retrieve specific note
- `PUT /api/notes/{id}/` - Update note
- `PATCH /api/notes/{id}/` - Partial update note
- `DELETE /api/notes/{id}/` - Delete note

### Health
- `GET /api/health/` - Health check

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt  # For development
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration

5. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create superuser (optional):
```bash
python manage.py createsuperuser
```

7. Run development server:
```bash
python manage.py runserver
```

## Testing

Run tests with pytest:
```bash
pytest
```

Run with coverage:
```bash
pytest --cov=apps --cov-report=html
```

## Deployment

This app is configured for Railway deployment. See `railway.toml` for configuration.

# Notes App

A full-stack notes application with Django REST Framework backend and React frontend.

# App Link

https://notes-app-ale.vercel.app/register

# Video

<div style="position: relative; padding-bottom: 64.74820143884892%; height: 0;"><iframe src="https://www.loom.com/embed/1dc629e0da0b40c0a92e2da9e0e02bfd" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

## Features

- **User Authentication**: JWT-based authentication with register, login, and token refresh
- **Notes Management**: Full CRUD operations for notes
- **User Isolation**: Users can only access their own notes
- **Modern UI**: Beautiful, responsive interface with TailwindCSS and shadcn/ui
- **Comprehensive Testing**: Backend tests with pytest
- **Production Ready**: Configured for Railway deployment

## Tech Stack

### Backend
- Django 5.0
- Django REST Framework
- PostgreSQL
- JWT Authentication (djangorestframework-simplejwt)
- pytest for testing

### Frontend
- React 18 with TypeScript
- Vite
- TailwindCSS
- shadcn/ui components
- React Router
- Axios

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create superuser (optional):
```bash
python manage.py createsuperuser
```

6. Run development server:
```bash
python manage.py runserver
```

Backend will be available at http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Run development server:
```bash
npm run dev
```

Frontend will be available at http://localhost:3000

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

## Testing

Run backend tests:
```bash
cd backend
pytest
```

Run with coverage:
```bash
pytest --cov=apps --cov-report=html
```

## Deployment

This application is configured for Railway deployment. See `backend/railway.toml` for configuration.

## Project Structure

```
notes-app-ale/
├── backend/
│   ├── apps/
│   │   ├── authentication/  # User authentication
│   │   ├── notes/          # Notes CRUD
│   │   └── health/         # Health check
│   ├── config/             # Django settings
│   ├── tests/              # Test suite
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   └── package.json
└── README.md
```

## License

MIT

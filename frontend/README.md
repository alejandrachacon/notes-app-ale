# Notes App - Frontend

Modern React frontend for the Notes App with TypeScript, TailwindCSS, and shadcn/ui.

## Features

- User authentication (login/register)
- Create, read, update, and delete notes
- Modern, responsive UI
- Real-time form validation
- Toast notifications
- Protected routes

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL (default: http://localhost:8000/api)

4. Run development server:
```bash
npm run dev
```

The app will be available at http://localhost:3002

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx  # Authentication context
├── hooks/
│   └── use-toast.ts     # Toast hook
├── lib/
│   └── utils.ts         # Utility functions
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── NotesPage.tsx
├── services/
│   └── api.ts           # API service
├── App.tsx
├── main.tsx
└── index.css
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

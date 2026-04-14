# Secure Cloud Landing Zone Dashboard

A Next.js dashboard for monitoring and managing a secure AWS cloud landing zone.

## Features

- Real-time security monitoring
- Compliance framework tracking
- Automated remediation
- Interactive architecture visualization
- Security violation management

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

### Backend

The dashboard now proxies all `/api/*` requests to the backend API on `http://localhost:3001`.

For production deployments, set `BACKEND_API_URL` (or `API_TARGET`) in the dashboard service environment to your backend URL, for example:

```env
BACKEND_API_URL=https://project-backend-hsij.onrender.com
```

Do not use `NEXT_PUBLIC_API_URL` for this value because that exposes the backend URL to the browser and can trigger CORS errors.

To run the standalone backend:
```bash
cd ../backend
npm install
npm start
```

The backend runs on port 3001.

## Project Structure

- `app/` - Next.js app router pages
- `components/` - React components
- `lib/` - Utilities and store
- `next.config.ts` - `api` proxy rewrites to backend

## Technologies

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Recharts
- Framer Motion

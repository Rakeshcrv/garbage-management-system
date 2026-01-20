# Garbage Management System

A full-stack web application for managing garbage pickup requests with role-based authentication.

## Features

- **Authentication**: JWT-based login with role-based access (Admin, Worker, Citizen)
- **Citizen Module**: Submit pickup requests, view request status
- **Worker Module**: View assigned requests, update status, view daily routes
- **Admin Module**: Dashboard with statistics, assign workers, manage users

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT

## Setup Instructions

1. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

2. **Set up the database**:
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   cd ..
   ```

3. **Start the development servers**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## Demo Accounts

- **Admin**: admin@example.com / admin123
- **Worker**: worker@example.com / worker123
- **Citizen**: citizen@example.com / citizen123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Pickup Requests
- `GET /api/pickup-requests` - Get requests (filtered by role)
- `POST /api/pickup-requests` - Create request (Citizen only)
- `PATCH /api/pickup-requests/:id/status` - Update status (Worker only)
- `PATCH /api/pickup-requests/:id/assign` - Assign worker (Admin only)
- `GET /api/pickup-requests/stats` - Get statistics (Admin only)

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
├── .env.example
└── README.md
```
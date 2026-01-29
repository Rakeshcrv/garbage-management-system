# 🗑️ Garbage Management System

A modern full-stack web application for efficient garbage collection management with role-based authentication, real-time tracking, and intelligent worker assignment.

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Clone and install dependencies
git clone <repository-url>
cd BInCode
npm run install:all

# 2. Setup database
cd backend
npx prisma db seed
cd ..

# 3. Start both servers
npm run dev

# 4. Access the app
# Frontend: http://localhost:5173
# Backend: http://localhost:5001
```

**Demo Accounts:**
- **Admin**: `admin@example.com` / `admin123`
- **Workers**: `worker1@example.com` / `password` (workers 1-5 available)
- **Citizen**: `citizen@example.com` / `password`

---

## 🏗️ Project Overview

This system streamlines garbage collection by connecting citizens, workers, and administrators through a unified platform. Citizens report garbage issues, administrators assign tasks, and workers execute collections with real-time status updates.

### 🔄 Status Workflow
```
REPORTED → ASSIGNED → IN_PROGRESS → COMPLETED
    ↓
REJECTED
```

---

## ✨ Features

### 🏠 Citizen Portal
- **Photo Reporting**: Upload garbage photos with GPS location
- **Request Tracking**: Monitor collection status in real-time
- **Timeline View**: Complete history of request processing
- **Mobile-Friendly**: Responsive design for all devices

### 👷 Worker Dashboard
- **Task Management**: View assigned collection tasks
- **Status Updates**: Mark tasks as in-progress or completed
- **Route Optimization**: See all tasks on a map view
- **Workload Tracking**: Monitor personal performance metrics

### 🎛️ Admin Control Panel
- **Request Management**: Approve/reject/assign garbage reports
- **Worker Assignment**: Smart workload balancing
- **User Management**: Create and manage worker accounts
- **Analytics Dashboard**: Real-time statistics and insights
- **Detailed Reports**: Comprehensive timeline and status tracking

### 🤖 Smart Assignment System
- **Workload Balancing**: Assigns tasks to least-loaded workers
- **Capacity Management**: Prevents worker overloading
- **Real-time Updates**: Instant status synchronization
- **Decision Logging**: Transparent assignment reasoning

---

## 👥 User Roles & Permissions

| Role | Permissions | Features |
|------|-------------|----------|
| **Admin** | Full system access | ✅ Approve/reject requests<br>✅ Assign workers<br>✅ Manage users<br>✅ View analytics |
| **Worker** | Task management | ✅ View assigned tasks<br>✅ Update task status<br>✅ View collection history<br>✅ Performance metrics |
| **Citizen** | Request submission | ✅ Submit garbage reports<br>✅ Track request status<br>✅ View request history<br>✅ Photo uploads |

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Detailed Setup

1. **Install Dependencies**
   ```bash
   # Install all dependencies at once
   npm run install:all
   
   # Or install separately
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy environment file
   cp backend/.env.example backend/.env
   
   # Edit backend/.env with your settings
   JWT_SECRET=your-secret-key
   DATABASE_URL="file:./dev.db"
   ```

3. **Database Setup**
   ```bash
   cd backend
   npx prisma db push    # Create database
   npx prisma db seed    # Populate with sample data
   cd ..
   ```

4. **Start Development Servers**
   ```bash
   # Method 1: Both servers together (recommended)
   npm run dev
   
   # Method 2: Separate terminals
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend  
   cd frontend && npm run dev
   ```

### Development Workflow
- **Frontend**: React + Vite with hot reload on port 5173
- **Backend**: Express.js with nodemon on port 5001
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens with automatic refresh

---

## 🔧 Troubleshooting

### Common Issues & Solutions

| Problem | Cause | Solution |
|---------|-------|----------|
| **ECONNREFUSED error** | Backend not running | `cd backend && npm run dev` |
| **Port already in use** | Previous session didn't close properly | `lsof -ti:5001 \| xargs kill -9` |
| **Database errors** | Database not synced | `cd backend && npx prisma db push` |
| **Authentication fails** | JWT secret missing | Check backend/.env file |
| **Frontend won't load** | Proxy configuration issue | Verify vite.config.js settings |

### Emergency Commands

```bash
# Kill all processes and restart fresh
lsof -ti:5001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
cd backend && npm run dev

# Reset database
cd backend && rm -f dev.db && npx prisma db push && npx prisma db seed

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Tips

1. **Check Backend Status**: Look for "Server running on port 5001"
2. **Check Browser Console**: Look for ECONNREFUSED errors
3. **Verify Network Tab**: API calls should show green (200) status
4. **Check Terminal Logs**: Backend errors show detailed stack traces

---

## 📡 API Documentation

### Authentication
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Garbage Reports
```http
# Get all reports (Admin)
GET /api/garbage-reports
Authorization: Bearer <token>

# Submit report (Citizen)
POST /api/garbage-reports
Content-Type: multipart/form-data
Authorization: Bearer <token>

# Approve/Assign report (Admin)
PUT /api/garbage-reports/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "action": "approve",
  "workerId": 5
}
```

### Tasks
```http
# Get worker tasks
GET /api/tasks
Authorization: Bearer <token>

# Update task status
PUT /api/tasks/:id/collect
Content-Type: application/json
Authorization: Bearer <token>

{
  "action": "start"  // or "complete"
}
```

### Users (Admin Only)
```http
GET /api/users              # Get all users
POST /api/users             # Create user
PUT /api/users/:id          # Update user
DELETE /api/users/:id       # Delete user
```

### Workload Management
```http
GET /api/workload/stats     # Worker statistics
GET /api/workload/best-available  # Find best worker for assignment
```

---

## 🗄️ Database Schema

### Core Models

```prisma
model User {
  id          Int       @id @default(autoincrement())
  email       String    @unique
  name        String
  role        Role      @default(CITIZEN)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  profileImage String?
  assignedReports GarbageReport[]
  workerProfile Worker?
}

model GarbageReport {
  id              Int       @id @default(autoincrement())
  citizenId       Int
  imagePath       String
  latitude        Float
  longitude       Float
  status          ReportStatus @default(REPORTED)
  statusHistory   String?   // JSON array of status changes
  assignedWorkerId Int?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  preferredDate   DateTime?
  address         String?
  notes           String?
  adminNotes      String?
  citizen         User      @relation(fields: [citizenId], references: [id])
  assignedWorker  User?     @relation(fields: [assignedWorkerId], references: [id])
  tasks           Task[]
}

model Task {
  id              Int       @id @default(autoincrement())
  garbageReportId Int
  workerId        Int
  latitude        Float
  longitude       Float
  scheduledTime   DateTime
  status          TaskStatus @default(ASSIGNED)
  statusHistory   String?   // JSON array of status changes
  completedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  garbageReport   GarbageReport @relation(fields: [garbageReportId], references: [id])
  worker          Worker     @relation(fields: [workerId], references: [id])
}

model Worker {
  id    Int    @id @default(autoincrement())
  userId Int   @unique
  user  User   @relation(fields: [userId], references: [id])
  tasks Task[]
}
```

### Status Enums

```prisma
enum Role {
  ADMIN
  WORKER
  CITIZEN
}

enum ReportStatus {
  REPORTED
  APPROVED
  ASSIGNED
  IN_PROGRESS
  COMPLETED
  REJECTED
}

enum TaskStatus {
  ASSIGNED
  IN_PROGRESS
  COMPLETED
}
```

---

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   JWT_SECRET=your-production-secret
   DATABASE_URL=your-production-database-url
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Start Production Server**
   ```bash
   cd backend
   npm start
   ```

### Docker Deployment (Optional)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m "Add feature description"`
5. Push to branch: `git push origin feature-name`
6. Submit a pull request

### Code Style Guidelines
- Use ES6+ syntax
- Follow React best practices
- Write meaningful commit messages
- Test all functionality before submitting

---

## 📁 Project Structure

```
BInCode/
├── 📂 backend/
│   ├── 📂 prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Sample data
│   ├── 📂 src/
│   │   ├── 📂 routes/         # API endpoints
│   │   ├── 📂 middleware/     # Auth & validation
│   │   └── server.js          # Express server
│   └── 📄 package.json
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/     # Reusable UI components
│   │   ├── 📂 pages/          # Page components
│   │   ├── 📂 utils/          # Helper functions
│   │   └── 📄 App.jsx         # Main app component
│   └── 📄 package.json
├── 📄 .env.example            # Environment template
└── 📄 README.md               # This file
```

---

## 🎯 Future Enhancements

- [ ] 📱 Mobile app development
- [ ] 🗺️ Advanced route optimization
- [ ] 📊 Predictive analytics dashboard
- [ ] 🔔 Push notifications for status updates
- [ ] 🌍 Multi-language support
- [ ] 💳 Payment integration for premium services
- [ ] 📈 Performance analytics and reporting
- [ ] 🤖 Enhanced AI assignment algorithms

---

## 📞 Support


If you encounter any issues or have questions:

1. **Check the troubleshooting section** above
2. **Review the API documentation** for endpoint usage
3. **Search existing issues** in the repository
4. **Create a new issue** with detailed error information
5. **Contact directly**: sanjaycs483@gmail.com

---

**Built with ❤️ using React, Node.js, and Prisma**
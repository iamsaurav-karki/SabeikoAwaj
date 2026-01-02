# सबैको आवाज (Sabeiko Awaj) - E-Governance Platform

A comprehensive Nepali e-governance platform that allows citizens to submit complaints, suggestions, and opinions to government departments. Built with modern web technologies and designed for production use.

![Platform](https://img.shields.io/badge/Platform-E--Governance-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-19+-blue)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Docker Setup](#docker-setup)
- [Manual Setup](#manual-setup)
- [Admin Setup](#admin-setup)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Sabeiko Awaj (सबैको आवाज) is a citizen engagement platform that bridges the gap between citizens and government. It enables:

- **Citizens** to submit complaints, suggestions, and opinions
- **Anonymous submissions** for sensitive issues
- **Public browsing** of submissions with upvoting
- **Status tracking** for registered users
- **Admin management** of all submissions

## ✨ Features

### For Citizens
- ✅ **Submit Complaints/Suggestions/Opinions** with department categorization
- ✅ **Anonymous Submission** option for privacy
- ✅ **User Dashboard** with pagination to track all submissions
- ✅ **Browse Public Submissions** with filtering and upvoting
- ✅ **Real-time Status Updates** (pending, in progress, resolved)
- ✅ **Search Functionality** to find relevant submissions
- ✅ **Contact Information** for government departments

### For Administrators
- ✅ **Admin Dashboard** with advanced filtering and pagination
- ✅ **Manage Submissions** (view, edit, delete, assign)
- ✅ **Update Status** (pending → in progress → resolved)
- ✅ **Assign Departments** to submissions
- ✅ **Statistics Dashboard** with analytics
- ✅ **Search & Filter** by status, department, or keywords
- ✅ **Bulk Operations** ready architecture

### Platform Features
- ✅ **Modern UI/UX** with professional design
- ✅ **Responsive Design** works on all devices
- ✅ **JWT Authentication** for secure access
- ✅ **Role-based Access Control** (Admin vs Citizen)
- ✅ **Data Visualization** with charts and graphs
- ✅ **Nepali Language Support** in UI
- ✅ **Production Ready** with Docker support

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **Nginx** - Web server (production)

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js 5** - Web framework
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **UUID** - Unique identifiers

### Database
- **ScyllaDB** - NoSQL database (Cassandra-compatible)
- **Cassandra Driver** - Database client

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving

## 📁 Project Structure

```
SabeikoAwaj/
├── client/                      # React Frontend
│   ├── public/                  # Static assets
│   │   ├── Flag_of_Nepal.png   # Nepali flag
│   │   └── nepal*.jpg          # Background images
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminLoginForm.js
│   │   │   ├── BrowseSubmissions.js
│   │   │   ├── ContactForm.js
│   │   │   ├── LoginForm.js
│   │   │   ├── RegisterForm.js
│   │   │   ├── SubmissionForm.js
│   │   │   ├── SubmissionCharts.js
│   │   │   └── UserDashboard.js
│   │   ├── App.js              # Main application
│   │   ├── App.css             # Styles
│   │   └── index.js            # Entry point
│   ├── Dockerfile              # Frontend Docker image
│   ├── nginx.conf              # Nginx configuration
│   └── package.json
│
├── server/                      # Node.js Backend
│   ├── controllers/            # Route controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── contactController.js
│   │   ├── submissionController.js
│   │   └── voteController.js
│   ├── db/
│   │   └── scylla.js           # Database connection
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── models/                  # Database models
│   │   ├── contact.js
│   │   ├── initTables.js       # Table initialization
│   │   ├── submission.js
│   │   ├── user.js
│   │   └── vote.js
│   ├── routes/                  # API routes
│   │   ├── admin.js
│   │   ├── contact.js
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── submissions.js
│   │   └── submit.js
│   ├── scripts/
│   │   └── createAdmin.js      # Admin user creation script
│   ├── Dockerfile               # Backend Docker image
│   ├── index.js                 # Server entry point
│   ├── package.json
│   └── .env                     # Environment variables
│
├── docker-compose.yml           # Docker Compose configuration
├── .dockerignore                # Docker ignore patterns
└── README.md                    # This file
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)

The easiest way to get started:

```bash
# 1. Clone the repository
git clone <repository-url>
cd SabeikoAwaj

# 2. Set up environment variables
cd server
cp .env.example .env  # Or create .env manually
# Edit .env with your configuration

# 3. Start all services
cd ..
docker-compose up -d --build

# 4. Initialize database (first time only)
docker-compose exec backend node models/initTables.js

# 5. Create admin user (optional)
docker-compose exec backend npm run create-admin

# 6. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Option 2: Manual Setup

See [Manual Setup](#manual-setup) section below.

## 🐳 Docker Setup

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Services

The `docker-compose.yml` includes three services:

1. **ScyllaDB** (Database)
   - Port: `9042`
   - Volume: `scylla-data` (persistent)
   - Health check enabled

2. **Backend** (Node.js API)
   - Port: `5000`
   - Auto-initializes tables on startup
   - Depends on ScyllaDB

3. **Frontend** (React + Nginx)
   - Port: `3000` (mapped to Nginx port 80)
   - Multi-stage build
   - Optimized for production

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild services
docker-compose up -d --build

# Execute commands
docker-compose exec backend sh
docker-compose exec backend node scripts/createAdmin.js

# Clean start (removes volumes)
docker-compose down -v
docker-compose up -d --build
```

### Environment Variables for Docker

Create `.env` in `server/` directory:

```env
DB_HOST=scylladb
DB_KEYSPACE=sabeiko_awaj
DB_DATACENTER=datacenter1
JWT_SECRET=your-secure-secret-key-here
PORT=5000
```

## 📝 Manual Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- ScyllaDB (or use Docker for ScyllaDB only)

### Step 1: Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Step 2: Set Up Database

**Option A: Using Docker for ScyllaDB only**
```bash
docker-compose up -d scylladb
```

**Option B: Install ScyllaDB locally**
- Follow [ScyllaDB installation guide](https://www.scylladb.com/download/)

### Step 3: Configure Environment

Create `server/.env`:
```env
DB_HOST=127.0.0.1
DB_KEYSPACE=sabeiko_awaj
DB_DATACENTER=datacenter1
JWT_SECRET=your-secret-key-here
PORT=5000
```

### Step 4: Initialize Database

```bash
cd server
node models/initTables.js
```

### Step 5: Start Servers

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### Step 6: Access Application

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 👤 Admin Setup

### Creating an Admin User

**Method 1: Using Script (Recommended)**

```bash
cd server
npm run create-admin
# Or
node scripts/createAdmin.js
```

Follow the prompts to enter:
- Admin name
- Admin email
- Admin password

**Method 2: Manual Database Insert**

```cql
-- Connect to ScyllaDB
cqlsh

-- Insert admin user (password must be bcrypt hashed)
INSERT INTO users (id, name, email, password, role) 
VALUES (uuid(), 'Admin Name', 'admin@example.com', '<bcrypt_hashed_password>', 'admin');
```

### Logging in as Admin

1. Start the application
2. Click the **"Admin"** button (red) in the navigation
3. Enter admin email and password
4. You'll be redirected to `/admin` dashboard

### Admin Dashboard Features

- **View All Submissions** with pagination (15 per page)
- **Filter by Status** (All, Pending, In Progress, Resolved, Rejected)
- **Filter by Department**
- **Search** by title or content
- **Sort** by date or title
- **Update Status** of submissions
- **Edit** submission details
- **Assign** to departments
- **Delete** submissions
- **View Statistics** (Total, Resolved, In Progress, Pending)

## 📡 API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "citizen"
  }
}
```

### Submission Endpoints

#### Submit Complaint/Suggestion/Opinion
```http
POST /api/submit
Content-Type: application/json
Authorization: Bearer <token>  # Optional for anonymous

{
  "title": "Water Leakage Issue",
  "content": "There is a water leakage in my area...",
  "department": "Municipality",
  "type": "complaint"  # or "suggestion" or "opinion"
}
```

#### Get All Submissions
```http
GET /api/submissions
```

#### Get Recent Submissions
```http
GET /api/submissions/recent
```

#### Get Recent Resolved
```http
GET /api/submissions/recent-resolved
```

#### Get Submission by ID
```http
GET /api/submissions/:id
```

#### Vote on Submission
```http
POST /api/submissions/:id/vote
Authorization: Bearer <token>  # Optional
```

### Admin Endpoints

All admin endpoints require authentication and admin role.

#### Get Statistics
```http
GET /api/admin/stats
Authorization: Bearer <admin_token>

Response:
{
  "total": 100,
  "resolved": 45,
  "inProgress": 30,
  "activeUsers": 25
}
```

#### Get All Submissions (Admin)
```http
GET /api/admin/submissions
Authorization: Bearer <admin_token>
```

#### Get Submission by ID (Admin)
```http
GET /api/admin/submissions/:id
Authorization: Bearer <admin_token>
```

#### Update Submission
```http
PUT /api/admin/submissions/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "department": "Health"
}
```

#### Update Status
```http
POST /api/admin/submissions/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "resolved"  # pending, in progress, resolved, rejected
}
```

#### Assign Department
```http
POST /api/admin/submissions/:id/assign
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "department": "Municipality"
}
```

#### Delete Submission
```http
DELETE /api/admin/submissions/:id
Authorization: Bearer <admin_token>
```

### Contact Endpoints

#### Submit Contact Message
```http
POST /api/contact
Content-Type: application/json

{
  "name": "Contact Name",
  "email": "contact@example.com",
  "message": "Your message here"
}
```

## 🔐 Environment Variables

### Backend (.env in server/)

```env
# Database Configuration
DB_HOST=127.0.0.1              # or scylladb for Docker
DB_KEYSPACE=sabeiko_awaj
DB_DATACENTER=datacenter1

# Server Configuration
PORT=5000
NODE_ENV=production            # or development

# Security
JWT_SECRET=your-very-secure-secret-key-change-in-production
```

### Frontend

Set in `client/.env` or `docker-compose.yml`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## 🚢 Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Set `NODE_ENV=production`
- [ ] Configure HTTPS (use reverse proxy like Nginx)
- [ ] Set up proper CORS origins
- [ ] Configure database replication for production
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for database
- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting
- [ ] Set up SSL certificates

### Docker Production Deployment

```bash
# 1. Set environment variables
export JWT_SECRET=your-production-secret
export REACT_APP_API_BASE_URL=https://api.yourdomain.com/api

# 2. Build and start
docker-compose -f docker-compose.yml up -d --build

# 3. Initialize database
docker-compose exec backend node models/initTables.js

# 4. Create admin user
docker-compose exec backend npm run create-admin
```

### Using Reverse Proxy (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔧 Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to ScyllaDB

**Solutions**:
1. Check if ScyllaDB is running: `docker-compose ps`
2. Verify `DB_HOST` in `.env` matches Docker service name
3. Wait for ScyllaDB to be ready: `docker-compose exec scylladb nodetool status`
4. Reinitialize tables: `docker-compose exec backend node models/initTables.js`

### CORS Errors

**Problem**: CORS error in browser console

**Solutions**:
1. Check `server/index.js` CORS configuration
2. Ensure frontend URL is in allowed origins
3. Verify `credentials: true` is set if using cookies

### API 500 Errors

**Problem**: Internal server errors

**Solutions**:
1. Check server logs: `docker-compose logs backend`
2. Verify database connection
3. Check environment variables
4. Ensure tables are initialized
5. Check date field handling in submissions

### Frontend Not Loading

**Problem**: Frontend shows blank page or errors

**Solutions**:
1. Check browser console for errors
2. Verify `REACT_APP_API_BASE_URL` is correct
3. Rebuild frontend: `docker-compose up -d --build frontend`
4. Check Nginx logs: `docker-compose logs frontend`

### Admin Login Issues

**Problem**: Cannot login as admin

**Solutions**:
1. Verify user has `role = 'admin'` in database
2. Check JWT_SECRET is set correctly
3. Verify email and password are correct
4. Check browser console for errors
5. Ensure token is stored in localStorage

### Port Conflicts

**Problem**: Port already in use

**Solutions**:
1. Change ports in `docker-compose.yml`
2. Stop conflicting services
3. Use different ports: `3001:80` for frontend, `5001:5000` for backend

## 📊 Database Schema

### Users Table
```cql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  password TEXT,
  role TEXT  -- 'citizen' or 'admin'
);
```

### Submissions Table
```cql
CREATE TABLE submissions (
  id UUID PRIMARY KEY,
  title TEXT,
  content TEXT,
  userId UUID,
  status TEXT,        -- 'pending', 'in progress', 'resolved', 'rejected'
  department TEXT,
  createdAt TIMESTAMP,
  type TEXT           -- 'complaint', 'suggestion', 'opinion'
);
```

### Votes Table
```cql
CREATE TABLE votes (
  submissionId UUID,
  userId UUID,
  PRIMARY KEY (submissionId, userId)
);
```

### Contacts Table
```cql
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  message TEXT,
  createdAt TIMESTAMP
);
```

## 🎨 UI/UX Features

### Design System
- **Primary Color**: Blue (#1976d2)
- **Admin Color**: Red (#e74c3c)
- **Success**: Green (#27ae60)
- **Warning**: Yellow (#f1c40f)
- **Gradient Backgrounds**: Modern, professional look
- **Responsive**: Mobile-first design

### Components
- **Forms**: Enhanced with modern styling, validation, and feedback
- **Dashboards**: Pagination, filtering, sorting, statistics
- **Modals**: Smooth transitions, professional design
- **Status Badges**: Color-coded with icons
- **Tables**: Responsive, sortable, filterable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for the people of Nepal
- Inspired by the need for transparent governance
- Powered by open-source technologies

## 📞 Support

For issues, questions, or contributions:
- Check the troubleshooting section
- Review the API documentation
- Check Docker logs for errors
- Verify environment variables

---

**सबैको आवाज - जनताको आवाज, सरकारको जिम्मेवारी**

*Everyone's Voice - People's Voice, Government's Responsibility*

**Version**: 2.0  
**Last Updated**: January 2026






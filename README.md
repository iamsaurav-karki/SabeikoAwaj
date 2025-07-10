<<<<<<< HEAD
# Sabeiko Awaj

Sabeiko Awaj is a Nepali e-governance platform that allows citizens to register complaints, suggestions, and opinions about different government departments and authorities. It supports submissions from both registered and anonymous users.

## Features
- Submit complaints, suggestions, and opinions
- Track status via dashboard (for registered users)
- Publicly view and upvote submissions
- Admin dashboard for managing all submissions
- Analytics and charts on homepage

## Tech Stack
- **Frontend:** React, Chart.js/Recharts, Axios
- **Backend:** Node.js, Express.js
- **Database:** ScyllaDB (via Docker)

## Directory Structure
```
sabeiko-awaj/
├── client/              # React frontend
├── server/              # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── db/              # ScyllaDB connector
├── docker-compose.yml
```

## Setup

### 1. Start ScyllaDB
```
docker-compose up -d
```

### 2. Backend
```
cd sabeiko-awaj/server
npm install
# Copy .env.example to .env and edit if needed
node models/initTables.js # Initialize tables
npm start
```

### 3. Frontend
```
cd sabeiko-awaj/client
npm install
npm start
```

## API Endpoints
- `/api/register` - Register user
- `/api/login` - Login
- `/api/submit` - Submit complaint/suggestion/opinion
- `/api/submissions` - View submissions
- `/api/admin/*` - Admin operations

## License
MIT 
=======
# Sabeiko Awaj - Citizen Engagement Platform

A comprehensive platform for citizens to submit opinions, suggestions, and complaints to the government. Built with React, Node.js, and ScyllaDB.

## Features

### ✅ Core Features
- **Homepage**: Platform introduction and recent updates
- **User Authentication**: Login/Register with email/phone + anonymous mode
- **Submit Opinions/Suggestions**: Form with categories and file upload
- **Register Complaints**: Complaint form with location tracking
- **Browse Submissions**: Public view with filtering and upvoting
- **Admin Panel**: Manage submissions and track complaint status
- **Search Functionality**: Keyword-based search
- **Contact Page**: Government contact details and feedback

### 🛠 Tech Stack
- **Frontend**: React with Material-UI
- **Backend**: Node.js with Express
- **Database**: ScyllaDB
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **Real-time**: Socket.io

## Quick Start

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Set up ScyllaDB**
   - Install and start ScyllaDB
   - Create keyspace: `CREATE KEYSPACE sabeiko_awaj WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};`

3. **Environment Setup**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

4. **Run Development Servers**
   ```bash
   cd /client
   npm start
   cd /server
   npm start
   
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:3000/admin

## Project Structure

```
sabeiko-awaj/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utility functions
└── docs/                 # Documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Submissions
- `POST /api/submissions/opinion` - Submit opinion/suggestion
- `POST /api/submissions/complaint` - Submit complaint
- `GET /api/submissions` - Get all submissions
- `GET /api/submissions/:id` - Get specific submission
- `PUT /api/submissions/:id/vote` - Vote on submission

### Admin
- `GET /api/admin/submissions` - Get all submissions for admin
- `PUT /api/admin/submissions/:id/status` - Update submission status
- `DELETE /api/admin/submissions/:id` - Delete submission

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details 
<<<<<<< HEAD

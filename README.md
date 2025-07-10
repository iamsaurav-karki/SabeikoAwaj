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
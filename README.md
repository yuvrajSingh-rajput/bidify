# Cricket Auction System

A full-stack application for managing cricket team auctions and matches.

## Features

- User Authentication (Admin & Team Owners)
- Player Management
- Team Management
- Live Auction System with Real-time Bidding
- Match Scheduling and Scoring
- Team Statistics and Rankings

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: MongoDB
- Real-time Communication: Socket.io
- Authentication: JWT
- File Upload: Multer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd cricket-auction-system
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Environment Configuration:
Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cricket_auction
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

4. Create upload directories:
```bash
# From the server directory
mkdir -p uploads/players uploads/teams
```

5. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend development server (from client directory)
cd ../client
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Players
- GET /api/players - Get all players
- GET /api/players/:id - Get single player
- POST /api/players - Create player (Admin)
- PUT /api/players/:id - Update player (Admin)
- DELETE /api/players/:id - Delete player (Admin)

### Teams
- GET /api/teams - Get all teams
- GET /api/teams/:id - Get single team
- POST /api/teams - Create team (Admin)
- PUT /api/teams/:id - Update team
- GET /api/teams/:id/squad - Get team squad
- GET /api/teams/:id/stats - Get team statistics

### Auctions
- GET /api/auctions - Get all auctions
- GET /api/auctions/:id - Get single auction
- POST /api/auctions - Create auction (Admin)
- POST /api/auctions/:id/start - Start auction (Admin)
- POST /api/auctions/:id/bid - Place bid
- POST /api/auctions/:id/complete-player - Complete player auction (Admin)

### Matches
- GET /api/matches - Get all matches
- GET /api/matches/:id - Get single match
- POST /api/matches - Create match (Admin)
- PUT /api/matches/:id/score - Update match score (Admin)
- POST /api/matches/:id/complete - Complete match (Admin)
- GET /api/matches/:id/stats - Get match statistics

## WebSocket Events

### Auction Events
- auction-started: Emitted when an auction starts
- new-bid: Emitted when a new bid is placed
- player-auction-completed: Emitted when a player's auction is completed

### Match Events
- score-update: Emitted when match score is updated
- match-completed: Emitted when a match is completed

## Directory Structure

```
cricket-auction-system/
├── client/                # Frontend React application
├── server/               # Backend Node.js application
│   ├── models/          # Mongoose models
│   ├── routes/          # Express route controllers
│   ├── middleware/      # Express middlewares
│   ├── uploads/         # Uploaded files
│   │   ├── players/     # Player images
│   │   └── teams/       # Team logos
│   ├── .env            # Environment variables
│   ├── package.json    # Backend dependencies
│   └── server.js      # Express application entry point
└── README.md          # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
# bidify
# bidify

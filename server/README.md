# Cricket Auction System - Backend

This is the backend server for the Cricket Auction System, built with Node.js, Express, MongoDB, and Socket.IO.

## Features

- User Authentication (Admin & Team Owners)
- Team Management
- Player Management
- Real-time Auction System
- WebSocket Integration for Live Bidding

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cricket_auction
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user (admin/team owner)
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Teams
- GET `/api/teams` - Get all teams
- GET `/api/teams/my-team` - Get logged-in user's team
- GET `/api/teams/:id` - Get specific team
- PATCH `/api/teams/:id` - Update team
- GET `/api/teams/:id/players` - Get team players

### Players
- POST `/api/players` - Create player (admin only)
- GET `/api/players` - Get all players
- GET `/api/players/:id` - Get specific player
- PATCH `/api/players/:id` - Update player (admin only)
- DELETE `/api/players/:id` - Delete player (admin only)

### Auctions
- POST `/api/auctions` - Create auction (admin only)
- GET `/api/auctions` - Get all auctions
- GET `/api/auctions/:id` - Get specific auction
- POST `/api/auctions/:id/start` - Start auction (admin only)
- POST `/api/auctions/:id/cancel` - Cancel auction (admin only)

## WebSocket Events

### Client Events
- `join-auction` - Join auction room
- `place-bid` - Place a bid
- `leave-auction` - Leave auction room

### Server Events
- `auction-state` - Current auction state
- `auction-completed` - Auction completion notification
- `error` - Error messages

## Error Handling

The server implements comprehensive error handling for:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- Business logic errors


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teamOwner';
  teamId?: string;
  avatar?: string;
}

export interface Player {
  id: string;
  name: string;
  image?: string;
  role: 'Batsman' | 'Pace Bowler' | 'Medium Pace Bowler' | 'Spinner' | 'Batting All-rounder' | 'Bowling All-rounder' | 'Wicket Keeper';
  battingStyle?: 'right-handed' | 'left-handed';
  bowlingStyle?: 'right-arm-fast' | 'right-arm-medium' | 'right-arm-off-spin' | 'left-arm-fast' | 'left-arm-medium' | 'left-arm-spin' | 'none';
  basePrice: number;
  stats: {
    matches: number;
    runs?: number;
    wickets?: number;
    average?: number;
    strikeRate?: number;
    economy?: number;
  };
  teamId?: string;
  soldPrice?: number;
  status: 'available' | 'sold' | 'unsold';
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  ownerName: string;
  ownerId: string;
  budget: number;
  budgetSpent: number;
  players: string[]; // Array of player IDs
}

export interface Auction {
  id: string;
  name: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  status: 'upcoming' | 'live' | 'completed';
  basePlayerPrice: number;
  baseBudget: number;
  currentPlayerId?: string;
  teams: string[]; // Array of team IDs
  players: string[]; // Array of player IDs
}

export interface Bid {
  id: string;
  auctionId: string;
  playerId: string;
  teamId: string;
  amount: number;
  timestamp: Date;
  status: 'active' | 'outbid' | 'won' | 'lost';
}

export interface Match {
  id: string;
  team1Id: string;
  team2Id: string;
  date: Date;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  scores?: {
    team1Score: number;
    team1Wickets: number;
    team1Overs: number;
    team2Score: number;
    team2Wickets: number;
    team2Overs: number;
  };
  result?: string;
  winnerId?: string;
}

export interface PlayerRegistrationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  auctionId: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

import { apiService } from './api';

export interface CreateAuctionData {
  players: string[];
  teams: string[];
  startTime?: string;
  endTime?: string;
}

export interface Auction {
  _id: string;
  player: {
    _id: string;
    name: string;
    type: string;
    battingStyle: string;
    bowlingStyle: string;
    basePrice: number;
  };
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  currentBid: number;
  currentHighestBidder?: {
    _id: string;
    name: string;
    logo: string;
  };
  biddingHistory: Array<{
    team: {
      _id: string;
      name: string;
      logo: string;
    };
    amount: number;
    timestamp: string;
  }>;
  startTime?: string;
  endTime?: string;
}

export const auctionService = {
  // Get all auctions
  getAllAuctions: async () => {
    const response = await apiService.get<Auction[]>('/auctions');
    return response.data;
  },

  // Get auction by ID
  getAuctionById: async (id: string) => {
    const response = await apiService.get<Auction>(`/auctions/${id}`);
    return response.data;
  },

  // Create auction (Admin only)
  createAuction: async (data: CreateAuctionData) => {
    const response = await apiService.post<Auction>('/auctions', data);
    return response.data;
  },

  // Start auction (Admin only)
  startAuction: async (id: string) => {
    const response = await apiService.post<Auction>(`/auctions/${id}/start`);
    return response.data;
  },

  // Complete auction (Admin only)
  completeAuction: async (id: string) => {
    const response = await apiService.post<Auction>(`/auctions/${id}/complete`);
    return response.data;
  },

  // Place bid
  placeBid: async (auctionId: string, amount: number) => {
    const response = await apiService.post<Auction>(`/auctions/${auctionId}/bid`, { amount });
    return response.data;
  },

  // Complete player auction (Admin only)
  completePlayerAuction: async (auctionId: string) => {
    const response = await apiService.post<Auction>(`/auctions/${auctionId}/complete-player`);
    return response.data;
  }
};

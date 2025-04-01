import { apiService } from './api';

export interface Player {
  _id: string;
  name: string;
  type: string;
  battingStyle: string;
  bowlingStyle: string;
  basePrice: number;
  image?: string;
  team?: {
    _id: string;
    name: string;
    logo: string;
  };
}

export interface CreatePlayerData {
  name: string;
  type: string;
  battingStyle: string;
  bowlingStyle: string;
  basePrice: number;
  image?: File;
}

export interface UpdatePlayerData {
  name?: string;
  type?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  basePrice?: number;
  image?: File;
}

export const playerService = {
  // Get all players
  getAllPlayers: async () => {
    const response = await apiService.get<Player[]>('/players');
    return response.data;
  },

  // Get player by ID
  getPlayerById: async (id: string) => {
    const response = await apiService.get<Player>(`/players/${id}`);
    return response.data;
  },

  // Get available players (not in any team)
  getAvailablePlayers: async () => {
    const response = await apiService.get<Player[]>('/players/available');
    return response.data;
  },

  // Create player (Admin only)
  createPlayer: async (data: CreatePlayerData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value instanceof File ? value : value.toString());
      }
    });

    const response = await apiService.post<Player>('/players', formData);
    return response.data;
  },

  // Update player (Admin only)
  updatePlayer: async (id: string, data: UpdatePlayerData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value instanceof File ? value : value.toString());
      }
    });

    const response = await apiService.put<Player>(`/players/${id}`, formData);
    return response.data;
  },

  // Delete player (Admin only)
  deletePlayer: async (id: string) => {
    await apiService.delete(`/players/${id}`);
  }
};

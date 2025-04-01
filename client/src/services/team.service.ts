import { apiService } from './api';

export interface Team {
  _id: string;
  name: string;
  logo?: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  budget: {
    total: number;
    remaining: number;
  };
  squad: Array<{
    player: {
      _id: string;
      name: string;
      type: string;
      battingStyle: string;
      bowlingStyle: string;
      basePrice: number;
    };
    purchasePrice: number;
    purchaseDate: string;
  }>;
}

export interface CreateTeamData {
  name: string;
  budget: number;
  logo?: File;
}

export interface UpdateTeamData {
  name?: string;
  budget?: number;
  logo?: File;
}

export const teamService = {
  // Get all teams
  getAllTeams: async () => {
    const response = await apiService.get<Team[]>('/teams');
    return response.data;
  },

  // Get team by ID
  getTeamById: async (id: string) => {
    const response = await apiService.get<Team>(`/teams/${id}`);
    return response.data;
  },

  // Create team
  createTeam: async (teamData: CreateTeamData) => {
    const formData = new FormData();
    formData.append('name', teamData.name);
    formData.append('budget', teamData.budget.toString());
    if (teamData.logo) {
      formData.append('logo', teamData.logo);
    }

    const response = await apiService.post<Team>('/teams', formData);
    return response.data;
  },

  // Update team
  updateTeam: async (id: string, teamData: UpdateTeamData) => {
    const formData = new FormData();
    if (teamData.name) formData.append('name', teamData.name);
    if (teamData.budget) formData.append('budget', teamData.budget.toString());
    if (teamData.logo) formData.append('logo', teamData.logo);

    const response = await apiService.put<Team>(`/teams/${id}`, formData);
    return response.data;
  },

  // Delete team
  deleteTeam: async (id: string) => {
    await apiService.delete(`/teams/${id}`);
  },

  // Get team squad
  getTeamSquad: async (id: string) => {
    const response = await apiService.get<Team['squad']>(`/teams/${id}/squad`);
    return response.data;
  }
};

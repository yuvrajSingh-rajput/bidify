import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Auction, Player, Team } from "@/types";
import { Calendar, Gavel, Trophy, Users } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import AuctionCard from "@/components/auctions/AuctionCard";
import PlayerCard from "@/components/players/PlayerCard";
import TeamCard from "@/components/teams/TeamCard";

// Mock data
const mockAuctions: Auction[] = [
  {
    id: "1",
    name: "IPL Season 2023",
    description: "Annual player auction for IPL 2023 season",
    startTime: new Date("2023-12-10T10:00:00"),
    status: "upcoming",
    basePlayerPrice: 2000000,
    baseBudget: 80000000,
    teams: ["1", "2", "3"],
    players: ["1", "2", "3", "4", "5"],
  },
  {
    id: "2",
    name: "T20 World Cup Trials",
    description: "Player selection auction for World Cup team",
    startTime: new Date("2023-12-15T14:00:00"),
    status: "live",
    basePlayerPrice: 1000000,
    baseBudget: 50000000,
    teams: ["1", "4", "5"],
    players: ["6", "7", "8", "9", "10"],
    currentPlayerId: "6",
  },
];

const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Virat Kohli",
    role: "Batsman",
    basePrice: 20000000,
    stats: {
      matches: 215,
      runs: 6624,
      average: 53.4,
      strikeRate: 139.8,
    },
    status: "available",
  },
  {
    id: "2",
    name: "Rohit Sharma",
    role: "Batsman",
    basePrice: 18000000,
    stats: {
      matches: 227,
      runs: 5879,
      average: 48.2,
      strikeRate: 147.3,
    },
    status: "available",
  },
  {
    id: "3",
    name: "Jasprit Bumrah",
    role: "Pace Bowler",
    basePrice: 15000000,
    stats: {
      matches: 178,
      wickets: 130,
      economy: 6.7,
    },
    status: "available",
  },
  {
    id: "4",
    name: "Ravindra Jadeja",
    role: "Bowling All-rounder",
    basePrice: 12000000,
    stats: {
      matches: 200,
      runs: 2500,
      wickets: 120,
      average: 32.1,
      economy: 7.8,
    },
    status: "available",
  },
];

const mockTeams: Team[] = [
  {
    id: "1",
    name: "Mumbai Indians",
    ownerName: "Ambani Group",
    ownerId: "101",
    budget: 80000000,
    budgetSpent: 55000000,
    players: ["1", "2"],
  },
  {
    id: "2",
    name: "Chennai Super Kings",
    ownerName: "India Cements",
    ownerId: "102",
    budget: 80000000,
    budgetSpent: 48000000,
    players: ["3"],
  },
  {
    id: "3",
    name: "Royal Challengers Bangalore",
    ownerName: "United Spirits",
    ownerId: "103",
    budget: 80000000,
    budgetSpent: 62000000,
    players: ["4"],
  },
];

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // Load mock data
  useEffect(() => {
    setAuctions(mockAuctions);
    setPlayers(mockPlayers);
    setTeams(mockTeams);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="mt-16 md:mt-12">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Gavel className="h-6 w-6 text-bidfy-blue" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Auctions</p>
                <p className="text-2xl font-bold">{auctions.filter(a => a.status === "live").length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-bidfy-green" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Players</p>
                <p className="text-2xl font-bold">{players.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                <Trophy className="h-6 w-6 text-bidfy-amber" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Teams</p>
                <p className="text-2xl font-bold">{teams.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming Auctions</p>
                <p className="text-2xl font-bold">{auctions.filter(a => a.status === "upcoming").length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Auctions */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Auctions</h2>
            <Button variant="outline" asChild>
              <a href="/auctions">View All</a>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </section>

        {/* Recent Players */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Top Players</h2>
            <Button variant="outline" asChild>
              <a href="/players">View All</a>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {players.slice(0, 4).map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </section>

        {/* Teams */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Teams</h2>
            <Button variant="outline" asChild>
              <a href="/teams">View All</a>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

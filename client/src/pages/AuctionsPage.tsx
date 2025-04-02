import { useState, useEffect } from "react";
import { Auction, Player, Team } from "@/types";
import MainLayout from "@/components/layouts/MainLayout";
import AuctionCard from "@/components/auctions/AuctionCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Plus, Users, CalendarDays, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RegisteredTeamsList from "@/components/auctions/RegisteredTeamsList";
import PlayerRegistrationRequestsDialog from "@/components/admin/PlayerRegistrationRequestsDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data for auctions
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
  {
    id: "3",
    name: "County Cricket Draft",
    description: "Player draft for county cricket tournament",
    startTime: new Date("2023-11-05T09:00:00"),
    endTime: new Date("2023-11-05T18:00:00"),
    status: "completed",
    basePlayerPrice: 500000,
    baseBudget: 30000000,
    teams: ["6", "7", "8"],
    players: ["11", "12", "13", "14", "15"],
  },
];

// Mock players for player pool selection
const mockPlayers = [
  { id: "1", name: "Virat Kohli", role: "Batsman", basePrice: 2000000, status: "available" },
  { id: "2", name: "Rohit Sharma", role: "Batsman", basePrice: 1800000, status: "available" },
  { id: "3", name: "Jasprit Bumrah", role: "Bowler", basePrice: 1500000, status: "available" },
  { id: "4", name: "Ravindra Jadeja", role: "All-rounder", basePrice: 1200000, status: "available" },
  { id: "5", name: "KL Rahul", role: "Batsman", basePrice: 1600000, status: "available" },
];

// Mock teams for team registration
const mockTeams: Team[] = [
  { 
    id: "1", 
    name: "Mumbai Indians", 
    ownerName: "John Doe", 
    ownerId: "u1", 
    budget: 80000000, 
    budgetSpent: 10000000, 
    players: ["1", "3"] 
  },
  { 
    id: "2", 
    name: "Chennai Super Kings", 
    ownerName: "Jane Smith", 
    ownerId: "u2", 
    budget: 80000000, 
    budgetSpent: 15000000, 
    players: ["2"] 
  },
  { 
    id: "3", 
    name: "Royal Challengers", 
    ownerName: "Mike Johnson", 
    ownerId: "u3", 
    budget: 80000000, 
    budgetSpent: 8000000, 
    players: ["4", "5"] 
  },
  { 
    id: "4", 
    name: "Rajasthan Royals", 
    ownerName: "Sarah Lee", 
    ownerId: "u4", 
    budget: 70000000, 
    budgetSpent: 5000000, 
    players: [] 
  },
  { 
    id: "5", 
    name: "Punjab Kings", 
    ownerName: "David Wilson", 
    ownerId: "u5", 
    budget: 75000000, 
    budgetSpent: 12000000, 
    players: [] 
  }
];

const AuctionsPage = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPlayerSelectionOpen, setIsPlayerSelectionOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [registeredTeams, setRegisteredTeams] = useState<Team[]>(mockTeams);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [isRequestsDialogOpen, setIsRequestsDialogOpen] = useState(false);
  const [createdAuctionId, setCreatedAuctionId] = useState<string | null>(null);
  const { toast } = useToast();

  // New auction form state
  const [newAuctionName, setNewAuctionName] = useState("");
  const [newAuctionDescription, setNewAuctionDescription] = useState("");
  const [newAuctionDate, setNewAuctionDate] = useState("");
  const [newAuctionTime, setNewAuctionTime] = useState("");
  const [newAuctionBasePrice, setNewAuctionBasePrice] = useState("");
  const [newAuctionBaseBudget, setNewAuctionBaseBudget] = useState("");

  // Load mock data
  useEffect(() => {
    setAuctions(mockAuctions);
    setAvailablePlayers(mockPlayers as Player[]);
  }, []);

  // Filter auctions based on status and search query
  const filteredAuctions = auctions.filter((auction) => {
    // Filter by status
    if (statusFilter !== "all" && auction.status !== statusFilter) {
      return false;
    }
    // Filter by search query
    if (
      searchQuery &&
      !auction.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !auction.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Toggle player selection
  const togglePlayerSelection = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  // Open the PlayerRegistrationRequests dialog for a specific auction
  const openRequestsDialog = (auction: Auction) => {
    setSelectedAuction(auction);
    setIsRequestsDialogOpen(true);
  };

  // Handle create auction
  const handleCreateAuction = () => {
    // Validation
    if (!newAuctionName || !newAuctionDate || !newAuctionTime || !newAuctionBasePrice || !newAuctionBaseBudget) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create new auction object
    const newAuctionId = (auctions.length + 1).toString();
    
    const newAuction: Auction = {
      id: newAuctionId,
      name: newAuctionName,
      description: newAuctionDescription,
      startTime: new Date(`${newAuctionDate}T${newAuctionTime}`),
      status: "upcoming",
      basePlayerPrice: Number(newAuctionBasePrice),
      baseBudget: Number(newAuctionBaseBudget),
      teams: [],
      players: [],
    };

    // Add to auctions list
    setAuctions([...auctions, newAuction]);
    
    // Set the created auction id for player selection
    setCreatedAuctionId(newAuctionId);
    
    // Close the create dialog and open player selection
    setIsCreateDialogOpen(false);
    setIsPlayerSelectionOpen(true);
    
    toast({
      title: "Success",
      description: "Auction created successfully! Please select players for this auction.",
    });
  };

  // Finalize player selection
  const finalizePlayerSelection = () => {
    if (!createdAuctionId) return;
    
    // Update the auction with selected players
    setAuctions(auctions.map(auction => {
      if (auction.id === createdAuctionId) {
        return {
          ...auction,
          players: selectedPlayers
        };
      }
      return auction;
    }));
    
    setIsPlayerSelectionOpen(false);
    setSelectedPlayers([]);
    setCreatedAuctionId(null);
    
    // Reset form
    setNewAuctionName("");
    setNewAuctionDescription("");
    setNewAuctionDate("");
    setNewAuctionTime("");
    setNewAuctionBasePrice("");
    setNewAuctionBaseBudget("");
    
    toast({
      title: "Success",
      description: "Players added to auction pool",
    });
  };

  // Function to get teams for a specific auction
  const getAuctionTeams = (auctionId: string) => {
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction) return [];
    
    return registeredTeams.filter(team => auction.teams.includes(team.id));
  };

  return (
    <MainLayout>
      <div className="mt-16 md:mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Auctions</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search auctions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Auctions</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Auctions grid - for all users */}
        <h2 className="text-xl font-semibold mb-4">All Auctions</h2>
        {filteredAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction) => (
              <div key={auction.id} className="flex flex-col h-full">
                <AuctionCard auction={auction} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No auctions found matching your criteria.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AuctionsPage;
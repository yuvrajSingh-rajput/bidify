
import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import PlayerDetailsDialog from "@/components/players/PlayerDetailsDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import AddPlayerForm from "@/components/admin/AddPlayerForm";
import { Auction } from "@/types";

// Mock data for players
const mockPlayers = [
  { id: 1, name: "Virat Kohli", role: "Batsman", country: "India", image: "/placeholder.svg", basePrice: 10000, stats: { matches: 215, runs: 6450, wickets: 0, average: 52.7, economy: 0, strikeRate: 139.5 }, team: "Super Kings", inAuctionPool: true },
  { id: 2, name: "Kane Williamson", role: "Batsman", country: "New Zealand", image: "/placeholder.svg", basePrice: 8500, stats: { matches: 189, runs: 5320, wickets: 0, average: 46.2, economy: 0, strikeRate: 124.8 }, team: null, inAuctionPool: true },
  { id: 3, name: "Jasprit Bumrah", role: "Bowler", country: "India", image: "/placeholder.svg", basePrice: 9000, stats: { matches: 178, runs: 180, wickets: 210, average: 0, economy: 6.8, strikeRate: 0 }, team: "Mumbai Indians", inAuctionPool: false },
  { id: 4, name: "Ben Stokes", role: "All-rounder", country: "England", image: "/placeholder.svg", basePrice: 9500, stats: { matches: 165, runs: 3200, wickets: 120, average: 34.5, economy: 8.2, strikeRate: 136.7 }, team: null, inAuctionPool: true },
  { id: 5, name: "Jos Buttler", role: "Wicket-keeper", country: "England", image: "/placeholder.svg", basePrice: 8800, stats: { matches: 157, runs: 4120, wickets: 0, average: 38.9, economy: 0, strikeRate: 145.3 }, team: "Rajasthan Royals", inAuctionPool: false },
];

// Mock auctions to add players to
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

const PlayersPage = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState(mockPlayers);
  const [filteredPlayers, setFilteredPlayers] = useState(players);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [isAddToAuctionOpen, setIsAddToAuctionOpen] = useState(false);
  const [selectedPlayerForAuction, setSelectedPlayerForAuction] = useState(null);
  const { toast } = useToast();

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterPlayers(query, roleFilter);
  };

  const handleRoleFilter = (value) => {
    setRoleFilter(value);
    filterPlayers(searchQuery, value);
  };

  const filterPlayers = (query, role) => {
    let filtered = players;
    
    if (query) {
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(query) ||
        player.country.toLowerCase().includes(query)
      );
    }
    
    if (role && role !== "all") {
      filtered = filtered.filter(player => player.role === role);
    }
    
    setFilteredPlayers(filtered);
  };

  const openPlayerDetails = (player) => {
    setSelectedPlayer(player);
  };

  const closePlayerDetails = () => {
    setSelectedPlayer(null);
  };

  const handleAddPlayer = (playerData) => {
    const newPlayer = {
      id: players.length + 1,
      ...playerData,
      inAuctionPool: false,
      team: null,
    };
    
    setPlayers([...players, newPlayer]);
    setFilteredPlayers([...filteredPlayers, newPlayer]);
    setIsAddPlayerOpen(false);
    
    toast({
      title: "Success",
      description: "Player added successfully",
    });
  };

  const openAddToAuction = (player) => {
    setSelectedPlayerForAuction(player);
    setIsAddToAuctionOpen(true);
  };

  const handleAddToAuction = (auctionId) => {
    // In a real app, you would make an API call here
    toast({
      title: "Success",
      description: `Added ${selectedPlayerForAuction.name} to auction pool`,
    });
    setIsAddToAuctionOpen(false);
    setSelectedPlayerForAuction(null);
  };

  const handleRemoveFromAuction = (player) => {
    // In a real app, you would make an API call here
    toast({
      title: "Success",
      description: `Removed ${player.name} from auction pool`,
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold">Players</h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search players..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Select value={roleFilter} onValueChange={handleRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Batsman">Batsman</SelectItem>
                  <SelectItem value="Bowler">Bowler</SelectItem>
                  <SelectItem value="All-rounder">All-rounder</SelectItem>
                  <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
                </SelectContent>
              </Select>
              
              {user?.role === "admin" && (
                <Button onClick={() => setIsAddPlayerOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Player
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlayers.map((player) => (
              <Card key={player.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{player.name}</CardTitle>
                    <Badge variant={player.inAuctionPool ? "default" : "outline"}>
                      {player.inAuctionPool ? "In Auction Pool" : "Not in Pool"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={player.image} alt={player.name} />
                      <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{player.role}</Badge>
                        <span className="text-sm text-muted-foreground">{player.country}</span>
                      </div>
                      <div className="mt-2 text-sm">
                        Base Price: ₹{player.basePrice.toLocaleString()}
                      </div>
                      {player.team && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          Team: {player.team}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => openPlayerDetails(player)}>
                      View Details
                    </Button>
                    
                    {user?.role === "admin" && (
                      player.inAuctionPool ? (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveFromAuction(player)}
                        >
                          Remove from Auction
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => openAddToAuction(player)}
                        >
                          Add to Auction
                        </Button>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredPlayers.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No players found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Player Details Dialog */}
      {selectedPlayer && (
        <PlayerDetailsDialog player={selectedPlayer} open={!!selectedPlayer} onClose={closePlayerDetails} />
      )}
      
      {/* Add Player Dialog */}
      <Dialog open={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Player</DialogTitle>
            <DialogDescription>
              Enter player details to add them to the system.
            </DialogDescription>
          </DialogHeader>
          
          <AddPlayerForm onSubmit={handleAddPlayer} onCancel={() => setIsAddPlayerOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Add to Auction Dialog */}
      <Dialog open={isAddToAuctionOpen} onOpenChange={setIsAddToAuctionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Auction</DialogTitle>
            <DialogDescription>
              Select which auction you want to add this player to.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select onValueChange={handleAddToAuction}>
              <SelectTrigger>
                <SelectValue placeholder="Select an auction" />
              </SelectTrigger>
              <SelectContent>
                {mockAuctions.map((auction) => (
                  <SelectItem key={auction.id} value={auction.id}>
                    {auction.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddToAuctionOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PlayersPage;

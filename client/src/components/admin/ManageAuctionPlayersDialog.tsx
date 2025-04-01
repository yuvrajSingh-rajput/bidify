import { useState, useEffect } from "react";
import { Player } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MoveUp, MoveDown, Search } from "lucide-react";

interface ManageAuctionPlayersDialogProps {
  open: boolean;
  onClose: () => void;
  auctionId: string;
  onPlayersUpdate: (players: Player[]) => void;
}

// Mock players for the dialog
const mockAuctionPlayers: Player[] = [
  { 
    id: "1", 
    name: "Virat Kohli", 
    role: "Batsman", 
    basePrice: 2000000,
    stats: { matches: 215, runs: 6450, average: 52.7, strikeRate: 139.5 },
    status: "available"
  },
  { 
    id: "2", 
    name: "Rohit Sharma", 
    role: "Batsman", 
    basePrice: 1800000,
    stats: { matches: 189, runs: 5320, average: 46.2, strikeRate: 124.8 },
    status: "sold",
    teamId: "1",
    soldPrice: 2200000
  },
  { 
    id: "3", 
    name: "Jasprit Bumrah", 
    role: "Pace Bowler", 
    basePrice: 1500000,
    stats: { matches: 178, wickets: 210, economy: 6.8 },
    status: "unsold"
  },
  { 
    id: "4", 
    name: "Ravindra Jadeja", 
    role: "Bowling All-rounder", 
    basePrice: 1200000,
    stats: { matches: 165, runs: 3200, wickets: 120, average: 34.5, economy: 8.2, strikeRate: 136.7 },
    status: "available"
  }
];

const ManageAuctionPlayersDialog = ({ 
  open, 
  onClose,
  auctionId,
  onPlayersUpdate
}: ManageAuctionPlayersDialogProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "sold" | "unsold">("all");

  // Load mock data for this example
  useEffect(() => {
    setPlayers(mockAuctionPlayers);
    setFilteredPlayers(mockAuctionPlayers);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...players];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(player => player.status === statusFilter);
    }
    
    setFilteredPlayers(filtered);
  }, [players, searchQuery, statusFilter]);

  // Move player up in the list
  const movePlayerUp = (index: number) => {
    if (index === 0) return;
    
    const newPlayers = [...players];
    const temp = newPlayers[index];
    newPlayers[index] = newPlayers[index - 1];
    newPlayers[index - 1] = temp;
    
    setPlayers(newPlayers);
  };

  // Move player down in the list
  const movePlayerDown = (index: number) => {
    if (index === players.length - 1) return;
    
    const newPlayers = [...players];
    const temp = newPlayers[index];
    newPlayers[index] = newPlayers[index + 1];
    newPlayers[index + 1] = temp;
    
    setPlayers(newPlayers);
  };

  // Reset unsold player to available
  const retryPlayer = (playerId: string) => {
    const newPlayers = players.map(player => {
      if (player.id === playerId && player.status === "unsold") {
        return { ...player, status: "available" as const };
      }
      return player;
    });
    
    setPlayers(newPlayers);
  };

  // Save changes and close dialog
  const handleSave = () => {
    onPlayersUpdate(players);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Auction Players</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search players..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="sm:w-48">
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "available" | "sold" | "unsold")}
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="unsold">Unsold</option>
              </select>
            </div>
          </div>
          
          {/* Players table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map((player, index) => {
                const realIndex = players.findIndex(p => p.id === player.id);
                
                return (
                  <TableRow key={player.id}>
                    <TableCell>{realIndex + 1}</TableCell>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>{player.role}</TableCell>
                    <TableCell>₹{player.basePrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          player.status === "sold" ? "default" :
                          player.status === "unsold" ? "destructive" :
                          "outline"
                        }
                      >
                        {player.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => movePlayerUp(realIndex)}
                          disabled={realIndex === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => movePlayerDown(realIndex)}
                          disabled={realIndex === players.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        {player.status === "unsold" && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => retryPlayer(player.id)}
                          >
                            Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageAuctionPlayersDialog;
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Auction, Player, Team, Bid } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow, format } from "date-fns";
import { Clock, Users, DollarSign, Trophy } from "lucide-react";
import PlayerCard from "@/components/players/PlayerCard";
import ManageAuctionPlayersDialog from "@/components/admin/ManageAuctionPlayersDialog";

// Mock data for auction details
const mockAuction: Auction = {
  id: "1",
  name: "IPL Season 2023",
  description: "Annual player auction for IPL 2023 season",
  startTime: new Date("2023-12-10T10:00:00"),
  status: "upcoming",
  basePlayerPrice: 2000000,
  baseBudget: 80000000,
  teams: ["1", "2", "3"],
  players: ["1", "2", "3", "4", "5"],
};

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
    role: "Bowler",
    basePrice: 15000000,
    stats: {
      matches: 120,
      wickets: 130,
      economy: 6.7,
    },
    status: "available",
  },
  {
    id: "4",
    name: "Ravindra Jadeja",
    role: "All-rounder",
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

const mockBids: Bid[] = [
  {
    id: "1",
    auctionId: "1",
    playerId: "1",
    teamId: "1",
    amount: 22000000,
    timestamp: new Date("2023-12-10T10:15:00"),
    status: "won",
  },
  {
    id: "2",
    auctionId: "1",
    playerId: "1",
    teamId: "2",
    amount: 21000000,
    timestamp: new Date("2023-12-10T10:14:30"),
    status: "outbid",
  },
  {
    id: "3",
    auctionId: "1",
    playerId: "2",
    teamId: "1",
    amount: 19000000,
    timestamp: new Date("2023-12-10T10:30:00"),
    status: "won",
  },
];

const AuctionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isManagePlayersOpen, setIsManagePlayersOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setAuction(mockAuction);
        setPlayers(mockPlayers);
        setTeams(mockTeams);
        setBids(mockBids);
        
        if (mockAuction.status === "live" && mockAuction.currentPlayerId) {
          const player = mockPlayers.find(p => p.id === mockAuction.currentPlayerId);
          if (player) setCurrentPlayer(player);
        }
      } catch (error) {
        console.error("Error fetching auction data:", error);
        toast({
          title: "Error",
          description: "Failed to load auction details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handlePlayersUpdate = (updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
    toast({
      title: "Success",
      description: "Player order updated successfully",
    });
  };

  const handleStartAuction = () => {
    if (!auction) return;
    
    setAuction({
      ...auction,
      status: "live",
      currentPlayerId: players[0]?.id,
    });
    
    setCurrentPlayer(players[0]);
    
    toast({
      title: "Auction Started",
      description: "The auction is now live!",
    });
  };

  const handleEndAuction = () => {
    if (!auction) return;
    
    setAuction({
      ...auction,
      status: "completed",
      endTime: new Date(),
      currentPlayerId: undefined,
    });
    
    setCurrentPlayer(null);
    
    toast({
      title: "Auction Ended",
      description: "The auction has been completed.",
    });
  };

  const handleNextPlayer = () => {
    if (!auction || !currentPlayer) return;
    
    const currentIndex = players.findIndex(p => p.id === currentPlayer.id);
    if (currentIndex === -1 || currentIndex === players.length - 1) {
      handleEndAuction();
      return;
    }
    
    const nextPlayer = players[currentIndex + 1];
    
    setAuction({
      ...auction,
      currentPlayerId: nextPlayer.id,
    });
    
    setCurrentPlayer(nextPlayer);
    
    toast({
      title: "Next Player",
      description: `Now bidding for ${nextPlayer.name}`,
    });
  };

  const handleRetryPlayer = (playerId: string) => {
    const playerToRetry = players.find(p => p.id === playerId);
    if (!playerToRetry || !auction) return;
    
    const updatedPlayers = players.map(p => 
      p.id === playerId ? { ...p, status: "available" as const } : p
    );
    
    setPlayers(updatedPlayers);
    
    setAuction({
      ...auction,
      currentPlayerId: playerId,
    });
    
    setCurrentPlayer(playerToRetry);
    
    toast({
      title: "Player Retry",
      description: `Retrying bidding for ${playerToRetry.name}`,
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="text-lg">Loading auction details...</span>
        </div>
      </MainLayout>
    );
  }

  if (!auction) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-2">Auction Not Found</h2>
          <p className="text-muted-foreground mb-4">The auction you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/auctions">Back to Auctions</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/auctions" className="text-sm text-muted-foreground hover:underline">
                Auctions
              </Link>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm font-medium">{auction.name}</span>
            </div>
            <h1 className="text-3xl font-bold">{auction.name}</h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {user?.role === "admin" && auction.status === "upcoming" && (
              <Button onClick={handleStartAuction}>Start Auction</Button>
            )}
            
            {user?.role === "admin" && auction.status === "live" && (
              <>
                <Button onClick={handleNextPlayer}>Next Player</Button>
                <Button variant="destructive" onClick={handleEndAuction}>End Auction</Button>
              </>
            )}
            
            {user?.role === "admin" && (
              <Button variant="outline" onClick={() => setIsManagePlayersOpen(true)}>
                Manage Players
              </Button>
            )}
            
            <Button asChild variant="outline">
              <Link to="/auctions">Back to Auctions</Link>
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  auction.status === "live" ? "bg-green-100" :
                  auction.status === "upcoming" ? "bg-blue-100" : "bg-gray-100"
                }`}>
                  <Clock className={`h-6 w-6 ${
                    auction.status === "live" ? "text-green-600" :
                    auction.status === "upcoming" ? "text-blue-600" : "text-gray-600"
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      auction.status === "live" ? "bg-green-500" :
                      auction.status === "upcoming" ? "bg-blue-500" : "bg-gray-500"
                    }`}>
                      {auction.status === "live" ? "Live Now" :
                       auction.status === "upcoming" ? "Upcoming" : "Completed"}
                    </Badge>
                    {auction.status === "upcoming" && (
                      <span className="text-sm">
                        Starts {formatDistanceToNow(auction.startTime, { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Teams</p>
                  <p className="font-medium">{teams.length} Participating</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-100">
                  <DollarSign className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Base Price</p>
                  <p className="font-medium">₹{auction.basePlayerPrice.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Team Budget</p>
                  <p className="font-medium">₹{auction.baseBudget.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {auction.status === "live" && currentPlayer && (
          <Card className="mb-6 border-2 border-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Current Player</span>
                <Badge className="bg-green-500">Bidding Now</Badge>
              </CardTitle>
              <CardDescription>
                Bidding started at {format(new Date(), "h:mm a")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <PlayerCard player={currentPlayer} showActions={user?.role === "teamOwner"} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Current Bids</h3>
                  <div className="bg-gray-50 p-4 rounded-lg min-h-[100px] flex items-center justify-center">
                    <p className="text-muted-foreground">No bids yet for this player</p>
                  </div>
                  
                  {user?.role === "admin" && (
                    <div className="mt-4 flex gap-2">
                      <Button className="flex-1" onClick={handleNextPlayer}>
                        Mark as Sold
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => {
                        const updatedPlayers = players.map(p => 
                          p.id === currentPlayer.id ? { ...p, status: "unsold" as const } : p
                        );
                        setPlayers(updatedPlayers);
                        handleNextPlayer();
                      }}>
                        Mark as Unsold
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="history">Bid History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auction Details</CardTitle>
                <CardDescription>
                  {auction.description || "No description provided for this auction."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Start Time</h3>
                    <p>{format(auction.startTime, "PPP 'at' h:mm a")}</p>
                  </div>
                  
                  {auction.endTime && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">End Time</h3>
                      <p>{format(auction.endTime, "PPP 'at' h:mm a")}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Base Player Price</h3>
                    <p>₹{auction.basePlayerPrice.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Team Budget</h3>
                    <p>₹{auction.baseBudget.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Players</h3>
                    <p>{players.length}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Participating Teams</h3>
                    <p>{teams.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Players</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {players.slice(0, 3).map((player) => (
                      <div key={player.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={player.image} />
                          <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className="text-sm text-muted-foreground">{player.role}</p>
                        </div>
                        <Badge className="ml-auto" variant="outline">
                          ₹{player.basePrice.toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Participating Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teams.map((team) => (
                      <div key={team.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={team.logo} />
                          <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{team.name}</p>
                          <p className="text-sm text-muted-foreground">Owner: {team.ownerName}</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-sm font-medium">Budget: ₹{(team.budget - team.budgetSpent).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Players: {team.players.length}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="players">
            <Card>
              <CardHeader>
                <CardTitle>Players in Auction</CardTitle>
                <CardDescription>
                  Total of {players.length} players in this auction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {players.map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>Participating Teams</CardTitle>
                <CardDescription>
                  Teams participating in this auction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Players</TableHead>
                      <TableHead>Budget Spent</TableHead>
                      <TableHead>Remaining Budget</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={team.logo} />
                              <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{team.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{team.ownerName}</TableCell>
                        <TableCell>{team.players.length}</TableCell>
                        <TableCell>₹{team.budgetSpent.toLocaleString()}</TableCell>
                        <TableCell>₹{(team.budget - team.budgetSpent).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Bid History</CardTitle>
                <CardDescription>
                  Record of all bids placed in this auction
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bids.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bids.map((bid) => {
                        const player = players.find(p => p.id === bid.playerId);
                        const team = teams.find(t => t.id === bid.teamId);
                        
                        return (
                          <TableRow key={bid.id}>
                            <TableCell>{player?.name || "Unknown Player"}</TableCell>
                            <TableCell>{team?.name || "Unknown Team"}</TableCell>
                            <TableCell>₹{bid.amount.toLocaleString()}</TableCell>
                            <TableCell>{format(bid.timestamp, "h:mm a")}</TableCell>
                            <TableCell>
                              <Badge variant={bid.status === "won" ? "default" : "outline"}>
                                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No bids have been placed yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {user?.role === "admin" && auction.status === "live" && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Unsold Players</CardTitle>
              <CardDescription>
                Players that can be retried for bidding
              </CardDescription>
            </CardHeader>
            <CardContent>
              {players.filter(p => p.status === "unsold").length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {players
                    .filter(p => p.status === "unsold")
                    .map((player) => (
                      <Card key={player.id} className="border-dashed">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{player.name}</CardTitle>
                          <CardDescription>{player.role}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm mb-2">Base Price: ₹{player.basePrice.toLocaleString()}</p>
                          <Button 
                            onClick={() => handleRetryPlayer(player.id)}
                            className="w-full"
                          >
                            Retry Bidding
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No unsold players yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {isManagePlayersOpen && (
          <ManageAuctionPlayersDialog
            open={isManagePlayersOpen}
            onClose={() => setIsManagePlayersOpen(false)}
            auctionId={id || ""}
            onPlayersUpdate={handlePlayersUpdate}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default AuctionDetailPage;

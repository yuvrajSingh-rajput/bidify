import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ArrowLeft, ListOrdered, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock match data
const mockMatches = [
  {
    id: "match1",
    auctionId: "1",
    team1Id: "1",
    team2Id: "2",
    venue: "Wankhede Stadium, Mumbai",
    date: new Date("2023-12-20T14:00:00"),
    status: "scheduled",
    result: null
  },
  {
    id: "match2",
    auctionId: "1",
    team1Id: "2",
    team2Id: "3",
    venue: "M. Chinnaswamy Stadium, Bangalore",
    date: new Date("2023-12-22T14:00:00"),
    status: "scheduled",
    result: null
  }
];

// Mock teams data
const mockTeams = [
  {
    id: "1",
    name: "Mumbai Indians",
    ownerName: "Ambani Group",
    ownerId: "101",
    budget: 80000000,
    budgetSpent: 55000000,
    players: ["1", "2"],
    logo: ""
  },
  {
    id: "2",
    name: "Chennai Super Kings",
    ownerName: "India Cements",
    ownerId: "102",
    budget: 80000000,
    budgetSpent: 48000000,
    players: ["3"],
    logo: ""
  },
  {
    id: "3",
    name: "Royal Challengers Bangalore",
    ownerName: "United Spirits",
    ownerId: "103",
    budget: 80000000,
    budgetSpent: 62000000,
    players: ["4"],
    logo: ""
  },
];

const AuctionMatchesPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlanningMatch, setIsPlanningMatch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Filter matches by auctionId
        const auctionMatches = mockMatches.filter(match => match.auctionId === id);
        setMatches(auctionMatches);
        setTeams(mockTeams);
      } catch (error) {
        console.error("Error fetching match data:", error);
        toast({
          title: "Error",
          description: "Failed to load matches",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  // Function to add a new match
  const handleAddMatch = (formData: any) => {
    const newMatch = {
      id: `match-${Date.now()}`,
      auctionId: id,
      team1Id: formData.team1Id,
      team2Id: formData.team2Id,
      venue: formData.venue,
      date: new Date(formData.date),
      status: "scheduled",
      result: null
    };
    
    setMatches([...matches, newMatch]);
    setIsPlanningMatch(false);
    
    toast({
      title: "Match Added",
      description: "New match has been scheduled successfully!",
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="text-lg">Loading matches...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to={`/auctions/${id}`} className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Auction
              </Link>
            </div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ListOrdered className="h-6 w-6" />
              Auction Matches
            </h1>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Link to={`/auctions/${id}/statistics`}>
              <Button variant="outline" className="flex items-center gap-2">
                Statistics
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            
            {user?.role === "admin" && (
              <Button onClick={() => setIsPlanningMatch(true)}>
                Schedule Match
              </Button>
            )}
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Scheduled Matches</CardTitle>
            <CardDescription>
              All matches scheduled for this auction
            </CardDescription>
          </CardHeader>
          <CardContent>
            {matches.length > 0 ? (
              <div className="grid gap-4">
                {matches.map((match) => {
                  const team1 = teams.find(t => t.id === match.team1Id);
                  const team2 = teams.find(t => t.id === match.team2Id);
                  
                  return (
                    <Card key={match.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4 bg-secondary/30">
                          <div className="grid grid-cols-7 items-center">
                            <div className="col-span-3 flex flex-col items-center md:items-end p-2">
                              <Avatar className="h-12 w-12 mb-2">
                                <AvatarImage src={team1?.logo} />
                                <AvatarFallback>{team1?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <h4 className="font-semibold text-center md:text-right">{team1?.name}</h4>
                            </div>
                            
                            <div className="col-span-1 flex justify-center items-center">
                              <span className="text-xl font-bold">vs</span>
                            </div>
                            
                            <div className="col-span-3 flex flex-col items-center md:items-start p-2">
                              <Avatar className="h-12 w-12 mb-2">
                                <AvatarImage src={team2?.logo} />
                                <AvatarFallback>{team2?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <h4 className="font-semibold text-center md:text-left">{team2?.name}</h4>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 flex flex-wrap justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Venue</p>
                            <p className="font-medium">{match.venue}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Date & Time</p>
                            <p className="font-medium">{format(match.date, "PPP 'at' h:mm a")}</p>
                          </div>
                          
                          <div>
                            <Badge variant={match.status === "completed" ? "default" : "outline"}>
                              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-secondary/20 rounded-lg">
                <p className="text-muted-foreground">No matches have been scheduled yet</p>
                {user?.role === "admin" && (
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => setIsPlanningMatch(true)}
                  >
                    Schedule First Match
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Match Planning Dialog */}
        {isPlanningMatch && (
          <Dialog open={isPlanningMatch} onOpenChange={setIsPlanningMatch}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Match</DialogTitle>
                <DialogDescription>
                  Create a new match between teams in this auction
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">Home Team</label>
                  <Select onValueChange={(value) => {}}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">Away Team</label>
                  <Select onValueChange={(value) => {}}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">Venue</label>
                  <input
                    className="col-span-3 border rounded-md p-2"
                    placeholder="Enter venue"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">Date</label>
                  <input
                    type="datetime-local"
                    className="col-span-3 border rounded-md p-2"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPlanningMatch(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Here we would handle the form submission
                  handleAddMatch({
                    team1Id: teams[0].id, // Placeholder
                    team2Id: teams[1].id, // Placeholder
                    venue: "Default Stadium",
                    date: new Date().toISOString()
                  });
                }}>
                  Schedule Match
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

export default AuctionMatchesPage;
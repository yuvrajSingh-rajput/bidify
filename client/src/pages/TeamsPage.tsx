
import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Mock data for teams
const mockTeams = [
  {
    id: 1,
    name: "Super Kings",
    owner: "John Doe",
    logo: "/placeholder.svg",
    playerCount: 15,
    budget: { total: 100000, spent: 75000, remaining: 25000 },
    wins: 6,
    losses: 4,
    points: 12,
    description: "Four-time champions looking to reclaim their throne.",
  },
  {
    id: 2,
    name: "Mumbai Indians",
    owner: "Jane Smith",
    logo: "/placeholder.svg",
    playerCount: 16,
    budget: { total: 100000, spent: 82000, remaining: 18000 },
    wins: 7,
    losses: 3,
    points: 14, 
    description: "The most successful team in the league's history with five championships.",
  },
  {
    id: 3,
    name: "Royal Challengers",
    owner: "Robert Johnson",
    logo: "/placeholder.svg",
    playerCount: 14,
    budget: { total: 100000, spent: 90000, remaining: 10000 },
    wins: 5,
    losses: 5,
    points: 10,
    description: "A star-studded lineup known for explosive batting.",
  },
  {
    id: 4,
    name: "Knight Riders",
    owner: "Michael Wilson",
    logo: "/placeholder.svg",
    playerCount: 15,
    budget: { total: 100000, spent: 70000, remaining: 30000 },
    wins: 4,
    losses: 6,
    points: 8,
    description: "Two-time champions with a focus on young talent.",
  },
  {
    id: 5,
    name: "Delhi Capitals",
    owner: "Sarah Brown",
    logo: "/placeholder.svg",
    playerCount: 16,
    budget: { total: 100000, spent: 85000, remaining: 15000 },
    wins: 6,
    losses: 4,
    points: 12,
    description: "A revitalized franchise aiming for their first title.",
  },
];

// Mock data for a team's players
const mockPlayers = [
  { id: 1, name: "Virat Kohli", role: "Batsman", price: 15000, image: "/placeholder.svg" },
  { id: 2, name: "Jasprit Bumrah", role: "Bowler", price: 14000, image: "/placeholder.svg" },
  { id: 3, name: "Hardik Pandya", role: "All-rounder", price: 12000, image: "/placeholder.svg" },
  { id: 4, name: "Rishabh Pant", role: "Wicket-keeper", price: 11000, image: "/placeholder.svg" },
  { id: 5, name: "Ravindra Jadeja", role: "All-rounder", price: 10000, image: "/placeholder.svg" },
];

// Mock data for a team's matches
const mockMatches = [
  { id: 1, opponent: "Royal Challengers", date: "2023-06-10", result: "Won by 5 wickets", status: "completed" },
  { id: 2, opponent: "Mumbai Indians", date: "2023-06-15", result: "Lost by 20 runs", status: "completed" },
  { id: 3, opponent: "Rajasthan Royals", date: "2023-06-21", result: "", status: "upcoming" },
];

const TeamsPage = () => {
  const [teams] = useState(mockTeams);
  const [filteredTeams, setFilteredTeams] = useState(teams);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query) {
      setFilteredTeams(teams.filter(team => 
        team.name.toLowerCase().includes(query) ||
        team.owner.toLowerCase().includes(query)
      ));
    } else {
      setFilteredTeams(teams);
    }
  };

  const openTeamDetails = (team) => {
    setSelectedTeam(team);
  };

  const closeTeamDetails = () => {
    setSelectedTeam(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold">Teams</h1>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search teams..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map((team) => (
              <Card key={team.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{team.name}</CardTitle>
                    <Badge variant="outline">Rank #{filteredTeams.indexOf(team) + 1}</Badge>
                  </div>
                  <CardDescription>Owner: {team.owner}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={team.logo} alt={team.name} />
                      <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Players:</span> {team.playerCount}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Budget:</span> ₹{team.budget.remaining.toLocaleString()}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Wins:</span> {team.wins}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Losses:</span> {team.losses}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{team.description}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full" onClick={() => openTeamDetails(team)}>
                    View Team Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredTeams.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No teams found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      {selectedTeam && (
        <Dialog open={!!selectedTeam} onOpenChange={closeTeamDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedTeam.name}</DialogTitle>
              <DialogDescription>Team details and statistics</DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center gap-4 my-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={selectedTeam.logo} alt={selectedTeam.name} />
                <AvatarFallback>{selectedTeam.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm mb-1">
                  <span className="text-muted-foreground">Owner:</span> {selectedTeam.owner}
                </p>
                <p className="text-sm mb-1">
                  <span className="text-muted-foreground">Players:</span> {selectedTeam.playerCount}
                </p>
                <p className="text-sm mb-1">
                  <span className="text-muted-foreground">Points:</span> {selectedTeam.points} (W: {selectedTeam.wins}, L: {selectedTeam.losses})
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 my-4">
              <div className="text-center p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">Total Budget</p>
                <p className="font-semibold">₹{selectedTeam.budget.total.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">Spent</p>
                <p className="font-semibold">₹{selectedTeam.budget.spent.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="font-semibold">₹{selectedTeam.budget.remaining.toLocaleString()}</p>
              </div>
            </div>
            
            <Separator />
            
            <Tabs defaultValue="players" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="players">Players</TabsTrigger>
                <TabsTrigger value="matches">Matches</TabsTrigger>
              </TabsList>
              
              <TabsContent value="players">
                <div className="space-y-3 mt-4">
                  {mockPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={player.image} />
                          <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className="text-xs text-muted-foreground">{player.role}</p>
                        </div>
                      </div>
                      <Badge variant="outline">₹{player.price.toLocaleString()}</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="matches">
                <div className="space-y-3 mt-4">
                  {mockMatches.map((match) => (
                    <div key={match.id} className="p-3 border rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">vs {match.opponent}</p>
                          <p className="text-xs text-muted-foreground">{match.date}</p>
                        </div>
                        <div>
                          {match.status === 'completed' ? (
                            <Badge variant={match.result.startsWith("Won") ? "default" : "secondary"}>
                              {match.result}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Upcoming</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default TeamsPage;


import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock data for team details
const mockTeam = {
  name: "Super Kings",
  owner: "John Doe",
  logo: "/placeholder.svg",
  budget: {
    total: 100000,
    spent: 75000,
    remaining: 25000
  },
  players: [
    { id: 1, name: "Virat Kohli", role: "Batsman", price: 15000, image: "/placeholder.svg", stats: { matches: 15, runs: 450, wickets: 0, average: 45.0 } },
    { id: 2, name: "Jasprit Bumrah", role: "Bowler", price: 14000, image: "/placeholder.svg", stats: { matches: 15, runs: 50, wickets: 20, average: 18.5 } },
    { id: 3, name: "Hardik Pandya", role: "All-rounder", price: 12000, image: "/placeholder.svg", stats: { matches: 15, runs: 250, wickets: 12, average: 28.3 } },
    { id: 4, name: "Rishabh Pant", role: "Wicket-keeper", price: 11000, image: "/placeholder.svg", stats: { matches: 15, runs: 320, wickets: 0, average: 32.0 } },
    { id: 5, name: "Ravindra Jadeja", role: "All-rounder", price: 10000, image: "/placeholder.svg", stats: { matches: 15, runs: 180, wickets: 15, average: 22.5 } },
  ],
  matches: [
    { id: 1, opponent: "Royal Challengers", date: "2023-06-10", result: "Won by 5 wickets", status: "completed" },
    { id: 2, opponent: "Mumbai Indians", date: "2023-06-15", result: "Lost by 20 runs", status: "completed" },
    { id: 3, opponent: "Rajasthan Royals", date: "2023-06-21", result: "", status: "upcoming" },
  ]
};

const MyTeamPage = () => {
  const { user } = useAuth();
  const [team] = useState(mockTeam);

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">My Team</h1>
          
          {/* Team Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={team.logo} alt={team.name} />
                <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{team.name}</CardTitle>
                <CardDescription>Owner: {team.owner}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-semibold">₹{team.budget.total.toLocaleString()}</p>
                </div>
                <div className="border p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Spent</p>
                  <p className="text-2xl font-semibold">₹{team.budget.spent.toLocaleString()}</p>
                </div>
                <div className="border p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-semibold">₹{team.budget.remaining.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Details Tabs */}
          <Tabs defaultValue="players">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="players">Players</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
            </TabsList>
            
            {/* Players Tab */}
            <TabsContent value="players">
              <Card>
                <CardHeader>
                  <CardTitle>Squad Members</CardTitle>
                  <CardDescription>Players acquired during auction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {team.players.map((player) => (
                      <div key={player.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Avatar>
                          <AvatarImage src={player.image} />
                          <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{player.name}</h3>
                            <span className="text-sm">₹{player.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <Badge variant="outline">{player.role}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {player.stats.runs} runs | {player.stats.wickets} wickets
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Matches Tab */}
            <TabsContent value="matches">
              <Card>
                <CardHeader>
                  <CardTitle>Team Matches</CardTitle>
                  <CardDescription>Upcoming and completed matches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {team.matches.map((match) => (
                      <div key={match.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">vs {match.opponent}</h3>
                            <p className="text-sm text-muted-foreground">{match.date}</p>
                          </div>
                          <div className="text-right">
                            {match.status === "completed" ? (
                              <Badge variant={match.result.startsWith("Won") ? "default" : "destructive"}>
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyTeamPage;

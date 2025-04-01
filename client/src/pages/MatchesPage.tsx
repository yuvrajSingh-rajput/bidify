
import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Calendar as CalendarIcon, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import MatchDetailsDialog from "@/components/matches/MatchDetailsDialog";

// Mock data for matches
const mockMatches = {
  upcoming: [
    { id: 1, team1: "Super Kings", team2: "Royal Challengers", date: "2023-06-25", time: "19:30", venue: "M. A. Chidambaram Stadium", status: "upcoming" },
    { id: 2, team1: "Mumbai Indians", team2: "Knight Riders", date: "2023-06-27", time: "19:30", venue: "Wankhede Stadium", status: "upcoming" },
    { id: 3, team1: "Rajasthan Royals", team2: "Delhi Capitals", date: "2023-06-29", time: "15:30", venue: "Sawai Mansingh Stadium", status: "upcoming" },
  ],
  completed: [
    { 
      id: 4, 
      team1: "Super Kings", 
      team2: "Mumbai Indians", 
      date: "2023-06-15", 
      time: "19:30", 
      venue: "M. A. Chidambaram Stadium", 
      status: "completed",
      result: {
        winner: "Super Kings",
        winningMargin: "5 wickets",
        summary: "Super Kings won by 5 wickets with 3 balls remaining"
      },
      scores: {
        team1: { runs: 180, wickets: 6, overs: 20 },
        team2: { runs: 181, wickets: 5, overs: 19.3 }
      }
    },
    { 
      id: 5, 
      team1: "Royal Challengers", 
      team2: "Knight Riders", 
      date: "2023-06-18", 
      time: "19:30", 
      venue: "M. Chinnaswamy Stadium", 
      status: "completed",
      result: {
        winner: "Knight Riders",
        winningMargin: "20 runs",
        summary: "Knight Riders won by 20 runs"
      },
      scores: {
        team1: { runs: 200, wickets: 5, overs: 20 },
        team2: { runs: 180, wickets: 8, overs: 20 }
      }
    },
    { 
      id: 6, 
      team1: "Delhi Capitals", 
      team2: "Rajasthan Royals", 
      date: "2023-06-20", 
      time: "15:30", 
      venue: "Arun Jaitley Stadium", 
      status: "completed",
      result: {
        winner: "Delhi Capitals",
        winningMargin: "7 wickets",
        summary: "Delhi Capitals won by 7 wickets with 10 balls remaining"
      },
      scores: {
        team1: { runs: 165, wickets: 9, overs: 20 },
        team2: { runs: 166, wickets: 3, overs: 18.2 }
      }
    },
  ]
};

const MatchesPage = () => {
  const [matches] = useState(mockMatches);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const openMatchDetails = (match) => {
    setSelectedMatch(match);
  };

  const closeMatchDetails = () => {
    setSelectedMatch(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">Matches</h1>
          
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upcoming">Upcoming Matches</TabsTrigger>
              <TabsTrigger value="completed">Completed Matches</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.upcoming.map((match) => (
                  <Card key={match.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Match #{match.id}</CardTitle>
                        <Badge variant="outline">Upcoming</Badge>
                      </div>
                      <CardDescription>
                        {format(new Date(match.date), "PPP")} at {match.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 items-center text-center mb-4">
                        <div className="text-right pr-2">
                          <p className="font-semibold">{match.team1}</p>
                        </div>
                        <div className="text-center">
                          <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-medium">VS</span>
                        </div>
                        <div className="text-left pl-2">
                          <p className="font-semibold">{match.team2}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="h-4 w-4" />
                        <span>{match.venue}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" onClick={() => openMatchDetails(match)}>
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-4 w-4 mr-1" /> Reminder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {matches.upcoming.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No upcoming matches scheduled.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.completed.map((match) => (
                  <Card key={match.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Match #{match.id}</CardTitle>
                        <Badge variant={match.result.winner === "Super Kings" ? "default" : "secondary"}>Completed</Badge>
                      </div>
                      <CardDescription>
                        {format(new Date(match.date), "PPP")} at {match.venue}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 items-center text-center mb-4">
                        <div className="text-right pr-2">
                          <p className={`font-semibold ${match.result.winner === match.team1 ? "text-bidfy-blue" : ""}`}>
                            {match.team1}
                          </p>
                          <p className="text-sm">{match.scores.team1.runs}/{match.scores.team1.wickets}</p>
                        </div>
                        <div className="text-center">
                          <span className="bg-slate-100 px-3 py-1 rounded-full text-xs">VS</span>
                        </div>
                        <div className="text-left pl-2">
                          <p className={`font-semibold ${match.result.winner === match.team2 ? "text-bidfy-blue" : ""}`}>
                            {match.team2}
                          </p>
                          <p className="text-sm">{match.scores.team2.runs}/{match.scores.team2.wickets}</p>
                        </div>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="text-sm text-center py-1">
                        {match.result.summary}
                      </div>
                      
                      <div className="flex justify-center mt-3">
                        <Button variant="outline" size="sm" onClick={() => openMatchDetails(match)}>
                          Match Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {matches.completed.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No completed matches yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {selectedMatch && (
        <MatchDetailsDialog match={selectedMatch} open={!!selectedMatch} onClose={closeMatchDetails} />
      )}
    </MainLayout>
  );
};

export default MatchesPage;

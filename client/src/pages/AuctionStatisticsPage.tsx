import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock stats data
const mockStatsData = [
  {
    playerId: "1",
    playerName: "Virat Kohli",
    teamId: "3",
    teamName: "Royal Challengers",
    auctionId: "1",
    matches: 5,
    runs: 230,
    wickets: 0,
    highestScore: 85,
    bestBowling: "0/0",
    image: ""
  },
  {
    playerId: "2",
    playerName: "Rohit Sharma",
    teamId: "1",
    teamName: "Mumbai Indians",
    auctionId: "1",
    matches: 5,
    runs: 210,
    wickets: 0,
    highestScore: 78,
    bestBowling: "0/0",
    image: ""
  },
  {
    playerId: "3",
    playerName: "Jasprit Bumrah",
    teamId: "1",
    teamName: "Mumbai Indians",
    auctionId: "1",
    matches: 5,
    runs: 45,
    wickets: 12,
    highestScore: 22,
    bestBowling: "4/25",
    image: ""
  },
  {
    playerId: "4",
    playerName: "MS Dhoni",
    teamId: "2",
    teamName: "Chennai Super Kings",
    auctionId: "1",
    matches: 5,
    runs: 180,
    wickets: 0,
    highestScore: 65,
    bestBowling: "0/0",
    image: ""
  }
];

// Team performance data
const mockTeamPerformance = [
  { name: "Mumbai Indians", wins: 3, losses: 2, auctionId: "1" },
  { name: "Chennai Super Kings", wins: 2, losses: 3, auctionId: "1" },
  { name: "Royal Challengers", wins: 2, losses: 3, auctionId: "1" }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AuctionStatisticsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [statistics, setStatistics] = useState<any[]>([]);
  const [teamStats, setTeamStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Filter stats by auctionId
        const auctionStats = mockStatsData.filter(stat => stat.auctionId === id);
        const auctionTeamStats = mockTeamPerformance.filter(team => team.auctionId === id);
        
        setStatistics(auctionStats);
        setTeamStats(auctionTeamStats);
      } catch (error) {
        console.error("Error fetching statistics data:", error);
        toast({
          title: "Error",
          description: "Failed to load statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  // Generate data for the pie chart
  const runsScoredPieData = teamStats.map(team => ({
    name: team.name,
    value: statistics
      .filter(stat => stat.teamName === team.name)
      .reduce((sum, player) => sum + player.runs, 0)
  }));

  // Top batsmen by runs
  const topBatsmen = [...statistics]
    .sort((a, b) => b.runs - a.runs)
    .slice(0, 5);

  // Top bowlers by wickets
  const topBowlers = [...statistics]
    .sort((a, b) => b.wickets - a.wickets)
    .slice(0, 5);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="text-lg">Loading statistics...</span>
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
            <h1 className="text-3xl font-bold">Auction Statistics</h1>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Link to={`/auctions/${id}/matches`}>
              <Button variant="outline" className="flex items-center gap-2">
                Matches
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Run Scorers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Top Run Scorers</CardTitle>
              <CardDescription>Highest run scorers in this auction</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topBatsmen} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="playerName" type="category" width={100} />
                  <Tooltip
                    formatter={(value, name, props) => [`${value} runs`, props.payload.playerName]}
                    labelFormatter={() => ""}
                  />
                  <Legend />
                  <Bar dataKey="runs" fill="#8884d8" name="Runs" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Player</th>
                      <th className="text-left py-2">Team</th>
                      <th className="text-right py-2">Runs</th>
                      <th className="text-right py-2">HS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topBatsmen.map((player) => (
                      <tr key={player.playerId} className="border-b">
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={player.image} />
                              <AvatarFallback>{player.playerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{player.playerName}</span>
                          </div>
                        </td>
                        <td className="py-2">{player.teamName}</td>
                        <td className="text-right py-2">{player.runs}</td>
                        <td className="text-right py-2">{player.highestScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Wicket Takers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Top Wicket Takers</CardTitle>
              <CardDescription>Most successful bowlers in this auction</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topBowlers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="playerName" type="category" width={100} />
                  <Tooltip
                    formatter={(value, name, props) => [`${value} wickets`, props.payload.playerName]}
                    labelFormatter={() => ""}
                  />
                  <Legend />
                  <Bar dataKey="wickets" fill="#82ca9d" name="Wickets" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Player</th>
                      <th className="text-left py-2">Team</th>
                      <th className="text-right py-2">Wickets</th>
                      <th className="text-right py-2">Best</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topBowlers.map((player) => (
                      <tr key={player.playerId} className="border-b">
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={player.image} />
                              <AvatarFallback>{player.playerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{player.playerName}</span>
                          </div>
                        </td>
                        <td className="py-2">{player.teamName}</td>
                        <td className="text-right py-2">{player.wickets}</td>
                        <td className="text-right py-2">{player.bestBowling}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Team Performance</CardTitle>
              <CardDescription>Win/loss record for each team</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teamStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="wins" fill="#8884d8" name="Wins" />
                  <Bar dataKey="losses" fill="#82ca9d" name="Losses" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Team</th>
                      <th className="text-right py-2">Wins</th>
                      <th className="text-right py-2">Losses</th>
                      <th className="text-right py-2">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamStats.map((team, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{team.name}</td>
                        <td className="text-right py-2">{team.wins}</td>
                        <td className="text-right py-2">{team.losses}</td>
                        <td className="text-right py-2">{team.wins * 2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Runs Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Runs Distribution</CardTitle>
              <CardDescription>Total runs scored by each team</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={runsScoredPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {runsScoredPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} runs`, 'Total Runs']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Team</th>
                      <th className="text-right py-2">Total Runs</th>
                      <th className="text-right py-2">Matches</th>
                      <th className="text-right py-2">Avg/Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runsScoredPieData.map((team, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{team.name}</td>
                        <td className="text-right py-2">{team.value}</td>
                        <td className="text-right py-2">5</td>
                        <td className="text-right py-2">{(team.value / 5).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AuctionStatisticsPage;

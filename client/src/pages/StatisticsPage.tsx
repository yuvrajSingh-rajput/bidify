
import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock data for statistics
const battingData = [
  { name: "V Kohli", runs: 450, team: "Royal Challengers" },
  { name: "R Sharma", runs: 420, team: "Mumbai Indians" },
  { name: "KL Rahul", runs: 380, team: "Punjab Kings" },
  { name: "S Iyer", runs: 350, team: "Delhi Capitals" },
  { name: "MS Dhoni", runs: 320, team: "Super Kings" },
];

const bowlingData = [
  { name: "J Bumrah", wickets: 20, team: "Mumbai Indians" },
  { name: "R Chahar", wickets: 18, team: "Mumbai Indians" },
  { name: "R Jadeja", wickets: 16, team: "Super Kings" },
  { name: "Y Chahal", wickets: 15, team: "Royal Challengers" },
  { name: "T Boult", wickets: 14, team: "Mumbai Indians" },
];

const teamPerformanceData = [
  { name: "Mumbai Indians", wins: 7, losses: 3 },
  { name: "Super Kings", wins: 6, losses: 4 },
  { name: "Delhi Capitals", wins: 6, losses: 4 },
  { name: "Royal Challengers", wins: 5, losses: 5 },
  { name: "Knight Riders", wins: 4, losses: 6 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatisticsPage = () => {
  const [season, setSeason] = useState("2023");
  
  // Generate data for the pie chart
  const runsScoredPieData = [
    { name: "Super Kings", value: 1420 },
    { name: "Mumbai Indians", value: 1380 },
    { name: "Royal Challengers", value: 1350 },
    { name: "Delhi Capitals", value: 1320 },
    { name: "Knight Riders", value: 1280 }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold">Statistics</h1>
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">Season 2023</SelectItem>
                <SelectItem value="2022">Season 2022</SelectItem>
                <SelectItem value="2021">Season 2021</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="players" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="players">Player Stats</TabsTrigger>
              <TabsTrigger value="teams">Team Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="players">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Run Scorers */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Top Run Scorers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={battingData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip
                          formatter={(value, name, props) => [`${value} runs`, props.payload.name]}
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
                          </tr>
                        </thead>
                        <tbody>
                          {battingData.map((player, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{player.name}</td>
                              <td className="py-2">{player.team}</td>
                              <td className="text-right py-2">{player.runs}</td>
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
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={bowlingData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip
                          formatter={(value, name, props) => [`${value} wickets`, props.payload.name]}
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
                          </tr>
                        </thead>
                        <tbody>
                          {bowlingData.map((player, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{player.name}</td>
                              <td className="py-2">{player.team}</td>
                              <td className="text-right py-2">{player.wickets}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="teams">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Team Performance */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Team Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={teamPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" scale="band" tickFormatter={(value) => value.split(' ')[0]} />
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
                          {teamPerformanceData.map((team, index) => (
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
                
                {/* Runs Scored by Teams */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Runs Scored by Teams</CardTitle>
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
                              <td className="text-right py-2">10</td>
                              <td className="text-right py-2">{(team.value / 10).toFixed(1)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default StatisticsPage;

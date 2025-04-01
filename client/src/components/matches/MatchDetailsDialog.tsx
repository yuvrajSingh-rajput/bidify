
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface MatchDetailsDialogProps {
  match: any; // Using any type for simplicity, should be properly typed in production
  open: boolean;
  onClose: () => void;
}

const MatchDetailsDialog = ({ match, open, onClose }: MatchDetailsDialogProps) => {
  const isCompleted = match.status === "completed";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Match Details</DialogTitle>
          <DialogDescription>
            {match.team1} vs {match.team2} - {isCompleted ? "Match Summary" : "Match Preview"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Match Date</p>
              <p className="font-medium">{format(new Date(match.date), "PPP")} at {match.time}</p>
            </div>
            <Badge variant={isCompleted ? "secondary" : "outline"}>
              {isCompleted ? "Completed" : "Upcoming"}
            </Badge>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Venue</p>
            <p className="font-medium">{match.venue}</p>
          </div>
          
          <Separator />
          
          {isCompleted ? (
            // Completed match details
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center text-center">
                <div className="text-right pr-2">
                  <p className={`font-semibold text-lg ${match.result.winner === match.team1 ? "text-bidfy-blue" : ""}`}>
                    {match.team1}
                  </p>
                  <p className="text-xl font-bold">{match.scores.team1.runs}/{match.scores.team1.wickets}</p>
                  <p className="text-xs text-muted-foreground">{match.scores.team1.overs} overs</p>
                </div>
                <div className="text-center">
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">VS</span>
                </div>
                <div className="text-left pl-2">
                  <p className={`font-semibold text-lg ${match.result.winner === match.team2 ? "text-bidfy-blue" : ""}`}>
                    {match.team2}
                  </p>
                  <p className="text-xl font-bold">{match.scores.team2.runs}/{match.scores.team2.wickets}</p>
                  <p className="text-xs text-muted-foreground">{match.scores.team2.overs} overs</p>
                </div>
              </div>
              
              <div className="text-center py-2 bg-slate-50 rounded-md">
                <p className="font-medium">{match.result.summary}</p>
              </div>
              
              <Separator />
              
              <Tabs defaultValue="scoreboard">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="scoreboard">Scoreboard</TabsTrigger>
                  <TabsTrigger value="highlights">Highlights</TabsTrigger>
                  <TabsTrigger value="stats">Match Stats</TabsTrigger>
                </TabsList>
                
                <TabsContent value="scoreboard" className="mt-4">
                  <div className="space-y-4">
                    {/* Example mockup scoreboard data */}
                    <Card>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold mb-2">{match.team1} Innings</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm border-b pb-1">
                            <span className="font-medium">MS Dhoni (c)</span>
                            <span>62 (38)</span>
                          </div>
                          <div className="flex justify-between text-sm border-b pb-1">
                            <span className="font-medium">R Jadeja</span>
                            <span>35 (22)</span>
                          </div>
                          <div className="flex justify-between text-sm border-b pb-1">
                            <span className="font-medium">F du Plessis</span>
                            <span>28 (24)</span>
                          </div>
                          <div className="flex justify-between text-sm border-b pb-1">
                            <span className="font-medium">S Raina</span>
                            <span>24 (18)</span>
                          </div>
                          <div className="flex justify-between text-sm border-b pb-1">
                            <span className="font-medium">A Rayudu</span>
                            <span>19 (15)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold mb-2">{match.team2} Innings</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm border-b pb-1">
                            <span className="font-medium">R Sharma (c)</span>
                            <span>45 (32)</span>
                          </div>
                          <div className="flex justify-between text-sm border-b pb-1">
                            <span className="font-medium">K Pollard</span>
                            <span>38 (25)</span>
                          </div>
                          <div className="flex justify-between text-sm border-b pb-1">
                            <span className="font-medium">H Pandya</span>
                            <span>32 (20)</span>
                          </div>
                          <div className="flex justify-between text-sm border-b pb-1">
                            <span className="font-medium">I Kishan</span>
                            <span>28 (22)</span>
                          </div>
                          <div className="flex justify-between text-sm border-b pb-1">
                            <span className="font-medium">S Tiwary</span>
                            <span>15 (12)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="highlights" className="mt-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <p className="font-medium">MS Dhoni's explosive batting</p>
                      <p className="text-sm text-muted-foreground">
                        MS Dhoni smashed 5 sixes in the final overs to set up a challenging total.
                      </p>
                    </div>
                    <div className="p-3 border rounded-md">
                      <p className="font-medium">Key breakthrough by D Chahar</p>
                      <p className="text-sm text-muted-foreground">
                        Deepak Chahar took the crucial wicket of Rohit Sharma just as he was starting to accelerate.
                      </p>
                    </div>
                    <div className="p-3 border rounded-md">
                      <p className="font-medium">Jadeja's all-round brilliance</p>
                      <p className="text-sm text-muted-foreground">
                        Ravindra Jadeja scored quick runs and took 3 wickets to help secure the victory.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="stats" className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded-md">
                      <p className="text-sm text-muted-foreground">Top Scorer</p>
                      <p className="font-medium">MS Dhoni (62)</p>
                      <p className="text-xs">{match.team1}</p>
                    </div>
                    <div className="text-center p-3 border rounded-md">
                      <p className="text-sm text-muted-foreground">Best Bowler</p>
                      <p className="font-medium">R Jadeja (3/25)</p>
                      <p className="text-xs">{match.team1}</p>
                    </div>
                    <div className="text-center p-3 border rounded-md">
                      <p className="text-sm text-muted-foreground">Highest Strike Rate</p>
                      <p className="font-medium">MS Dhoni (163.16)</p>
                      <p className="text-xs">Min. 20 runs</p>
                    </div>
                    <div className="text-center p-3 border rounded-md">
                      <p className="text-sm text-muted-foreground">Best Economy</p>
                      <p className="font-medium">J Bumrah (6.25)</p>
                      <p className="text-xs">Min. 3 overs</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            // Upcoming match details
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center text-center py-4">
                <div className="text-right pr-2">
                  <p className="font-semibold text-lg">{match.team1}</p>
                </div>
                <div className="text-center">
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">VS</span>
                </div>
                <div className="text-left pl-2">
                  <p className="font-semibold text-lg">{match.team2}</p>
                </div>
              </div>
              
              <Tabs defaultValue="preview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">Match Preview</TabsTrigger>
                  <TabsTrigger value="head-to-head">Head to Head</TabsTrigger>
                  <TabsTrigger value="teams">Team News</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="mt-4">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="mb-3">
                        This promises to be an exciting encounter between two strong teams. Both sides feature star players who can change the game in an instant.
                      </p>
                      <p className="mb-3">
                        {match.team1} come into this match with good form, having won their last two matches. They will be looking to maintain their momentum.
                      </p>
                      <p>
                        {match.team2} will be eager to bounce back from their narrow defeat in their previous match and climb up the points table.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="head-to-head" className="mt-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center mb-4">
                        <div className="grid grid-cols-3 items-center">
                          <div>
                            <p className="text-3xl font-bold">3</p>
                            <p className="text-xs text-muted-foreground">{match.team1} wins</p>
                          </div>
                          <div>
                            <p className="text-3xl font-bold">5</p>
                            <p className="text-xs text-muted-foreground">Matches</p>
                          </div>
                          <div>
                            <p className="text-3xl font-bold">2</p>
                            <p className="text-xs text-muted-foreground">{match.team2} wins</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b pb-1">
                          <span>Last match</span>
                          <span>{match.team1} won by 25 runs</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span>Highest team score</span>
                          <span>{match.team1} (210/3)</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span>Lowest team score</span>
                          <span>{match.team2} (120 all out)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="teams" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card>
                      <CardContent className="pt-4 pb-2">
                        <CardDescription className="mb-2 font-medium">{match.team1} Probable XI</CardDescription>
                        <ul className="text-sm space-y-1">
                          <li>MS Dhoni (c & wk)</li>
                          <li>F du Plessis</li>
                          <li>R Gaikwad</li>
                          <li>S Raina</li>
                          <li>A Rayudu</li>
                          <li>R Jadeja</li>
                          <li>D Bravo</li>
                          <li>S Thakur</li>
                          <li>D Chahar</li>
                          <li>L Ngidi</li>
                          <li>M Santner</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-4 pb-2">
                        <CardDescription className="mb-2 font-medium">{match.team2} Probable XI</CardDescription>
                        <ul className="text-sm space-y-1">
                          <li>R Sharma (c)</li>
                          <li>Q de Kock (wk)</li>
                          <li>S Yadav</li>
                          <li>I Kishan</li>
                          <li>K Pollard</li>
                          <li>H Pandya</li>
                          <li>K Pandya</li>
                          <li>J Bumrah</li>
                          <li>T Boult</li>
                          <li>R Chahar</li>
                          <li>J Yadav</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchDetailsDialog;

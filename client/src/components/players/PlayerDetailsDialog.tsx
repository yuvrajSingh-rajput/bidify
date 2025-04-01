
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PlayerDetailsDialogProps {
  player: {
    id: number;
    name: string;
    role: string;
    country: string;
    image: string;
    basePrice: number;
    stats: {
      matches: number;
      runs: number;
      wickets: number;
      average: number;
      economy?: number;
      strikeRate?: number;
    };
    team: string | null;
    inAuctionPool: boolean;
  };
  open: boolean;
  onClose: () => void;
}

const PlayerDetailsDialog = ({ player, open, onClose }: PlayerDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{player.name}</DialogTitle>
          <DialogDescription>Player details and statistics</DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-4 my-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={player.image} alt={player.name} />
            <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline">{player.role}</Badge>
              <span className="text-sm">{player.country}</span>
            </div>
            <div className="mb-1">
              Base Price: <span className="font-medium">₹{player.basePrice.toLocaleString()}</span>
            </div>
            <div>
              Status: 
              <Badge className="ml-2" variant={player.inAuctionPool ? "default" : "outline"}>
                {player.inAuctionPool ? "In Auction Pool" : player.team ? `Signed with ${player.team}` : "Free Agent"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="stats">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">Career Stats</TabsTrigger>
            <TabsTrigger value="history">Auction History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-2 border rounded-md">
                    <p className="text-sm text-muted-foreground">Matches</p>
                    <p className="text-xl font-semibold">{player.stats.matches}</p>
                  </div>
                  
                  <div className="text-center p-2 border rounded-md">
                    <p className="text-sm text-muted-foreground">Runs</p>
                    <p className="text-xl font-semibold">{player.stats.runs}</p>
                  </div>
                  
                  <div className="text-center p-2 border rounded-md">
                    <p className="text-sm text-muted-foreground">Wickets</p>
                    <p className="text-xl font-semibold">{player.stats.wickets}</p>
                  </div>
                  
                  {player.stats.average > 0 && (
                    <div className="text-center p-2 border rounded-md">
                      <p className="text-sm text-muted-foreground">Batting Avg</p>
                      <p className="text-xl font-semibold">{player.stats.average.toFixed(2)}</p>
                    </div>
                  )}
                  
                  {player.stats.economy > 0 && (
                    <div className="text-center p-2 border rounded-md">
                      <p className="text-sm text-muted-foreground">Economy</p>
                      <p className="text-xl font-semibold">{player.stats.economy.toFixed(2)}</p>
                    </div>
                  )}
                  
                  {player.stats.strikeRate > 0 && (
                    <div className="text-center p-2 border rounded-md">
                      <p className="text-sm text-muted-foreground">Strike Rate</p>
                      <p className="text-xl font-semibold">{player.stats.strikeRate.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Mock auction history */}
                  {player.team ? (
                    <>
                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Season 2023</p>
                            <p className="text-sm text-muted-foreground">Auction Date: May 15, 2023</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{(player.basePrice * 1.2).toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Sold to {player.team}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Season 2022</p>
                            <p className="text-sm text-muted-foreground">Auction Date: May 20, 2022</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{(player.basePrice * 0.9).toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Sold to Previous Team</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      This player has not participated in previous auctions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDetailsDialog;

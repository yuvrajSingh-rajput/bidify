import { useState, useEffect } from "react";
import { Player, Team, Bid } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Pause } from "lucide-react";

interface LiveBiddingProps {
  player: Player;
  teams: Team[];
  currentBid: number;
  timeLeft: number;
  onPlaceBid: (amount: number) => void;
  biddingHistory: Bid[];
  isPaused?: boolean;
}

const LiveBidding = ({
  player,
  teams,
  currentBid,
  timeLeft,
  onPlaceBid,
  biddingHistory,
  isPaused = false,
}: LiveBiddingProps) => {
  const [bidAmount, setBidAmount] = useState(currentBid + 100000); // Default increment
  const [timeRemaining, setTimeRemaining] = useState(timeLeft);
  const { toast } = useToast();
  const { user } = useAuth(); // Get the current user
  const isTeamOwner = user?.role === "team_owner";

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining <= 0 || isPaused) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining, isPaused]);

  // Reset timer when a new bid comes in
  useEffect(() => {
    setTimeRemaining(timeLeft);
  }, [timeLeft, currentBid]);

  const handleBid = () => {
    if (isPaused) {
      toast({
        title: "Auction Paused",
        description: "Bidding is temporarily paused by the admin.",
        variant: "destructive",
      });
      return;
    }
    
    if (bidAmount <= currentBid) {
      toast({
        title: "Invalid bid amount",
        description: "Your bid must be higher than the current bid.",
        variant: "destructive",
      });
      return;
    }
    
    onPlaceBid(bidAmount);
  };

  const getTeamById = (teamId: string) => {
    return teams.find((team) => team.id === teamId) || {
      name: "Unknown Team",
      logo: undefined,
    };
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Find current highest bidder
  const highestBid = biddingHistory.length > 0 ? biddingHistory[0] : null;
  const highestBidTeam = highestBid ? getTeamById(highestBid.teamId) : null;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Player Info */}
      <Card className="p-6 md:col-span-1">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-3">
            {player.image ? (
              <AvatarImage src={player.image} alt={player.name} />
            ) : (
              <AvatarFallback className="text-xl bg-bidfy-blue text-white">
                {getInitials(player.name)}
              </AvatarFallback>
            )}
          </Avatar>
          
          <h2 className="text-2xl font-bold mb-1">{player.name}</h2>
          <Badge className="mb-4">
            {player.role}
          </Badge>
          
          <div className="w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-500 text-sm">Matches</div>
                <div className="font-semibold">{player.stats.matches}</div>
              </div>
              
              {player.stats.runs !== undefined && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-500 text-sm">Runs</div>
                  <div className="font-semibold">{player.stats.runs}</div>
                </div>
              )}
              
              {player.stats.wickets !== undefined && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-500 text-sm">Wickets</div>
                  <div className="font-semibold">{player.stats.wickets}</div>
                </div>
              )}
              
              {player.stats.strikeRate !== undefined && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-500 text-sm">Strike Rate</div>
                  <div className="font-semibold">{player.stats.strikeRate}</div>
                </div>
              )}
              
              {player.stats.economy !== undefined && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-500 text-sm">Economy</div>
                  <div className="font-semibold">{player.stats.economy}</div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-gray-500 text-sm">Base Price</div>
              <div className="font-bold text-lg">₹{player.basePrice.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Bidding Interface */}
      <Card className="p-6 md:col-span-2">
        <div className="flex flex-col h-full">
          {isPaused && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2">
              <Pause className="h-5 w-5 text-amber-500" />
              <span className="font-medium text-amber-700">Auction is currently paused. Bidding will resume shortly.</span>
            </div>
          )}
          
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Current Bid</h3>
            <div className="text-4xl font-bold text-bidfy-blue mb-3">
              ₹{currentBid.toLocaleString()}
            </div>
            
            <div className="flex justify-center items-center gap-3">
              {highestBidTeam && (
                <>
                  <Avatar className="h-6 w-6">
                    {highestBidTeam.logo ? (
                      <AvatarImage src={highestBidTeam.logo} alt={highestBidTeam.name} />
                    ) : (
                      <AvatarFallback className="bg-bidfy-blue text-white text-xs">
                        {getInitials(highestBidTeam.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="font-medium">{highestBidTeam.name}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Time Left</span>
              <span>{isPaused ? "Paused" : `${timeRemaining}s`}</span>
            </div>
            <Progress value={isPaused ? 100 : (timeRemaining / timeLeft) * 100} className={`h-2 ${isPaused ? "bg-amber-200" : ""}`} />
          </div>
          
          {/* Show bidding controls only to team owners */}
          {isTeamOwner && (
            <>
              <div className="flex gap-2 mb-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setBidAmount(currentBid + 100000)}
                  disabled={isPaused}
                >
                  +1 Lakh
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setBidAmount(currentBid + 500000)}
                  disabled={isPaused}
                >
                  +5 Lakhs
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setBidAmount(currentBid + 1000000)}
                  disabled={isPaused}
                >
                  +10 Lakhs
                </Button>
              </div>
              
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="pl-8"
                    disabled={isPaused}
                  />
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                </div>
                <Button 
                  onClick={handleBid} 
                  className="bg-bidfy-blue hover:bg-blue-600"
                  disabled={isPaused}
                >
                  Place Bid
                </Button>
              </div>
            </>
          )}
          
          {/* Bid history is shown to everyone */}
          <div className="mt-auto">
            <h4 className="font-semibold mb-2">Bid History</h4>
            <div className="max-h-48 overflow-auto">
              {biddingHistory.length > 0 ? (
                <ul className="space-y-2">
                  {biddingHistory.map((bid) => {
                    const team = getTeamById(bid.teamId);
                    return (
                      <li key={bid.id} className="flex items-center gap-2 text-sm">
                        <Avatar className="h-6 w-6">
                          {team.logo ? (
                            <AvatarImage src={team.logo} alt={team.name} />
                          ) : (
                            <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                              {getInitials(team.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="font-medium">{team.name}</span>
                        <span className="ml-auto">₹{bid.amount.toLocaleString()}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No bids yet</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LiveBidding;

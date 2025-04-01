
import { Player } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PlayerCardProps {
  player: Player;
  showActions?: boolean;
  onBid?: () => void;
}

const getRoleColor = (role: Player["role"]) => {
  switch (role) {
    case "Batsman":
      return "bg-bidfy-blue text-white";
    case "Pace Bowler":
    case "Medium Pace Bowler":
    case "Spinner":
      return "bg-bidfy-green text-white";
    case "Batting All-rounder":
    case "Bowling All-rounder":
      return "bg-bidfy-amber text-white";
    case "Wicket Keeper":
      return "bg-bidfy-red text-white";
    default:
      return "bg-bidfy-gray text-white";
  }
};

const getStatusBadge = (status: Player["status"]) => {
  switch (status) {
    case "sold":
      return <Badge className="bg-green-500">Sold</Badge>;
    case "unsold":
      return <Badge variant="outline" className="text-gray-500 border-gray-300">Unsold</Badge>;
    default:
      return <Badge className="bg-bidfy-blue">Available</Badge>;
  }
};

const PlayerCard = ({ player, showActions = false, onBid }: PlayerCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="player-card-gradient overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
      <CardHeader className="pb-2 flex flex-col items-center">
        <Avatar className="h-20 w-20 mb-2">
          {player.image ? (
            <AvatarImage src={player.image} alt={player.name} />
          ) : (
            <AvatarFallback className="text-lg bg-bidfy-blue text-white">
              {getInitials(player.name)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="text-center">
          <h3 className="font-semibold text-lg">{player.name}</h3>
          <Badge className={`mt-1 ${getRoleColor(player.role)}`}>
            {player.role}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
            <span className="text-gray-500">Matches</span>
            <span className="font-semibold">{player.stats.matches}</span>
          </div>
          
          {player.stats.runs !== undefined && (
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
              <span className="text-gray-500">Runs</span>
              <span className="font-semibold">{player.stats.runs}</span>
            </div>
          )}
          
          {player.stats.wickets !== undefined && (
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
              <span className="text-gray-500">Wickets</span>
              <span className="font-semibold">{player.stats.wickets}</span>
            </div>
          )}
          
          {player.stats.average !== undefined && (
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
              <span className="text-gray-500">Average</span>
              <span className="font-semibold">{player.stats.average}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="text-sm">
          <span className="text-gray-500">Base Price:</span>{" "}
          <span className="font-semibold">₹{player.basePrice.toLocaleString()}</span>
        </div>
        {showActions ? (
          <button 
            onClick={onBid}
            className="px-3 py-1 bg-bidfy-blue text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
          >
            Bid
          </button>
        ) : (
          getStatusBadge(player.status)
        )}
      </CardFooter>
    </Card>
  );
};

export default PlayerCard;

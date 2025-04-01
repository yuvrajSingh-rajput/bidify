
import { Link } from "react-router-dom";
import { Auction } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, User, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface AuctionCardProps {
  auction: Auction;
}

const getStatusColor = (status: Auction["status"]) => {
  switch (status) {
    case "upcoming":
      return "bg-yellow-500";
    case "live":
      return "bg-green-500";
    case "completed":
      return "bg-gray-500";
    default:
      return "bg-blue-500";
  }
};

const AuctionCard = ({ auction }: AuctionCardProps) => {
  return (
    <Card className="auction-card-gradient h-full overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{auction.name}</CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-500">
              {auction.description || "No description available"}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(auction.status)}>
            {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarIcon className="h-4 w-4" />
          <span>{format(new Date(auction.startTime), "PPP")}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{format(new Date(auction.startTime), "p")}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <User className="h-4 w-4" />
          <span>{auction.teams.length} Teams</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="h-4 w-4" />
          <span>Base Budget: ₹{auction.baseBudget.toLocaleString()}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <Link to={`/auctions/${auction.id}`}>
            {auction.status === "live" ? "Join Auction" : "View Details"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuctionCard;

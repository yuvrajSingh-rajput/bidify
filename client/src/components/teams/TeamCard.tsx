
import { Team } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

interface TeamCardProps {
  team: Team;
}

const TeamCard = ({ team }: TeamCardProps) => {
  const budgetPercentage = Math.round((team.budgetSpent / team.budget) * 100);
  const remainingBudget = team.budget - team.budgetSpent;
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14">
          {team.logo ? (
            <AvatarImage src={team.logo} alt={team.name} />
          ) : (
            <AvatarFallback className="bg-bidfy-blue text-white">
              {getInitials(team.name)}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <h3 className="font-semibold text-lg">{team.name}</h3>
          <p className="text-sm text-gray-500">Owner: {team.ownerName}</p>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Budget Used</span>
            <span>{budgetPercentage}%</span>
          </div>
          <Progress value={budgetPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">Remaining Budget</span>
            <span className="font-semibold">₹{remainingBudget.toLocaleString()}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-gray-500">Spent</span>
            <span className="font-semibold">₹{team.budgetSpent.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex items-center gap-2">
        <Users className="h-4 w-4 text-gray-500" />
        <span className="text-sm">
          {team.players.length} Players
        </span>
      </CardFooter>
    </Card>
  );
};

export default TeamCard;

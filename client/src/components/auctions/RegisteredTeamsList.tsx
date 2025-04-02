
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Team } from "@/types";

interface RegisteredTeamsListProps {
  teams: Team[];
}

const RegisteredTeamsList: React.FC<RegisteredTeamsListProps> = ({ teams }) => {
  if (teams.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No teams have registered for this auction yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Team Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Players</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team) => (
          <TableRow key={team.id}>
            <TableCell>
              <Avatar className="h-8 w-8">
                <AvatarImage src={team.logo} alt={team.name} />
                <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>{team.name}</TableCell>
            <TableCell>{team.ownerName}</TableCell>
            <TableCell>₹{team.budget.toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant="outline">{team.players.length} Players</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RegisteredTeamsList;

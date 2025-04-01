
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Player } from "@/types";

interface AddPlayerFormProps {
  onSubmit: (playerData: Omit<Player, "id">) => void;
  onCancel: () => void;
}

const AddPlayerForm = ({ onSubmit, onCancel }: AddPlayerFormProps) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Player["role"]>("Batsman");
  const [country, setCountry] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [matches, setMatches] = useState("");
  const [runs, setRuns] = useState("");
  const [wickets, setWickets] = useState("");
  const [average, setAverage] = useState("");
  const [strikeRate, setStrikeRate] = useState("");
  const [economy, setEconomy] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create player object
    const playerData = {
      name,
      role,
      country,
      basePrice: parseInt(basePrice, 10),
      stats: {
        matches: parseInt(matches, 10),
        ...(runs && { runs: parseInt(runs, 10) }),
        ...(wickets && { wickets: parseInt(wickets, 10) }),
        ...(average && { average: parseFloat(average) }),
        ...(strikeRate && { strikeRate: parseFloat(strikeRate) }),
        ...(economy && { economy: parseFloat(economy) }),
      },
      status: "available" as const,
    };
    
    onSubmit(playerData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Player Name</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input 
            id="country" 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            required 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select 
            value={role} 
            onValueChange={(value: Player["role"]) => setRole(value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Batsman">Batsman</SelectItem>
              <SelectItem value="Bowler">Bowler</SelectItem>
              <SelectItem value="All-rounder">All-rounder</SelectItem>
              <SelectItem value="Wicket Keeper">Wicket Keeper</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="basePrice">Base Price (₹)</Label>
          <Input 
            id="basePrice" 
            type="number" 
            value={basePrice} 
            onChange={(e) => setBasePrice(e.target.value)} 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Player Statistics</Label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="matches" className="text-sm">Matches</Label>
            <Input 
              id="matches" 
              type="number" 
              value={matches} 
              onChange={(e) => setMatches(e.target.value)} 
              required 
            />
          </div>
          
          {(role === "Batsman" || role === "All-rounder" || role === "Wicket Keeper") && (
            <>
              <div>
                <Label htmlFor="runs" className="text-sm">Runs</Label>
                <Input 
                  id="runs" 
                  type="number" 
                  value={runs} 
                  onChange={(e) => setRuns(e.target.value)} 
                />
              </div>
              
              <div>
                <Label htmlFor="average" className="text-sm">Average</Label>
                <Input 
                  id="average" 
                  type="number" 
                  step="0.01"
                  value={average} 
                  onChange={(e) => setAverage(e.target.value)} 
                />
              </div>
              
              <div>
                <Label htmlFor="strikeRate" className="text-sm">Strike Rate</Label>
                <Input 
                  id="strikeRate" 
                  type="number" 
                  step="0.01"
                  value={strikeRate} 
                  onChange={(e) => setStrikeRate(e.target.value)} 
                />
              </div>
            </>
          )}
          
          {(role === "Bowler" || role === "All-rounder") && (
            <>
              <div>
                <Label htmlFor="wickets" className="text-sm">Wickets</Label>
                <Input 
                  id="wickets" 
                  type="number" 
                  value={wickets} 
                  onChange={(e) => setWickets(e.target.value)} 
                />
              </div>
              
              <div>
                <Label htmlFor="economy" className="text-sm">Economy</Label>
                <Input 
                  id="economy" 
                  type="number" 
                  step="0.01"
                  value={economy} 
                  onChange={(e) => setEconomy(e.target.value)} 
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Add Player</Button>
      </DialogFooter>
    </form>
  );
};

export default AddPlayerForm;

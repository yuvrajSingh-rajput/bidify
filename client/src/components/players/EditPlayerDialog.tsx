
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Image, Upload } from "lucide-react";

interface EditPlayerDialogProps {
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
  onSave: (updatedPlayer: any) => void;
}

const EditPlayerDialog = ({ player, open, onClose, onSave }: EditPlayerDialogProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(player.image);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm({
    defaultValues: {
      name: player.name,
      role: player.role,
      country: player.country,
      basePrice: player.basePrice,
      matches: player.stats.matches,
      runs: player.stats.runs,
      wickets: player.stats.wickets,
      average: player.stats.average,
      economy: player.stats.economy || 0,
      strikeRate: player.stats.strikeRate || 0,
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    // Update the player with the new data
    const updatedPlayer = {
      ...player,
      name: data.name,
      role: data.role,
      country: data.country,
      basePrice: data.basePrice,
      stats: {
        matches: data.matches,
        runs: data.runs,
        wickets: data.wickets,
        average: data.average,
        economy: data.economy,
        strikeRate: data.strikeRate,
      },
      image: imagePreview || player.image,
    };
    
    onSave(updatedPlayer);
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Player: {player.name}</DialogTitle>
          <DialogDescription>
            Update player information and statistics.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={imagePreview || ""} alt={player.name} />
                  <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="profile-image" 
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                </label>
                <input 
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div className="flex-1 space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Batsman">Batsman</SelectItem>
                            <SelectItem value="Pace Bowler">Pace Bowler</SelectItem>
                            <SelectItem value="Medium Pace Bowler">Medium Pace Bowler</SelectItem>
                            <SelectItem value="Spinner">Spinner</SelectItem>
                            <SelectItem value="Batting All-rounder">Batting All-rounder</SelectItem>
                            <SelectItem value="Bowling All-rounder">Bowling All-rounder</SelectItem>
                            <SelectItem value="Wicket Keeper">Wicket Keeper</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
              
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Career Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="matches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matches</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="runs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Runs</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="wickets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wickets</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="average"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batting Average</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="economy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Economy Rate</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="strikeRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strike Rate</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlayerDialog;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Player } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Image } from "lucide-react";

const PlayerRegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<Player["role"]>("Batsman");
  const [battingStyle, setBattingStyle] = useState<'right-handed' | 'left-handed'>('right-handed');
  const [bowlingStyle, setBowlingStyle] = useState<Player["bowlingStyle"]>("none");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [playingExperience, setPlayingExperience] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [basePrice, setBasePrice] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Cricket stats
  const [matches, setMatches] = useState("");
  const [runs, setRuns] = useState("");
  const [wickets, setWickets] = useState("");
  const [average, setAverage] = useState("");
  const [strikeRate, setStrikeRate] = useState("");
  const [economy, setEconomy] = useState("");
  
  const { toast } = useToast();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast({
        title: "Terms and conditions required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create player stats object based on role
      const playerStats = {
        matches: parseInt(matches) || 0,
        ...(runs && { runs: parseInt(runs) }),
        ...(wickets && { wickets: parseInt(wickets) }),
        ...(average && { average: parseFloat(average) }),
        ...(strikeRate && { strikeRate: parseFloat(strikeRate) }),
        ...(economy && { economy: parseFloat(economy) }),
      };
      
      // In a real app, this would be an API call to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration successful",
        description: "Your details have been sent to the admin for review."
      });
      
      // Reset form
      setName("");
      setEmail("");
      setPhoneNumber("");
      setRole("Batsman");
      setBattingStyle("right-handed");
      setBowlingStyle("none");
      setAge("");
      setBio("");
      setPlayingExperience("");
      setMatches("");
      setRuns("");
      setWickets("");
      setAverage("");
      setStrikeRate("");
      setEconomy("");
      setBasePrice("");
      setProfilePhoto(null);
      setPhotoPreview(null);
      setTermsAccepted(false);
      
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Failed to submit your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to determine if stat fields should be shown based on player role
  const shouldShowBattingStats = () => {
    return ["Batsman", "Batting All-rounder", "Wicket Keeper"].includes(role);
  };

  const shouldShowBowlingStats = () => {
    return ["Pace Bowler", "Medium Pace Bowler", "Spinner", "Bowling All-rounder"].includes(role);
  };

  // Function to determine if bowling style should be shown
  const shouldShowBowlingStyle = () => {
    return role !== "Batsman" && role !== "Wicket Keeper";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your.email@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="Your contact number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min="15"
            max="60"
            placeholder="Your age"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="basePrice">Base Price (₹)</Label>
          <Input
            id="basePrice"
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
            min="1000"
            placeholder="Your expected base price"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Playing Role</Label>
          <Select 
            value={role} 
            onValueChange={(value: Player["role"]) => setRole(value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your playing role" />
            </SelectTrigger>
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
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experience">Playing Experience (years)</Label>
          <Input
            id="experience"
            type="number"
            value={playingExperience}
            onChange={(e) => setPlayingExperience(e.target.value)}
            required
            min="0"
            placeholder="Years of playing experience"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="battingStyle">Batting Style</Label>
          <RadioGroup
            value={battingStyle}
            onValueChange={(value: 'right-handed' | 'left-handed') => setBattingStyle(value)}
            className="flex space-x-6 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="right-handed" id="right-handed" />
              <Label htmlFor="right-handed">Right Handed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="left-handed" id="left-handed" />
              <Label htmlFor="left-handed">Left Handed</Label>
            </div>
          </RadioGroup>
        </div>

        {shouldShowBowlingStyle() && (
          <div className="space-y-2">
            <Label htmlFor="bowlingStyle">Bowling Style</Label>
            <Select
              value={bowlingStyle}
              onValueChange={(value: Player["bowlingStyle"]) => setBowlingStyle(value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bowling style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="right-arm-fast">Right Arm Fast</SelectItem>
                <SelectItem value="right-arm-medium">Right Arm Medium</SelectItem>
                <SelectItem value="right-arm-off-spin">Right Arm Off-spin</SelectItem>
                <SelectItem value="left-arm-fast">Left Arm Fast</SelectItem>
                <SelectItem value="left-arm-medium">Left Arm Medium</SelectItem>
                <SelectItem value="left-arm-spin">Left Arm Spin</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="col-span-1 md:col-span-2 space-y-2">
          <Label htmlFor="profilePhoto">Profile Photo</Label>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-2 border-gray-200">
              {photoPreview ? (
                <AvatarImage src={photoPreview} alt="Profile preview" />
              ) : (
                <AvatarFallback>
                  <Image className="h-12 w-12 text-gray-400" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <Input
                id="profilePhoto"
                type="file"
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('profilePhoto')?.click()}
                className="w-full md:w-auto"
              >
                <Upload className="mr-2 h-4 w-4" />
                {profilePhoto ? 'Change Photo' : 'Upload Photo'}
              </Button>
              {profilePhoto && (
                <p className="text-sm text-gray-500 mt-1">
                  {profilePhoto.name} ({(profilePhoto.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Cricket Statistics Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Cricket Statistics</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="matches">Matches Played</Label>
            <Input
              id="matches"
              type="number"
              value={matches}
              onChange={(e) => setMatches(e.target.value)}
              required
              min="0"
              placeholder="Number of matches"
            />
          </div>
          
          {shouldShowBattingStats() && (
            <>
              <div className="space-y-2">
                <Label htmlFor="runs">Total Runs</Label>
                <Input
                  id="runs"
                  type="number"
                  value={runs}
                  onChange={(e) => setRuns(e.target.value)}
                  min="0"
                  placeholder="Total runs scored"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="average">Batting Average</Label>
                <Input
                  id="average"
                  type="number"
                  step="0.01"
                  value={average}
                  onChange={(e) => setAverage(e.target.value)}
                  min="0"
                  placeholder="Batting average"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strikeRate">Strike Rate</Label>
                <Input
                  id="strikeRate"
                  type="number"
                  step="0.01"
                  value={strikeRate}
                  onChange={(e) => setStrikeRate(e.target.value)}
                  min="0"
                  placeholder="Strike rate"
                />
              </div>
            </>
          )}
          
          {shouldShowBowlingStats() && (
            <>
              <div className="space-y-2">
                <Label htmlFor="wickets">Total Wickets</Label>
                <Input
                  id="wickets"
                  type="number"
                  value={wickets}
                  onChange={(e) => setWickets(e.target.value)}
                  min="0"
                  placeholder="Total wickets taken"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="economy">Economy Rate</Label>
                <Input
                  id="economy"
                  type="number"
                  step="0.01"
                  value={economy}
                  onChange={(e) => setEconomy(e.target.value)}
                  min="0"
                  placeholder="Economy rate"
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Player Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about your cricketing journey and achievements"
          className="min-h-[120px]"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm">
          I agree to the terms and conditions and consent to my information being reviewed by the admin
        </Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Registration"}
      </Button>
    </form>
  );
};

export default PlayerRegistrationForm;

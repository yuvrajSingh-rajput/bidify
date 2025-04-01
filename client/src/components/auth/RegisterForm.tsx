
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Upload } from "lucide-react";
import { api } from '@/services/api';
import { AxiosError } from 'axios';

const RegisterForm = () => {
  // User details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"admin" | "team_owner">("team_owner");
  
  // Team details (only for team owners)
  const [teamName, setTeamName] = useState("");
  const [teamLogo, setTeamLogo] = useState<File | null>(null);
  const [teamLogoPreview, setTeamLogoPreview] = useState<string | null>(null);
  const [teamDescription, setTeamDescription] = useState("");
  const [teamBudget, setTeamBudget] = useState<string>("80000000"); // Default budget value
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTeamLogo(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return false;
    }
    
    if (role === "team_owner") {
      if (!teamName.trim()) {
        toast({
          title: "Team name required",
          description: "Please provide a name for your team.",
          variant: "destructive",
        });
        return false;
      }
      
      // Additional validations can be added here
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Create form data for registration
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role === 'team_owner' ? 'team_owner' : 'admin');

      if (role === 'team_owner') {
        formData.append('teamName', teamName);
        formData.append('teamBudget', teamBudget);
        formData.append('teamDescription', teamDescription);
        if (teamLogo) {
          formData.append('teamLogo', teamLogo);
        }
      }

      try {
        // Register user
        const response = await api.post('/auth/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Registration response:', response.data);

        // Log in the user with the received credentials
        await login(email, password);
        
        toast({
          title: "Registration successful",
          description: role === "team_owner" 
            ? "Your team has been created successfully!"
            : "Welcome to the Cricket Auction System!",
        });

        // Redirect based on role
        navigate(role === "admin" ? "/admin" : "/team");
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Registration error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
          toast({
            title: "Registration Failed",
            description: error.response?.data?.message || error.message,
            variant: "destructive",
          });
        } else {
          console.error('Registration error:', error);
          toast({
            title: "Error",
            description: error instanceof Error 
              ? error.message 
              : "Registration failed. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
      const token = localStorage.getItem("token") || null;
      if(token){
        navigate('/dashboard');
      }
    }, [navigate]);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your information to create an account
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Account Type</Label>
          <RadioGroup
            value={role}
            onValueChange={(value) => setRole(value as "admin" | "team_owner")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin">Admin</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="team_owner" id="team_owner" />
              <Label htmlFor="team_owner">Team Owner</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Team creation fields (only shown for team owners) */}
        {role === "team_owner" && (
          <>
            <Separator className="my-4" />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Team Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  placeholder="Super Kings"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Team Logo</Label>
                <div className="flex flex-col items-center gap-4">
                  {teamLogoPreview ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 p-1">
                      <img
                        src={teamLogoPreview}
                        alt="Team logo preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute bottom-0 right-0 rounded-full"
                        onClick={() => {
                          setTeamLogo(null);
                          setTeamLogoPreview(null);
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <label 
                        htmlFor="teamLogo" 
                        className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="mb-2 text-gray-400" />
                        <span className="text-xs text-gray-500">Upload logo</span>
                      </label>
                      <input
                        id="teamLogo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teamBudget">Initial Budget (₹)</Label>
                <Input
                  id="teamBudget"
                  type="number"
                  value={teamBudget}
                  onChange={(e) => setTeamBudget(e.target.value)}
                  min={1000000}
                  max={100000000}
                  step={1000000}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Default budget is set by the auction rules.
                </p>
              </div>
            </div>
          </>
        )}
        
        <Button
          type="submit"
          className="w-full bg-bidfy-blue hover:bg-blue-600 mt-6 group"
          disabled={isLoading}
        >
          {isLoading ? (
            "Creating account..."
          ) : (
            <>
              Create Account
              <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-bidfy-blue hover:underline">
          Sign In
        </a>
      </div>
    </div>
  );
};

export default RegisterForm;

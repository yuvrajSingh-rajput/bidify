
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        toast({
          title: "Login failed",
          description: "Please enter both email and password.",
          variant: "destructive",
        });
        return;
      }
      console.log({email, password});
      await login(email.trim(), password.trim());
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
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
    }else{
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your credentials to access your account
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-sm text-bidfy-blue">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-bidfy-blue hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <a href="/register" className="text-bidfy-blue">
          Register
        </a>
      </div>
    </div>
  );
};

export default LoginForm;

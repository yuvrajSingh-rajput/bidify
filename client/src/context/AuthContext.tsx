import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, RegisterData } from "@/services/auth.service";
import { AuthService } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";

interface TeamCreationData {
  teamName: string;
  teamLogo?: string | null;
  budget: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    role: 'admin' | 'team_owner',
    teamData?: TeamCreationData
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("logindata: ", email, password);
      const response = await AuthService.login({ email, password });
      setUser(response.user);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.response?.data?.error || "Failed to login. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'admin' | 'team_owner',
    teamData?: TeamCreationData
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const registerData: RegisterData = {
        name,
        email,
        password,
        role,
        teamDetails: role === 'team_owner' && teamData ? {
          name: teamData.teamName,
          description: '',
          logo: teamData.teamLogo || '',
          budget: teamData.budget
        } : undefined
      };

      const response = await AuthService.register(registerData);
      setUser(response.user);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.error || "Failed to register. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = AuthService.getStoredUser();
        if (storedUser) {
          const currentUser = await AuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            AuthService.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        AuthService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    void checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log("useAuth user:", context.user);
  return context;
}

import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <Navbar />
      
      <div className="flex">
        {user && <Sidebar />}
        <main className={`flex-1 p-4 md:p-6 ${user ? 'ml-0 md:ml-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

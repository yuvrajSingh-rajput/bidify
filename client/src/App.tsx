
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PlayerRegistrationPage from "./pages/PlayerRegistrationPage";
import Dashboard from "./pages/Dashboard";
import AuctionsPage from "./pages/AuctionsPage";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import PlayersPage from "./pages/PlayersPage";
import TeamsPage from "./pages/TeamsPage";
import MyTeamPage from "./pages/MyTeamPage";
import MatchesPage from "./pages/MatchesPage";
import StatisticsPage from "./pages/StatisticsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/player-registration" element={<PlayerRegistrationPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auctions" element={<AuctionsPage />} />
            <Route path="/auctions/:id" element={<AuctionDetailPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/my-team" element={<MyTeamPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<SettingsPage />} /> {/* Added a profile route that redirects to SettingsPage */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

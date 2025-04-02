import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, Trophy } from "lucide-react";

// Import components
import { useEffect, useState } from "react";
import { Auction } from "@/types";
import PlayerRegistrationRequestForm from "@/components/auctions/PlayerRegistrationRequestForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const HomePage = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string>("");
  
  // Fetch auctions
  useEffect(() => {
    // This would normally be an API call
    // For now, we'll use mock data
    const mockAuctions: Auction[] = [
      {
        id: "1",
        name: "IPL Season 2023",
        description: "Annual player auction for IPL 2023 season",
        startTime: new Date("2023-12-10T10:00:00"),
        status: "upcoming",
        basePlayerPrice: 2000000,
        baseBudget: 80000000,
        teams: ["1", "2", "3"],
        players: ["1", "2", "3", "4", "5"],
      },
      {
        id: "2",
        name: "T20 World Cup Trials",
        description: "Player selection auction for World Cup team",
        startTime: new Date("2023-12-15T14:00:00"),
        status: "live",
        basePlayerPrice: 1000000,
        baseBudget: 50000000,
        teams: ["1", "4", "5"],
        players: ["6", "7", "8", "9", "10"],
        currentPlayerId: "6",
      },
      {
        id: "3",
        name: "County Cricket Draft",
        description: "Player draft for county cricket tournament",
        startTime: new Date("2023-11-05T09:00:00"),
        endTime: new Date("2023-11-05T18:00:00"),
        status: "completed",
        basePlayerPrice: 500000,
        baseBudget: 30000000,
        teams: ["6", "7", "8"],
        players: ["11", "12", "13", "14", "15"],
      }
    ];
    
    setAuctions(mockAuctions);
    setSelectedAuctionId(mockAuctions[0].id);
  }, []);

  const selectedAuction = auctions.find(auction => auction.id === selectedAuctionId) || null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            BidFy Auction Platform
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            The ultimate platform for organizing player auctions and managing your sports league
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white bg-blue-700 hover:bg-blue-500 text-white">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Player Registration Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Player Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="auction-select">Select Auction to Join</Label>
                  <Select value={selectedAuctionId} onValueChange={setSelectedAuctionId}>
                    <SelectTrigger id="auction-select" className="w-full">
                      <SelectValue placeholder="Select an auction" />
                    </SelectTrigger>
                    <SelectContent>
                      {auctions.map((auction) => (
                        <SelectItem key={auction.id} value={auction.id}>
                          {auction.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedAuction && (
                  <PlayerRegistrationRequestForm auction={selectedAuction} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Gavel className="h-6 w-6 text-bidfy-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Live Auctions</h3>
              <p className="text-gray-600 mb-4">
                Real-time bidding with instant updates and notifications for all participants
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Real-time bidding</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Budget tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Bid history</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-bidfy-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">Team Management</h3>
              <p className="text-gray-600 mb-4">
                Complete tools for managing teams, players, and budgets throughout the season
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Squad builder</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Player statistics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Budget analysis</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-bidfy-amber" />
              </div>
              <h3 className="text-xl font-bold mb-2">League Management</h3>
              <p className="text-gray-600 mb-4">
                Tools for scheduling matches, tracking scores, and managing the league table
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Fixture generation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Live scoring</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">League table</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join now and experience the future of player auctions and league management
            </p>
            <Button asChild size="lg" className="bg-bidfy-blue hover:bg-blue-600">
              <Link to="/register" className="flex items-center">
                Register Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">BidFy</h2>
              <p className="text-gray-400 mt-2">Player Auction & League Management Platform</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} BidFy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Import icons here to avoid errors
function Gavel(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m14 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 9" />
      <path d="M15.7 9.3 9.3 15.7" />
      <path d="m16 6 6 6" />
      <path d="m8 2 8 8" />
      <path d="M2 8c0-2.2.9-4 2-4s2 1.8 2 4" />
      <path d="M22 17v1c0 2.2-1.8 4-4 4h-1.8" />
    </svg>
  );
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default HomePage;

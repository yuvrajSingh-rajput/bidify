import React, { useState } from "react";
import { PlayerRegistrationRequest } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, FileText, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PlayerRegistrationRequestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auctionId: string;
}

// Enhanced mock data for player registration requests
const mockRequests: PlayerRegistrationRequest[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "+91 98765 43210",
    auctionId: "1",
    message: "I've played in local tournaments for 5 years.",
    status: "pending",
    createdAt: new Date("2023-11-15"),
    age: "28",
    role: "Batsman",
    battingStyle: "right-handed",
    bowlingStyle: "none",
    experience: "5",
    basePrice: "50000",
    profilePhoto: "/placeholder.svg",
    certificates: [
      { name: "State Level Certificate.pdf", type: "application/pdf", size: 105000 },
      { name: "Tournament Trophy.jpg", type: "image/jpeg", size: 250000 }
    ],
    stats: {
      matches: 45,
      runs: 1850,
      average: 42.5,
      strikeRate: 135.2
    },
    bio: "I am a dedicated batsman with experience in various local tournaments. My forte is playing on the front foot and I specialize in cover drives."
  },
  {
    id: "2",
    name: "Amit Patel",
    email: "amit@example.com",
    phone: "+91 87654 32109",
    auctionId: "1",
    message: "I've represented my state in Under-19.",
    status: "approved",
    createdAt: new Date("2023-11-14"),
    age: "22",
    role: "Bowling All-rounder",
    battingStyle: "right-handed",
    bowlingStyle: "right-arm-medium",
    experience: "7",
    basePrice: "75000",
    profilePhoto: "/placeholder.svg",
    certificates: [
      { name: "State Under-19 Certificate.pdf", type: "application/pdf", size: 120000 }
    ],
    stats: {
      matches: 52,
      runs: 950,
      wickets: 78,
      economy: 6.2,
      average: 24.3,
      strikeRate: 110.5
    },
    bio: "Former Under-19 state player specializing in medium pace bowling and lower-order batting. Known for taking crucial wickets and scoring quick runs when needed."
  },
  {
    id: "3",
    name: "Raj Kumar",
    email: "raj@example.com",
    phone: "+91 76543 21098",
    auctionId: "1",
    status: "rejected",
    createdAt: new Date("2023-11-13"),
    age: "31",
    role: "Spinner",
    battingStyle: "left-handed",
    bowlingStyle: "left-arm-spin",
    experience: "10",
    basePrice: "60000",
    profilePhoto: "/placeholder.svg",
    certificates: [],
    stats: {
      matches: 73,
      wickets: 115,
      economy: 5.4
    },
    bio: "Experienced spin bowler with a deceptive flight and variation. I can contribute with the bat when needed and have captained various club teams."
  },
];

const PlayerRegistrationRequestsDialog: React.FC<PlayerRegistrationRequestsDialogProps> = ({
  open,
  onOpenChange,
  auctionId,
}) => {
  const [requests, setRequests] = useState<PlayerRegistrationRequest[]>(
    mockRequests.filter((req) => req.auctionId === auctionId)
  );
  const [selectedRequest, setSelectedRequest] = useState<PlayerRegistrationRequest | null>(null);
  const { toast } = useToast();

  const handleApprove = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "approved" as const } : req
      )
    );
    toast({
      title: "Request Approved",
      description: "Player registration request has been approved.",
    });
    // Close details view if the approved request was selected
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(null);
    }
  };

  const handleReject = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" as const } : req
      )
    );
    toast({
      title: "Request Rejected",
      description: "Player registration request has been rejected.",
    });
    // Close details view if the rejected request was selected
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(null);
    }
  };

  const viewDetails = (request: PlayerRegistrationRequest) => {
    setSelectedRequest(request);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Player Registration Requests</DialogTitle>
          <DialogDescription>
            Review and manage player registration requests for this auction.
          </DialogDescription>
        </DialogHeader>

        {selectedRequest ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Back to List
              </Button>
              {selectedRequest.status === "pending" && (
                <div className="space-x-2">
                  <Button 
                    size="sm" 
                    variant="default" 
                    onClick={() => handleApprove(selectedRequest.id)}
                  >
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleReject(selectedRequest.id)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>

            <Tabs defaultValue="personal">
              <TabsList className="w-full">
                <TabsTrigger value="personal" className="flex-1">Personal Information</TabsTrigger>
                <TabsTrigger value="cricket" className="flex-1">Cricket Details</TabsTrigger>
                <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Player's personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20 border-2 border-gray-200">
                        <AvatarImage src={selectedRequest.profilePhoto} alt={selectedRequest.name} />
                        <AvatarFallback>
                          <User className="h-10 w-10 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{selectedRequest.name}</h3>
                        <p className="text-muted-foreground">
                          <Badge variant={
                            selectedRequest.status === "approved" ? "secondary" :
                            selectedRequest.status === "rejected" ? "destructive" : "outline"
                          }>
                            {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{selectedRequest.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{selectedRequest.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p>{selectedRequest.age} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Request Date</p>
                        <p>{selectedRequest.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {selectedRequest.message && (
                      <div>
                        <p className="text-sm text-muted-foreground">Message from Player</p>
                        <p className="p-2 border rounded-md mt-1">{selectedRequest.message}</p>
                      </div>
                    )}
                    
                    {selectedRequest.bio && (
                      <div>
                        <p className="text-sm text-muted-foreground">Player Bio</p>
                        <p className="p-2 border rounded-md mt-1">{selectedRequest.bio}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="cricket">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Cricket Information</CardTitle>
                    <CardDescription>Player's role, style, and statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Playing Role</p>
                        <p className="font-medium">{selectedRequest.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Batting Style</p>
                        <p className="font-medium">{selectedRequest.battingStyle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bowling Style</p>
                        <p className="font-medium">{selectedRequest.bowlingStyle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Playing Experience</p>
                        <p className="font-medium">{selectedRequest.experience} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Base Price</p>
                        <p className="font-medium">₹{parseInt(selectedRequest.basePrice).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-base font-medium mb-2">Statistics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-muted-foreground">Matches</p>
                          <p className="text-xl font-semibold">{selectedRequest.stats?.matches}</p>
                        </div>
                        
                        {selectedRequest.stats?.runs !== undefined && (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-muted-foreground">Runs</p>
                            <p className="text-xl font-semibold">{selectedRequest.stats.runs}</p>
                          </div>
                        )}
                        
                        {selectedRequest.stats?.wickets !== undefined && (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-muted-foreground">Wickets</p>
                            <p className="text-xl font-semibold">{selectedRequest.stats.wickets}</p>
                          </div>
                        )}
                        
                        {selectedRequest.stats?.average !== undefined && (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-muted-foreground">Average</p>
                            <p className="text-xl font-semibold">{selectedRequest.stats.average}</p>
                          </div>
                        )}
                        
                        {selectedRequest.stats?.strikeRate !== undefined && (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-muted-foreground">Strike Rate</p>
                            <p className="text-xl font-semibold">{selectedRequest.stats.strikeRate}</p>
                          </div>
                        )}
                        
                        {selectedRequest.stats?.economy !== undefined && (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-muted-foreground">Economy</p>
                            <p className="text-xl font-semibold">{selectedRequest.stats.economy}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Certificates and other documents uploaded by the player</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedRequest.certificates && selectedRequest.certificates.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedRequest.certificates.map((cert, index) => (
                          <div key={index} className="flex items-center space-x-3 border p-3 rounded-md">
                            <div className="h-12 w-12 bg-gray-50 rounded flex items-center justify-center">
                              {cert.type.startsWith('image/') ? (
                                <img 
                                  src="/placeholder.svg" 
                                  alt={`Certificate ${index + 1}`} 
                                  className="h-8 w-8 text-gray-400" 
                                />
                              ) : (
                                <FileText className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{cert.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(cert.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        <Award className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                        <p>No certificates or documents uploaded</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <>
            {requests.length > 0 ? (
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.name}</TableCell>
                        <TableCell>{request.role || "N/A"}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{request.email}</div>
                            <div className="text-muted-foreground">{request.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {request.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "secondary"
                                : request.status === "rejected"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => viewDetails(request)}>
                            View Details
                          </Button>
                          {request.status === "pending" && (
                            <div className="space-x-2 mt-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleApprove(request.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(request.id)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No registration requests for this auction.
              </div>
            )}
          </>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerRegistrationRequestsDialog;

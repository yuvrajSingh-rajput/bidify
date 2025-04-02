
import React, { useState } from "react";
import { PlayerRegistrationRequest } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

interface PlayerRegistrationRequestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auctionId: string;
}

// Mock data for player registration requests
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
  },
  {
    id: "3",
    name: "Raj Kumar",
    email: "raj@example.com",
    phone: "+91 76543 21098",
    auctionId: "1",
    status: "rejected",
    createdAt: new Date("2023-11-13"),
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Player Registration Requests</DialogTitle>
          <DialogDescription>
            Review and manage player registration requests for this auction.
          </DialogDescription>
        </DialogHeader>

        {requests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.phone}</TableCell>
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
                    {request.status === "pending" && (
                      <div className="space-x-2">
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
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No registration requests for this auction.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlayerRegistrationRequestsDialog;

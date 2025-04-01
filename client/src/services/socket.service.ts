import { Manager } from 'socket.io-client';
import { AuthService } from './auth.service';

export interface Auction {
  _id: string;
  player: {
    _id: string;
    name: string;
    type: string;
    battingStyle: string;
    bowlingStyle: string;
    basePrice: number;
  };
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  currentBid: number;
  currentHighestBidder?: {
    _id: string;
    name: string;
    logo: string;
  };
  biddingHistory: Array<{
    team: {
      _id: string;
      name: string;
      logo: string;
    };
    amount: number;
    timestamp: string;
  }>;
  startTime?: string;
  endTime?: string;
}

interface ServerToClientEvents {
  'auction-state': (auction: Auction) => void;
  'auction-completed': (auction: Auction) => void;
  'error': (message: string) => void;
}

interface ClientToServerEvents {
  'join-auction': (auctionId: string) => void;
  'leave-auction': (auctionId: string) => void;
  'place-bid': (data: { auctionId: string; amount: number }) => void;
}

class SocketService {
  private socket: any = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    if (this.socket?.connected) return;

    const manager = new Manager('http://localhost:5000', {
      autoConnect: false,
      auth: {
        token: AuthService.getToken()
      }
    });
    this.socket = manager.socket('/');
    this.socket.connect();

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (message) => {
      console.error('Socket error:', message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinAuction(auctionId: string) {
    if (!this.socket?.connected) this.connect();
    this.socket?.emit('join-auction', auctionId);
  }

  leaveAuction(auctionId: string) {
    this.socket?.emit('leave-auction', auctionId);
  }

  placeBid(auctionId: string, amount: number) {
    this.socket?.emit('place-bid', { auctionId, amount });
  }

  onAuctionState(callback: (auction: Auction) => void) {
    this.socket?.on('auction-state', callback);
    this.addListener('auction-state', callback);
  }

  onAuctionCompleted(callback: (auction: Auction) => void) {
    this.socket?.on('auction-completed', callback);
    this.addListener('auction-completed', callback);
  }

  private addListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  removeAllListeners() {
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.off(event, callback as any);
      });
    });
    this.listeners.clear();
  }
}

export const socketService = new SocketService();

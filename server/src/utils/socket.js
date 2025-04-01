import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Auction from '../models/Auction.js';
import Team from '../models/Team.js';

export const setupSocketHandlers = (io) => {
  // Authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error('Authentication required');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) throw new Error('User not found');

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name}`);

    // Join auction room
    socket.on('join-auction', async (auctionId) => {
      try {
        const auction = await Auction.findById(auctionId)
          .populate('player')
          .populate('currentHighestBidder');
        
        if (!auction) throw new Error('Auction not found');
        
        socket.join(auctionId);
        socket.emit('auction-state', auction);
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    // Place bid
    socket.on('place-bid', async ({ auctionId, amount }) => {
      try {
        const auction = await Auction.findById(auctionId);
        if (!auction) throw new Error('Auction not found');
        if (auction.status !== 'active') throw new Error('Auction is not active');

        const team = await Team.findOne({ owner: socket.user._id });
        if (!team) throw new Error('Team not found');
        if (team.remainingBudget < amount) throw new Error('Insufficient budget');

        await auction.placeBid(team._id, amount);
        
        // Broadcast updated auction state
        io.to(auctionId).emit('auction-state', await auction.populate('currentHighestBidder'));
        
        // Extend auction time
        clearTimeout(auction.timeoutId);
        auction.timeoutId = setTimeout(async () => {
          await auction.complete();
          io.to(auctionId).emit('auction-completed', auction);
        }, 30000);
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    // Leave auction room
    socket.on('leave-auction', (auctionId) => {
      socket.leave(auctionId);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });
};

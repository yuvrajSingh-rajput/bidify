import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Team from '../models/Team.js';
import { sendBidToKafka } from './kafka.js'; // You'll create this

export const setupSocketHandlers = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) throw new Error('User not found');
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.user.name}`);

    socket.on('place-bid', async ({ auctionId, amount }) => {
      try {
        const team = await Team.findOne({ owner: socket.user._id });
        if (!team) return socket.emit('error', 'Team not found');
        if (team.remainingBudget < amount) return socket.emit('error', 'Insufficient budget');

        const bidData = {
          auctionId,
          teamId: team._id,
          amount,
          timestamp: Date.now()
        };

        await sendBidToKafka(bidData); // Send to Kafka instead of DB
        io.to(auctionId).emit('new-bid', bidData); // Notify all in the room
      } catch (err) {
        socket.emit('error', err.message);
      }
    });

    socket.on('join-auction', (auctionId) => {
      socket.join(auctionId);
    });

    socket.on('leave-auction', (auctionId) => {
      socket.leave(auctionId);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.user.name}`);
    });
  });
};

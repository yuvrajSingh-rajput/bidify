import { sendBidToKafka } from './kafka/producer.js';

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('place-bid', async ({ auctionId, amount, teamId }) => {
    const bidData = {
      auctionId,
      teamId,
      amount,
      timestamp: new Date().toISOString()
    };

    try {
      await sendBidToKafka(bidData);
      io.to(auctionId).emit('bid-placed', bidData);
    } catch (error) {
      console.error("Failed to send bid to Kafka", error);
      socket.emit('error', 'Failed to place bid');
    }
  });
});

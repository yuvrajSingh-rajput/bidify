// kafka/consumer.js
import { Kafka } from 'kafkajs';
import mongoose from 'mongoose';
import Auction from '../models/Auction.js'; // adjust the model path

const kafka = new Kafka({
  clientId: 'bidify-consumer',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'bidify-group' });

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  await consumer.connect();
  await consumer.subscribe({ topic: 'bids', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const bid = JSON.parse(message.value.toString());

      // Save to MongoDB
      await Auction.updateOne(
        { _id: bid.auctionId },
        { $push: { bids: { teamId: bid.teamId, amount: bid.amount, timestamp: bid.timestamp } } }
      );
    },
  });
};

run().catch(console.error);

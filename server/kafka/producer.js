// kafka/producer.js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'bidify-server',
  brokers: ['localhost:9092'] // change if Docker is exposing another port
});

const producer = kafka.producer();

export const sendBidToKafka = async (bidData) => {
  await producer.connect();
  await producer.send({
    topic: 'bids',
    messages: [
      { value: JSON.stringify(bidData) }
    ],
  });
  await producer.disconnect();
};

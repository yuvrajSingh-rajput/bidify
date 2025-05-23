import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'auction-service',
  brokers: ['localhost:9092'], // or your Kafka broker address
});

const producer = kafka.producer();

await producer.connect();

export const sendBidToKafka = async (bidData) => {
  await producer.send({
    topic: 'bids',
    messages: [{ value: JSON.stringify(bidData) }],
  });
};

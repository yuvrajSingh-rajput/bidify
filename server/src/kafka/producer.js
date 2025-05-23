import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "bidify-server",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

export const initKafkaProducer = async () => {
  console.log("Connecting to Kafka...");
  await producer.connect();
  console.log("Connected to Kafka");
};

export const sendBidToKafka = async (bidData) => {
  await producer.send({
    topic: "bids",
    messages: [{ value: JSON.stringify(bidData) }],
  });
};

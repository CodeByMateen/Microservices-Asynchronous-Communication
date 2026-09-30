import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "learning-producer",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  await producer.send({
    topic: "orders",
    messages: [
      {
        key: "ORD-123",
        value: JSON.stringify({
          orderId: "ORD-123",
          productId: "LAPTOP-001",
          quantity: 2,
        }),
      },
    ],
  });

  console.log("📨 Order event published to Kafka");

  await producer.disconnect();
};

run().catch(console.error);
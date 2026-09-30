import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "learning-producer",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  for (let i = 1; i <= 10; i++) {
    await producer.send({
      topic: "orders",
      messages: [
        {
          key: `ORD-${i}`,
          value: JSON.stringify({
            orderId: `ORD-${i}`,
            productId: "LAPTOP-001",
            quantity: i,
          }),
        },
      ],
    });

    console.log(`📨 Published ORD-${i}`);
  }

  await producer.disconnect();
};

run().catch(console.error);
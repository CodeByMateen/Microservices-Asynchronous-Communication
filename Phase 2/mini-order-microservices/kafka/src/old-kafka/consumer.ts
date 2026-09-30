import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "learning-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "analytics-group",
});

const run = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "orders",
    fromBeginning: true,
  });

  console.log("👂 Waiting for Kafka messages...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const value = message.value?.toString();

      console.log("📩 Kafka message received:");
      console.log(value);
    },
  });
};

run().catch(console.error);
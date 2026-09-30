import amqp from "amqplib";

const RABBITMQ_URL = "amqp://localhost:5672";

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);

  const channel = await connection.createChannel();

  await channel.assertQueue("notification_dlq", {
    durable: true,
  });

  await channel.assertQueue("order_notifications", {
    durable: true,
  });

  console.log("🐰 Connected to RabbitMQ");

  return channel;
};
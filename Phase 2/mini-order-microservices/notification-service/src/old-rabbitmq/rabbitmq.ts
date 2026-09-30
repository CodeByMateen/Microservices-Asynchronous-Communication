import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);

  const channel = await connection.createChannel();

  await channel.assertQueue("order_notifications", {
    durable: true,
  });

  console.log("🐰 Notification Service connected to RabbitMQ");

  return channel;
};
import amqp from "amqplib";

const RABBITMQ_URL = "amqp://localhost:5672";

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);

  const channel = await connection.createChannel();

  // Create exchange
  await channel.assertExchange("order_events", "fanout", {
    durable: true,
  });

  console.log("🐰 Order Service connected to RabbitMQ");

  return channel;
};
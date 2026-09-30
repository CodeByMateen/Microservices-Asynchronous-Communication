import amqp from "amqplib";

const RABBITMQ_URL = "amqp://localhost:5672";

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);

  const channel = await connection.createChannel();

  // Exchange
  await channel.assertExchange("order_events", "fanout", {
    durable: true,
  });

  // Notification's own queue
  const queue = await channel.assertQueue("notification_queue", {
    durable: true,
  });

  // Bind queue to exchange
  await channel.bindQueue(
    queue.queue,
    "order_events",
    ""
  );

  console.log("🐰 Notification Service connected to RabbitMQ");

  return channel;
};
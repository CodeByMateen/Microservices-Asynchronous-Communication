import amqp from "amqplib";

const RABBITMQ_URL = "amqp://localhost:5672";

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);

  const channel = await connection.createChannel();

  await channel.assertExchange("order_events", "fanout", {
    durable: true,
  });

  const queue = await channel.assertQueue("analytics_queue", {
    durable: true,
  });

  await channel.bindQueue(
    queue.queue,
    "order_events",
    ""
  );

  console.log("🐰 Analytics Service connected to RabbitMQ");

  return channel;
};
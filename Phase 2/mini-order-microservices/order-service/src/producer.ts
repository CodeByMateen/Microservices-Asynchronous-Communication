import { connectRabbitMQ } from "./rabbitmq.js";

export const publishOrderCreated = async (orderId: string) => {
  const channel = await connectRabbitMQ();

  const message = {
    type: "ORDER_CREATED",
    orderId,
  };

  channel.publish(
    "order_events",
    "",
    Buffer.from(JSON.stringify(message)),
    {
      persistent: true,
    }
  );

  console.log(`📢 Order event published for ${orderId}`);
};
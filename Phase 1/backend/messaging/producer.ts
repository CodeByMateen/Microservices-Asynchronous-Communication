import { connectRabbitMQ } from "../config/rabbitmq.js";

export const publishOrderNotification = async (
  orderId: string
) => {
  const channel = await connectRabbitMQ();

  const message = {
    type: "ORDER_CONFIRMATION",
    orderId,
    attempt: 1,
  };

  channel.sendToQueue(
    "order_notifications",
    Buffer.from(JSON.stringify(message)),
    {
      persistent: true,
    }
  );

  console.log(`📨 Notification job queued for ${orderId}`);
};
import { connectRabbitMQ } from "./rabbitmq.js";

const MAX_ATTEMPTS = 3;

const startWorker = async () => {
  const channel = await connectRabbitMQ();

  console.log("🔔 Notification worker waiting for events...");

  channel.consume("notification_queue", async (message) => {
    if (!message) return;

    try {
      const data = JSON.parse(message.content.toString());

      const attempt = data.attempt ?? 1;

      console.log(
        `📩 Processing ${data.orderId} - Attempt ${attempt}`
      );

      console.log(
        `📧 Sending notification for ${data.orderId}...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      // 🧪 Deliberately fail for testing
      // throw new Error("Email service unavailable");

      channel.ack(message);

    } catch (error) {
      console.error("❌ Notification failed");

      const data = JSON.parse(message.content.toString());

      const attempt = data.attempt ?? 1;

      if (attempt < MAX_ATTEMPTS) {
        const retryMessage = {
          ...data,
          attempt: attempt + 1,
        };

        channel.sendToQueue(
          "notification_queue",
          Buffer.from(JSON.stringify(retryMessage)),
          {
            persistent: true,
          }
        );

        channel.ack(message);

        console.log(
          `🔄 Retry scheduled - Attempt ${retryMessage.attempt}`
        );
      } else {
        channel.sendToQueue(
          "notification_dlq",
          Buffer.from(JSON.stringify(data)),
          {
            persistent: true,
          }
        );

        channel.ack(message);

        console.log(
          `💀 ${data.orderId} moved to DLQ`
        );
      }
    }
  });
};

startWorker().catch((error) => {
  console.error("❌ Worker failed:", error);
});
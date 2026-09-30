import { connectRabbitMQ } from "../config/rabbitmq.js";

const MAX_ATTEMPTS = 3;

const startNotificationWorker = async () => {
    const channel = await connectRabbitMQ();

    console.log("👷 Notification worker started");

    channel.consume("order_notifications", async (message) => {
        if (!message) return;

        const data = JSON.parse(message.content.toString());

        console.log(
            `📩 Processing ${data.orderId} - Attempt ${data.attempt}`
        );

        try {
            console.log("📧 Sending confirmation...");

            // await new Promise((resolve) => setTimeout(resolve, 2000));

            // console.log(
            //   `✅ Confirmation sent for ${data.orderId}`
            // );

            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );

            // Deliberately fail for learning
            throw new Error("Email service is unavailable");

            channel.ack(message);

        } catch (error) {
            console.error("❌ Notification failed");

            if (data.attempt < MAX_ATTEMPTS) {
                const retryMessage = {
                    ...data,
                    attempt: data.attempt + 1,
                };

                channel.sendToQueue(
                    "order_notifications",
                    Buffer.from(JSON.stringify(retryMessage)),
                    {
                        persistent: true,
                    }
                );

                channel.ack(message);

                console.log(
                    `🔄 Retrying... Attempt ${retryMessage.attempt}`
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
                    `💀 Moved ${data.orderId} to DLQ`
                );
            }
        }
    });
};

startNotificationWorker();
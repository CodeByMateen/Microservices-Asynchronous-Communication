export const processPayment = async (
  orderId: string
) => {
  console.log(`💳 Processing payment for ${orderId}...`);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`✅ Payment successful for ${orderId}`);

  return {
    success: true,
    transactionId: `TXN-${Date.now()}`,
  };
};
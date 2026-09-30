export const sendOrderConfirmation = async (
  orderId: string
) => {
  console.log(`📧 Sending confirmation for ${orderId}...`);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`✅ Confirmation sent for ${orderId}`);

  return {
    sent: true,
  };
};
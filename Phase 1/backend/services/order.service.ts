export const createOrder = async (
  productId: string,
  quantity: number
) => {
  console.log("📦 Creating order...");

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const orderId = `ORD-${Date.now()}`;

  console.log(`✅ Order created: ${orderId}`);

  return {
    orderId,
    productId,
    quantity,
  };
};
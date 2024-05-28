import { getAuthenticatedUser } from "@/app/_actions/auth";
import { getOrderDetailsById } from "@/app/_actions/order";
import OrderDetails from "@/components/OrderDetails";

export default async function SaleOrder({ params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser()
  if (!user) throw new Error("Server failed to authenticate user");
  const orderId = parseInt(params.id);
  const orderDetails = await getOrderDetailsById(orderId, "Customer")
  return <>
    <OrderDetails orderDetails={orderDetails} />
  </>
}
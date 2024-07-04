import { getAuthenticatedUser } from "@/app/_actions/auth";
import { getOrderDetailsById } from "@/app/_actions/order";
import OrderDetails from "@/components/OrderDetails";
import ReportForm from "@/components/ReportForm";

export default async function ReportOrder({ params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser()
  if (!user) throw new Error("Server failed to authenticate user");
   const orderId = parseInt(params.id);
  // const orderDetails = await getOrderDetailsById(orderId, "Seller")
  // TODO: add userId as String
  return <>
    {/* <OrderDetails orderDetails={orderDetails} /> */}
    <ReportForm orderId = {orderId} userId = {user.id}/>
  </>
}
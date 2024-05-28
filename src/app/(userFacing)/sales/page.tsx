import { getAuthenticatedUser } from "@/app/_actions/auth"
import { getSalesOfUser } from "@/app/_actions/order"
import OrdersTable from "@/components/OrdersTable"

// displays sales of a user
export default async function SalesPage() {
  const user = await getAuthenticatedUser()
  if (!user) throw new Error("Unable to see sales");
  const orders = await getSalesOfUser(user);
  return <>
    <OrdersTable orders={orders} role={"Seller"} />
  </>
}
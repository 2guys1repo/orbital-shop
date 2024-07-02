import { getAuthenticatedUser } from "@/app/_actions/auth"
import { getSalesOfUser } from "@/app/_actions/order"
import OrdersTable from "@/components/OrdersTable"
import { UserRole } from "@/lib/types";

// displays reports of a user
export default async function ReportsPage() {
  const user = await getAuthenticatedUser()
  if (!user) throw new Error("Unable to see sales");
  const orders = await getSalesOfUser(user);
  // TODO: update OrdersTable component
  // implement logic to display reports page
  return <>
    <OrdersTable orders={orders} role={UserRole.SELLER} />
  </>
}
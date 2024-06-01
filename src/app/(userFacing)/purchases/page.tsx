import { getAuthenticatedUser } from "@/app/_actions/auth"
import { getPurchasesOfUser } from "@/app/_actions/order"
import OrdersTable from "@/components/OrdersTable"
import { UserRole } from "@/lib/types";

// displays all purchases of a user
export default async function PurchasesPage() {
  const user = await getAuthenticatedUser()
  if (!user) throw new Error("Unable to see purchases");
  const orders = await getPurchasesOfUser(user);
  return <>
    <OrdersTable orders={orders} role={UserRole.BUYER} />
  </>
}
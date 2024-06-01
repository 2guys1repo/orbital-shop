import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { getMiddlemanOrders } from "@/app/_actions/order"
import { getAuthorizedMiddleman } from "@/app/_actions/auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownItem } from "@/components/OrdersDropdownMenu"
import StatusBadge from "@/components/StatusBadge"
import { FaPencilAlt } from "react-icons/fa";
import { redirect } from "next/navigation"
import { OrderStatus } from "@prisma/client"

// Middleman view of the orders
export default async function Orders() {
  const user = await getAuthorizedMiddleman();
  if (!user) redirect("/");
  const orders = await getMiddlemanOrders(user.id); // orders for the middleman
  if (!orders) throw new Error("Unknown error occured while getting orders")
  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Order date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>
                    #{order.id}
                  </TableCell>
                  <TableCell>{order.buyerName}</TableCell>
                  <TableCell>{order.sellerName}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <OrderStatusDropdown status={order.status} orderId={order.id} />
                  </TableCell>
                  <TableCell>
                    <PencilDropdown orderId={order.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// Dropdown menu on order stauts
function OrderStatusDropdown({ status, orderId }: { status: OrderStatus, orderId: number }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <StatusBadge status={status} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownItem nextStatus={OrderStatus.PENDING} orderId={orderId}>
          Pending
        </DropdownItem>
        <DropdownItem nextStatus={OrderStatus.SHIPPED} orderId={orderId} >
          Shipped
        </DropdownItem>
        <DropdownItem nextStatus={OrderStatus.REJECTED} orderId={orderId} >
          Rejected
        </DropdownItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Dropdown menu on pencil icon
function PencilDropdown({ orderId }: { orderId: number }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <FaPencilAlt size={16} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownItem nextStatus={OrderStatus.PENDING} orderId={orderId}>
          Mark Pending
        </DropdownItem>
        <DropdownItem nextStatus={OrderStatus.SHIPPED} orderId={orderId} >
          Mark Shipped
        </DropdownItem>
        <DropdownItem nextStatus={OrderStatus.REJECTED} orderId={orderId} >
          Mark Rejected
        </DropdownItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import Link from "next/link"
import StatusBadge from "./StatusBadge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FaReceipt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";
import { UserRole } from "@/lib/types"
import { OrderStatus } from "@prisma/client"

type OrderType = {
  id: number,
  orderDate: string,
  orderStatus: OrderStatus,
  buyerName?: string,
  sellerName?: string,
}

// Displays all purchases/sales of a user base on the role
export default async function OrdersTable({ orders, role }: { orders: OrderType[], role: UserRole }) {
  const isSeller = role == UserRole.SELLER;
  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <Card>
        <CardHeader>
          <CardTitle>{isSeller ? "Sales" : "Purchase Orders"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>{isSeller ? "Buyer" : "Seller"}</TableHead>
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
                  <TableCell>{order.sellerName || order.buyerName}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.orderStatus} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/${isSeller ? 'sales' : 'purchases'}/${order.id}`}>
                        <ReceiptIconWithTooltip />
                      </Link>
                      <TrashIconWithTooltip />
                      <TableCellContainingReportIcon isSeller={isSeller} />
                    </div>
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

function TableCellContainingReportIcon({ isSeller }) {
  return (
    <Link href='/'>
      { isSeller ? null : <ReportIconWithTooltip />}
    </Link>
  );
}

// Report icon wrapped with a tooltip
function ReportIconWithTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="text-red-600" size="icon" variant="outline">
            <FaExclamationTriangle />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p> Report Seller </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Receipt icon wrapped with a tooltip
function ReceiptIconWithTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline">
            <FaReceipt />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Order Details</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Trash icon wrapped with a tooltip
function TrashIconWithTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="text-red-500" size="icon" variant="outline">
            <FaTrashAlt />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
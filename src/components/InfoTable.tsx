import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import Link from "next/link"
import StatusBadge from "./StatusBadge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FaReceipt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";
import { OrderStatus, ReportStatus } from "@prisma/client"

type InfoType = {
  id: number,
  reportDate?: string,
  orderDate?: string,
  orderStatus?: OrderStatus,
  reportStatus?: ReportStatus,
  buyerName?: string,
  sellerName?: string,
  reason?: string,
}

// generic Dictionary to store key-value pairs
interface Dictionary<T> {
    [key: string]: T;
}

// Displays all purchases/sales of a user base on the role
export default async function InfoTable({ info, tableType }: { info: InfoType[], tableType: string }) {
    const titles: Dictionary<string> = {
        "purchases": "Purchase Orders",
        "sales": "Sales",
        "reports": "Reports",
    }
    const rolesDisplayed: Dictionary<string> = {
        "purchases": "Seller",
        "sales": "Buyer",
    }
    const purchaseOrSalesTable = tableType === "purchases" || tableType === "sales"

  return (
    <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <Card>
        <CardHeader>
          <CardTitle>{titles[tableType]}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                    {purchaseOrSalesTable ? "Order" : "Report"} ID
                </TableHead>
                {purchaseOrSalesTable && <TableHead>{rolesDisplayed[tableType]}</TableHead>}
                <TableHead>
                    {purchaseOrSalesTable ? "Order" : "Report"} date
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {info.map(e => (
                <TableRow key={e.id}>
                  <TableCell>
                    #{e.id}
                  </TableCell>
                  {purchaseOrSalesTable && <TableCell>{e.sellerName || e.buyerName}</TableCell>}
                  <TableCell>{e.reportDate || e.orderDate}</TableCell>
                  <TableCell>
                    <StatusBadge orderStatus = {e.orderStatus} reportStatus = {e.reportStatus} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/${tableType}/${e.id}`}>
                        <ReceiptIconWithTooltip purchaseOrSalesTable={purchaseOrSalesTable}/>
                      </Link>
                      {purchaseOrSalesTable && <TrashIconWithTooltip />}
                      { tableType === "purchases" && 
                        <Link href={`/purchases/${e.id}/report`}>
                        <ReportIconWithTooltip />
                        </Link>
                      }
                      
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


// Report icon wrapped with a tooltip
export function ReportIconWithTooltip() {
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
function ReceiptIconWithTooltip( {purchaseOrSalesTable}: { purchaseOrSalesTable: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline">
            <FaReceipt />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{purchaseOrSalesTable ? "View Order Details" : "View Report Details"}</p>
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

import { Separator } from "@/components/ui/separator"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"

type OrderDetail = {
  id: number,
  orderDate: string,
  orderTotal: number,
  orderStatus: string,
  role: string,
  name: string,
  email: string,
  orderItems: OrderItem[]
}

type OrderItem = {
  id: number,
  priceSold: number,
  quantity: number,
  productName: string,
}

export default function OrderDetails({ orderDetails }: { orderDetails: OrderDetail }) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8 md:px-10 md:py-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Details</h1>
            <div className="flex items-center space-x-2">
              <PackageIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400 font-medium">Order #{orderDetails.id}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{orderDetails.role}</h2>
              <div className="text-gray-500 dark:text-gray-400">
                <p>{orderDetails.name}</p>
                <p>{orderDetails.email}</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Order Date</h2>
              <div className="text-gray-500 dark:text-gray-400">{orderDetails.orderDate}</div>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Shipping Address</h2>
              <div className="text-gray-500 dark:text-gray-400">
                <p>123 Main St</p>
                <p>Singapore</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Order Total</h2>
              <div className="text-gray-500 dark:text-gray-400 font-medium">${orderDetails.orderTotal}</div>
            </div>
          </div>
          <Separator className="my-8" />
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Order Items</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails.orderItems.map(orderItem => (
                  <TableRow key={orderItem.id}>
                    <TableCell className="font-medium">{orderItem.productName}</TableCell>
                    <TableCell>{orderItem.quantity}</TableCell>
                    <TableCell className="text-right">${orderItem.priceSold}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  )
}

// SVG ASSETS
function PackageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}
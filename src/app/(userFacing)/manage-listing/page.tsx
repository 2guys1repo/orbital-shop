import { getAuthenticatedUser } from "@/app/_actions/auth"
import { getProductsOfUser } from "@/app/_actions/product"
import DeleteProductBtn from "@/components/DeleteProductBtn"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SquarePen, Trash2Icon } from "lucide-react"
import Link from "next/link"

export default async function ListingsPage() {
  const kindeUser = await getAuthenticatedUser(); // Not logged in, not suppose to have access
  if (!kindeUser) throw Error("Unable to manage listing"); // kinde server problem
  const products = await getProductsOfUser(kindeUser.id);
  return (
    <div className="w-4/5 mx-auto p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold">Manage Listings</h1>
        <Link href="/sell">
          <Button className="flex items-center" variant="secondary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Listing
          </Button>
        </Link>
      </div>
      <Table >
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            products.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell className="flex justify-end items-center space-x-2">
                  <Link href={`/sell/${product.id}`} >
                    <SquarePen />
                  </Link>
                  <DeleteProductBtn product_id={product.id} ghost>
                    <Trash2Icon color="red" />
                  </DeleteProductBtn>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

// SVG ASSETS
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { getProductsOfUser } from "@/app/_actions/product"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import DeleteProductBtn from "@/components/DeleteProductBtn"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import ProductForm from "@/components/ProductForm"
import { ProductType } from "@/lib/types"
import Link from "next/link"

export default async function ListingsPage() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!await isAuthenticated()) redirect("/api/auth/login"); // Not logged in
  const kindeUser = await getUser();
  if (!kindeUser) redirect("/");
  const products = await getProductsOfUser(kindeUser.id);
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
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
            <TableHead className="w-[100px] text-right">Actions</TableHead>
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
                  <EditDialog product={product} />
                  <DeleteProductBtn product_id={product.id}><TrashIcon className="w-4 h-4" /></DeleteProductBtn>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

// Returns the dialog with the editform
function EditDialog({ product }: { product: ProductType }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-2" variant="ghost">
          <CogIcon className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ProductForm product={product} />
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// SVG ASSETS
function CogIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M12 2v2" />
      <path d="M12 22v-2" />
      <path d="m17 20.66-1-1.73" />
      <path d="M11 10.27 7 3.34" />
      <path d="m20.66 17-1.73-1" />
      <path d="m3.34 7 1.73 1" />
      <path d="M14 12h8" />
      <path d="M2 12h2" />
      <path d="m20.66 7-1.73 1" />
      <path d="m3.34 17 1.73-1" />
      <path d="m17 3.34-1 1.73" />
      <path d="m11 13.73-4 6.93" />
    </svg>
  )
}

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

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}
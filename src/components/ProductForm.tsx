"use client"

import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { addProduct, deleteProduct, updateProduct } from "@/app/_actions/product"
import { ProductType } from "@/lib/types"
import Image from "next/image"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type ProductFormProps = {
  product?: ProductType,
}

export default function ProductForm({ product }: ProductFormProps) {
  // sets formAction to addProduct for creating new post or updateProduct for editing post 
  const formAction = product == undefined ? addProduct : updateProduct.bind(null, product.id)
  return (
    <form action={formAction} >
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>List a Product</CardTitle>
          <CardDescription>Fill out the form to list your item</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Listing title</Label>
            {product == undefined ? // Renders placeholder for new form and existing values for edits
              <Input className="mt-1" id="title" name="title" placeholder="Enter listing title" type="text" required /> :
              <Input className="mt-1" id="title" name="title" defaultValue={product.title} type="text" required />
            }
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            {product == undefined ?
              <Textarea className="mt-1" id="description" name="description" placeholder="Include details for other buyers" rows={3} required /> :
              <Textarea className="mt-1" id="description" name="description" defaultValue={product.description} rows={3} required />
            }
          </div>
          <div>
            <Label htmlFor="price">Price of your listing</Label>
            <div className="mt-1 flex">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                $
              </span>
              {product == undefined ?
                <Input className="block w-full flex-1 rounded-none rounded-r-md" id="price" name="price" placeholder="0.00" type="number" required /> :
                <Input className="block w-full flex-1 rounded-none rounded-r-md" id="price" name="price" defaultValue={product.price} type="number" required />
              }
            </div>
          </div>
          <div>
            <Label
              htmlFor="image"
              className="cursor-pointer"
            >
              Product Image
              <div className=" mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 ">
                <div className="space-y-1 text-center">
                  {product === undefined ?
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" /> :
                    <Image src={product.imagePath} alt="Product Image" height={100} width={100} className="mx-auto " />
                  }
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-bold">Click here to Upload a file</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      <Input className="cursor-pointer" id="image" name="image" type="file" required={product == undefined} />
                    </div>
                  </div>
                </div>
              </div>
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4" >
          {product && <DeleteBtn product_id={product.id} />}
          <Button >
            {product == undefined ? "List Product" : "Save" }
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

function DeleteBtn({ product_id }: { product_id: number }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your listing
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button asChild variant="destructive" onClick={() => deleteProduct(product_id)}>
            <AlertDialogAction>Yes, delete listing</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
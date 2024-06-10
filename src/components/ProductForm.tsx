"use client"

import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { addProduct, updateProduct } from "@/app/_actions/product"
import { ProductType } from "@/lib/types"
import DeleteProductBtn from "./DeleteProductBtn"
import { useFormState, useFormStatus } from "react-dom"
import UploadDropzone from "./UploadDropzone"

type ProductFormProps = {
  product?: ProductType,
}

export default function ProductForm({ product }: ProductFormProps) {
  // sets formAction to addProduct for creating new post or updateProduct for editing post 
  const formAction = product == undefined ? addProduct : updateProduct.bind(null, product.id)
  const [error, action] = useFormState(formAction, {})
  return (
    <form action={action}>
      <Card className="min-w-max w-1/2 mx-auto" >
        <CardHeader>
          {product == undefined ? // Conditionally renders for listing new product or editing existing one
            <>
              <CardTitle>List a Product</CardTitle>
              <CardDescription>Fill out the form to list your item</CardDescription>
            </> :
            <>
              <CardTitle>Edit your Listing</CardTitle>
              <CardDescription>Edit the form to modify your listing</CardDescription>
            </>
          }
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Listing title</Label>
            {product == undefined ? // Renders placeholder for new form and existing values for edits
              <Input className="mt-1" id="title" name="title" placeholder="Enter listing title" type="text" required /> :
              <Input className="mt-1" id="title" name="title" defaultValue={product.title} type="text" required />
            }
            {error?.title && <div className="text-destructive">{error.title}</div>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            {product == undefined ?
              <Textarea className="mt-1" id="description" name="description" placeholder="Include details for other buyers" rows={3} required /> :
              <Textarea className="mt-1" id="description" name="description" defaultValue={product.description} rows={3} required />
            }
            {error?.description && <div className="text-destructive">{error.description}</div>}
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
              {error?.price && <div className="text-destructive">{error.price}</div>}
            </div>
          </div>
          <div>
            <UploadDropzone />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4" >
          {product && <DeleteProductBtn product_id={product.id} />}
          <SubmitButton />
        </CardFooter>
      </Card>
    </form >
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  )
}
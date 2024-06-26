import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"
import { getProductById } from "@/app/_actions/product"
import { getUserByKindeId } from "@/app/_actions/user"
import { ProductType, UserType } from "@/lib/types"
import { notFound } from "next/navigation"

export default async function Product({ params }: { params: { id: string } }) {
  const product = await getProductById(parseInt(params.id))
  if (!product) throw notFound();
  const seller = await getUserByKindeId(product.sellerId)
  if (!seller) throw new Error("User is not registered");
  return (
    <>
      <ProductPageHeader product={product} />
      <Separator />
      <SellerInformation seller={seller} />
    </>
  )
}

function ProductPageHeader({ product }: { product: ProductType }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto py-12 px-4">
      <div>
        <Image src={product.imagePath} alt="Product Image" width={500} height={500} />
      </div>
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-gray-500 dark:text-gray-400">{product.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl">Price per unit: </span>
          <span className="text-4xl font-bold">${product.price}</span>
        </div>
        <div>  
          <span className="text-2xl">Quantity available: </span>
          <span className="text-4xl font-bold">{product.quantity}</span>
        </div>
          <Button asChild size="lg">
            <Link href={`/buy/${product.id}`}>Buy Now</Link>
          </Button>
      </div>
    </div>
  )
}

function SellerInformation({ seller }: { seller: UserType }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto py-12 px-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Seller Information</h2>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage alt="Seller Avatar" src="/placeholder-avatar.jpg" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{seller.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">Trusted Seller Since 2015</p>
          </div>
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, ad quod corrupti quasi totam
          eum nesciunt esse optio ratione illum reiciendis deserunt voluptate, consequatur tenetur similique
          earum atque. Enim, iste.
        </p>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Seller Reviews</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage alt="Reviewer Avatar" src="/placeholder.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">John Doe</h3>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                  <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit amet fugit, rerum
                nemo odit voluptatum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}


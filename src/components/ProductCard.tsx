import Link from "next/link";
import Image from "next/image";
import { ProductType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// Fields of a product
interface ProductCardComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  product: ProductType,
  imgProp?: string,
}

interface ProductCardProps extends ProductCardComponentProps {
  sellerName: string,
  sellerImgPath?: string
}

// Renders a card for individual products
export default function ProductCard({ product, sellerName, sellerImgPath = "", }: ProductCardProps) {
  return (
    <div className="flex flex-col px-4 hover:shadow-2xl">
      {/* Top row with seller info */}
      <div className="flex gap-2 items-center mt-1 mb-2">
        <Avatar>
          <AvatarImage src={sellerImgPath} />
          <AvatarFallback>{sellerName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-semibold">{sellerName}</p>
          <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 10) + 2} days ago</p>
        </div>
      </div>
      {/* Product info */}
      <ProductCardComponent product={product} />
    </div>
  )
}

// component containing image and title only, for more granular control
export function ProductCardComponent({
  product,
  className,
  imgProp,
  ...props
}: ProductCardComponentProps) {
  return (
    <div className={cn("flex flex-col gap-4 ", className)} {...props}>
      <div className={cn("relative h-64", imgProp)}>
        <Link href={`/products/${product.id}`} >
          <Image
            src={product.imagePath}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-all hover:scale-105 aspect-square rounded-lg"
          />
        </Link>
      </div>
      <div className="mt-1">
        <h3 className="text-zinc-600 line-clamp-2">{product.title}</h3>
        <h3 className="font-semibold">${product.price}</h3>
      </div>
    </div>
  )
}


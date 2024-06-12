import Link from "next/link";
import Image from "next/image";
import { ProductType } from "@/lib/types";
import { cn } from "@/lib/utils";

// Fields of a product
interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: ProductType,
  width?: number,
  height?: number
}

// Renders a card for individual products
export default function ProductCard({
  product,
  className,
  width = 200,
  height = 200,
  ...props
}: ProductCardProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <Link href={`/products/${product.id}`}>
        <Image
          src={product.imagePath}
          alt={product.title}
          width={width}
          height={height}
          className="object-cover transition-all hover:scale-105 aspect-square overflow-hidden rounded-lg"
        />
      </Link>
      <div className="mt-1">
        <p className="text-zinc-600">{product.title}</p>
        <h3 className="font-semibold">${product.price}</h3>
      </div>
    </div>
  )
}



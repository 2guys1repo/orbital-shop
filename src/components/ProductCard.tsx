import Link from "next/link";
import { Button } from "./ui/button";
import { CardTitle, CardDescription, CardHeader, CardContent, Card, CardFooter } from "@/components/ui/card"
import Image from "next/image";

type ProductCardProps = {
  title: string,
  description: string,
  price: number,
  imagePath: string,
}

// Renders a card for individual products
export default function ProductCard({ title, description, price, imagePath }: ProductCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <Image
        alt="Product image"
        className="aspect-square object-cover rounded-lg overflow-hidden"
        height="400"
        src={imagePath}
        width="400"
      />
      <CardHeader >
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent >
        <p className="text-2xl">{price}</p>
      </CardContent>
      <CardFooter>
        <Button asChild size="lg" className="w-full">
          <Link href="#">Buy now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}



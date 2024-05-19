import Link from "next/link";
import { Button } from "./ui/button";
import { CardTitle, CardDescription, CardHeader, CardContent, Card, CardFooter } from "@/components/ui/card"
import Image from "next/image";

export default function ProductCard() {
  return (
    <Card className="w-full max-w-sm">
      <Image
        alt="Product image"
        className="aspect-square object-cover rounded-lg overflow-hidden"
        height="400"
        src="/black.jpg"
        width="400"
      />
      <CardHeader >
        <CardTitle>Product</CardTitle>
        <CardDescription>Best product ever</CardDescription>
      </CardHeader>
      <CardContent >
        <p className="text-2xl">$199</p>
      </CardContent>
      <CardFooter>
        <Button asChild size="lg" className="w-full">
          <Link href="#">Buy now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}



import ProductCard from "@/components/ProductCard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getAllProducts } from "../_actions/product"
import { getUserNamesByIds } from "../_actions/user"

// Main home page for users
export default function HomePage() {
  return (
    <>
      {/* Header banner section */}
      <header className="bg-red-50 rounded-md h-60 relative -mt-1">
        <div className="flex flex-col p-6 h-full justify-center gap-6 ">
          <h1 className=" text-3xl md:text-4xl font-semibold tracking-tight">Shop with Confidence: Quality-Assured Products</h1>
          <p className="text-gray-500 text-lg md:text-xl">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. In dolores, praesentium ipsa voluptatibus earum non.
          </p>
          <div className="flex gap-2 ">
            <Button size="lg">Shop Now</Button>
            <Button size="lg" variant="outline">
              Explore Categories
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="w-full">
          <h2 className="mt-4 mb-2 text-2xl font-semibold">Featured Products</h2>
          <ProductCarousel />
        </div>
      </main>
    </>
  )
}

async function ProductCarousel() {
  let temp = await getAllProducts();
  temp = [...temp, ...temp]
  const products = temp  // TODO can get by likes/reviews
  const sellerIds = products.map(product => product.sellerId)
  const sellerNames = await getUserNamesByIds(sellerIds)
  return (
    <Carousel
      className="w-full"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent className="w-full -ml-1">
        {products.map(product => (
          <CarouselItem key={product.id} className="basis-1/5 pl-1">
            <Card className="flex flex-col px-4 ">
              {/* Top row with seller info */}
              <div className="flex gap-2 items-center mt-1 mb-2">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>{sellerNames[product.sellerId][0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{sellerNames[product.sellerId]}</p>
                  <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 10) + 2} days ago</p>
                </div>
              </div>
              {/* Product info */}
              <ProductCard product={product} width={220} />
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
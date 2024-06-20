import ProductCard from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { getAllProducts } from "../_actions/product"
import { getUserNamesByIds } from "../_actions/user"

// Main home page for users
export default function HomePage() {
  return (
    <div className="">
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
        <div className="w-full min-h-[85vh]">
          <h2 className="mt-4 mb-2 text-2xl font-semibold">Featured Products</h2>
          <ProductCarousel />
        </div>
      </main>
    </div>
  )
}

async function ProductCarousel() {
  // let temp = await getAllProducts();
  // temp = [...temp, ...temp]
  // const products = temp // mock data
  const products = await getAllProducts() // TODO can get by likes/reviews
  const sellerIds = products.map(product => product.sellerId)
  const sellerDetailsDict = await getUserNamesByIds(sellerIds) // key is user id, val is name
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
          <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5 pl-1 ">
            {/* TODO add seller img path */}
            <ProductCard key={product.id} product={product} sellerDetails={sellerDetailsDict[product.sellerId]} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
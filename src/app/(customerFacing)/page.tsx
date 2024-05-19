import ProductCard from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <>
      <HomeHeaderSection/>
      <main className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
              <Input
                className="pl-10 pr-4 py-2 rounded-md bg-gray-100"
                placeholder="Search products..."
                type="search"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductCard/>
          </div>
        </div>
      </main>
    </>
  )
}

function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-950 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <img
          alt="Product 1"
          className="w-full aspect-square object-cover"
          height={400}
          src="/cutebear.png"
          width={400}
        />
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-medium">Wireless Headphones</h3>
          <p className="text-gray-500 dark:text-gray-400">$99.99</p>
          <Button size="sm">Add to Cart</Button>
        </div>
      </div>
    </div>
  )
}

// The header section component in the home page
function HomeHeaderSection() {
  return (
    <header className="bg-gray-100 dark:bg-gray-950 py-6 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Browse products with confidence</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. In dolores, praesentium ipsa voluptatibus earum non.
            </p>
            <div className="flex gap-2">
              <Button size="lg">Shop Now</Button>
              <Button size="lg" variant="outline">
                Explore Categories
              </Button>
            </div>
          </div>
          <Image
            alt="Hero Product"
            className="rounded-xl object-cover aspect-square"
            height={600}
            src="/cutebear.png"
            width={600}
          />
        </div>
      </div>
    </header>
  )
}

// A svg search icon
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
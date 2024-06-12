"use client"

import ProductCard from "@/components/ProductCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "./ui/button"
import { Filter, Search } from "lucide-react"
import { ProductType } from "@/lib/types"
import { Input } from "./ui/input"
import React, { useState } from "react"
import Fuse from "fuse.js"

// The component displaying the listings
export default function Listings({ products }: { products: ProductType[] }) {
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(products);
  const fuse = new Fuse(products, {
    keys: ["title"],
    distance: 50
  })
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (value.length == 0) {
      setFilteredProducts(products)
      return;
    }
    const results = fuse.search(value);
    const items = results.map(res => res.item);
    setFilteredProducts(items);
  }
  return (
    <Card className="min-h-full">
      <CardHeader className="flex flex-row justify-between" >
        <CardTitle>Listings</CardTitle>
        <div className="flex gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 focus-visible:ring-gray-500"
              placeholder="Search products..."
              onChange={handleSearch}
            />
          </div>
          <Button variant="ghost" size="icon">
            <Filter strokeWidth={2} className="text-zinc-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <>
            <ProductCard key={product.id} product={product} />
            <ProductCard key={product.id + 10} product={product} />
            <ProductCard key={product.id + 20} product={product} />
            <ProductCard key={product.id + 30} product={product} />
          </>
        ))}
      </CardContent>
    </Card>
  )
}
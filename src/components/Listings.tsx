"use client"

import ProductCard from "@/components/ProductCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "./ui/button"
import { Filter, Search } from "lucide-react"
import { ProductType } from "@/lib/types"
import { Input } from "./ui/input"
import React, { useState } from "react"
import Fuse from "fuse.js"
import { ProductFilterSchema, ProductFilterType } from "@/lib/validators/product-validator"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Separator } from "./ui/separator"
import { toast } from "./ui/use-toast"
import { cn } from "@/lib/utils"

const PRICE_FILTERS = [
  // { name: "None", value: "none" },
  { name: "Price - Low to High", value: "price-asc" },
  { name: "Price - High to Low", value: "price-desc" },
] as const

const DATE_FILTERS = [
  // { name: "None", value: "none" },
  { name: "Recent first", value: "date-asc" },
  { name: "Oldest first", value: "date-desc" },
] as const

// The component displaying the listings
export default function Listings({ products }: { products: ProductType[] }) {
  const [searchProducts, setSearchProducts] = useState<ProductType[]>(products);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(searchProducts);
  const fuse = new Fuse(products, {
    keys: ["title"],
    distance: 50,
    threshold: 0.5,
  })
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (value.length == 0) {
      setSearchProducts(products)
      setFilteredProducts(products)
      return;
    }
    const results = fuse.search(value);
    const items = results.map(res => res.item);
    setSearchProducts(items);
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
          <ProductFilter />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </CardContent>
    </Card>
  )

  function ProductFilter() {
    const DEFAULT_PRICE_RANGE = {
      minPrice: 0,
      maxPrice: 999,
    }
    const [filters, setFilters] = useState<ProductFilterType>({
      priceSort: "none",
      dateSort: "none",
      priceRange: DEFAULT_PRICE_RANGE
    });
    function handleSortChange(field: string, val: string) {
      setFilters(prev => ({
        ...prev,
        [field]: val
      }))
    }
    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = e.target
      let parsedVal = parseFloat(value)
      if (isNaN(parsedVal)) {
        parsedVal = 0
      }
      setFilters(prev => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          [name]: parsedVal
        }
      }))
    }
    function handleApply() {
      const result = ProductFilterSchema.safeParse(filters);
      if (!result.success) {
        const fieldErrors = result.error.formErrors.fieldErrors
        const errors = Object.values(fieldErrors).flat()
        toast({
          className: cn(
            'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 data-[state=open]:sm:slide-in-from-top-full'
          ),
          title: "Invalid price input",
          description: errors[0],
          variant: "destructive",
        })
      }
      const filtered = searchProducts
        .filter(product => product.price >= filters.priceRange.minPrice && product.price <= filters.priceRange.maxPrice)
        .toSorted((p1, p2) => {
          return filters.priceSort == "price-desc" ? p2.price - p1.price : p1.price - p2.price
        })
      setFilteredProducts(filtered)
    }
    return (
      <Popover >
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="focus-visible:ring-transparent">
            <Filter strokeWidth={2} className="text-zinc-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" >
          {/* Date filter */}
          <p className="mb-2">Sort by date</p>
          <RadioGroup defaultValue="none" onValueChange={val => handleSortChange("dateSort", val)}>
            {DATE_FILTERS.map(fil => (
              <div key={fil.value} className="flex items-center space-x-2">
                <RadioGroupItem value={fil.value} id={fil.name} checked={filters.dateSort === fil.value} />
                <label htmlFor={fil.name}>{fil.name}</label>
              </div>
            ))}
          </RadioGroup>
          <Separator className="my-2" />
          {/* Price filter */}
          <p className="mb-2">Sort by price</p>
          <RadioGroup defaultValue="none" onValueChange={val => handleSortChange("priceSort", val)}>
            {PRICE_FILTERS.map(fil => (
              <div key={fil.value} className="flex items-center space-x-2">
                <RadioGroupItem value={fil.value} id={fil.name} checked={filters.priceSort === fil.value} />
                <label htmlFor={fil.name}>{fil.name}</label>
              </div>
            ))}
          </RadioGroup>
          {/* Custom price */}
          <div className="flex items-center mt-4 gap-2">
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <Input
                type="number"
                name="minPrice"
                value={filters.priceRange.minPrice}
                className="w-28 pl-6 pr-2 py-2 focus-visible:ring-gray-500 no-spinner"
                onChange={handlePriceChange}
              />
            </div>
            <p className="text-gray-500">&mdash;</p>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <Input
                type="number"
                name="maxPrice"
                value={filters.priceRange.maxPrice}
                className="w-28 pl-6 pr-2 py-2 focus-visible:ring-gray-500 no-spinner"
                onChange={handlePriceChange}
              />
            </div>
          </div>
          {/* <Separator className="my-2" /> */}
          <div className="flex justify-end mt-4">
            <Button variant="default" size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }
}
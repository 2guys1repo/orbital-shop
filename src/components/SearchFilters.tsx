"use client"

import { cn } from "@/lib/utils"
import { PriceRangeSchema, SORT_OPTS, SearchFilterType } from "@/lib/validators/product-validator"
import { PopoverClose } from "@radix-ui/react-popover"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { toast } from "./ui/use-toast"

const SORT_FILTERS = [
  { name: "Best match", value: "best-match" },
  { name: "Recent", value: "date-asc" },
  { name: "Price - Low to High", value: "price-asc" },
  { name: "Price - High to Low", value: "price-desc" },
] as const

export type QueryFields = keyof SearchFilterType

// TODO please refactor
// filters available for main search page
export default function SearchFilters() {
  // filters for the UI staes
  const [filters, setFilters] = useState<SearchFilterType>({
    sortBy: "best-match",
    priceRange: {
      minPrice: 0,
      maxPrice: 999,
    }
  });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function updateStates(field: QueryFields, value: string) {
    if (field === "sortBy") {
      const validValue = (SORT_OPTS.find(opt => opt === value))
      if (!validValue) return;
      setFilters(prev => ({
        ...prev,
        "sortBy": validValue
      }))
    }

  }

  // updates the UI when user inputs a price
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

  // apply the price range input by the user
  function handleApply() {
    const result = PriceRangeSchema.safeParse(filters.priceRange);
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
    handleQuery("priceRange", `${filters.priceRange.minPrice}-${filters.priceRange.maxPrice}`) // hacky soln
  }

  // updates the url when a filter is applied
  function handleQuery(field: QueryFields, value: string) {
    updateStates(field, value); // update the UI states
    const params = new URLSearchParams(searchParams);
    params.set(field, value)
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-2">
      {/* Sort filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="inline-flex gap-1 rounded-xl">
            <p className="text-muted-foreground">Sort: </p>
            {SORT_FILTERS.find(obj => obj.value == filters?.sortBy)?.name}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <RadioGroup onValueChange={val => handleQuery("sortBy", val)}>
            {SORT_FILTERS.map(sortFilter => (
              <div key={sortFilter.value} className="flex items-center space-x-2">
                <RadioGroupItem value={sortFilter.value} id={sortFilter.name} checked={sortFilter.value === filters?.sortBy} />
                <label htmlFor={sortFilter.name}>{sortFilter.name}</label>
              </div>
            ))}
          </RadioGroup>
        </PopoverContent>
      </Popover>
      {/* Price filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="inline-flex gap-1 rounded-xl">
            <p className="text-muted-foreground">Price: </p>
            <p className="">{` $${filters.priceRange.minPrice} - $${filters.priceRange.maxPrice}`}</p>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
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
          <div className="flex justify-end mt-2">
            <PopoverClose>
              <Button variant="default" size="sm" onClick={handleApply}>
                Apply
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
};

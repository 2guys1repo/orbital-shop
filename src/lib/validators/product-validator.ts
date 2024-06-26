import { z } from "zod";

// available sorting options for a product
export const PRICE_SORTS = ["none", "price-asc", "price-desc"] as const
export const DATE_SORTS = ["none", "date-asc", "date-desc"] as const
export const PriceRangeSchema = z.object({
  minPrice: z.number().min(0, { message: "Price must be non-negative" }),
  maxPrice: z.number().min(0)
}).refine(data => data.maxPrice > data.minPrice, {
  message: 'Max Price must be greater than Min Price',
  path: ['maxPrice'],
})

// different options that a product can be filtered by
export const ProductFilterSchema = z.object({
  priceSort: z.enum(PRICE_SORTS),
  dateSort: z.enum(DATE_SORTS),
  priceRange: PriceRangeSchema
  // category: z.array(z.enum(AVAILABLE_CATEGORIES)) // TODO can add category in future
})

export type ProductFilterType = z.infer<typeof ProductFilterSchema>;


// FOR SEARCH (might use this to replace the above validator)
export const SORT_OPTS = ["best-match", "date-asc", "price-asc", "price-desc"] as const;
export const SearchFilterSchema = z.object({
  sortBy: z.enum(SORT_OPTS),
  priceRange: PriceRangeSchema
  // category: z.array(z.enum(AVAILABLE_CATEGORIES)) // TODO can add category in future
})

export type SearchFilterType = z.infer<typeof SearchFilterSchema>;
import { getFilteredProducts } from "@/app/_actions/product";
import { getUserNamesByIds } from "@/app/_actions/user";
import ProductCard from "@/components/ProductCard";
import SearchFilters from "@/components/SearchFilters";
import { Card, CardContent } from "@/components/ui/card";
import { SORT_OPTS } from "@/lib/validators/product-validator";

// TODO hacky soln
export type SearchParamsType = {
  query?: string
  "sortBy": typeof SORT_OPTS[number],
  "priceRange": string
}

// The page to show search results
export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParamsType
}) {
  const query = searchParams?.query || ''
  // const temp = await getFilteredProducts(searchParams);
  // const products = [...temp, ...temp, ...temp] // mock data
  const products = await getFilteredProducts(searchParams);
  const sellerIds = products.map(product => product.sellerId)
  const sellerDetailsDict = await getUserNamesByIds(sellerIds) // key is user id, val is name
  return (
    <div>
      {/* Header content */}
      <header className="h-40 mb-4 flex flex-col justify-end gap-8">
        <h1 className=" font-medium text-3xl">{`${products.length} search results found for '${query}' `}</h1>
        <SearchFilters />
      </header>
      {/* Product grid */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-4 gap-10">
            {products.map(product => (
              <ProductCard key={product.id} product={product} sellerDetails={sellerDetailsDict[product.sellerId]} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

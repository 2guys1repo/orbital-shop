import { getProductsOfUser } from "@/app/_actions/product"
import { getUserByDbId } from "@/app/_actions/user"
import ProductCard from "@/components/ProductCard"
import SearchBar from "@/components/SearchBar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EllipsisVertical, Filter, User } from "lucide-react"
import { notFound } from "next/navigation"

// Page to show all listings of a user
export default async function UserProfile({ params }: { params: { id: string } }) {
  const dbUser = await getUserByDbId(parseInt(params.id))
  if (!dbUser) return notFound();
  const products = await getProductsOfUser(dbUser.kindeId)
  return (
    <div>
      <header className="bg-gradient-to-r from-slate-300 to-slate-500 py-8 h-32">
      </header>
      <main className="flex justify-between ">
        <Profile />
        <div>
          <div className="flex justify-between my-2">
            <div className="flex gap-4">
              <Button variant="ghost">Listings</Button>
              <Button variant="ghost">Reviews</Button>
            </div>
            <div className="flex">
              <Button variant="ghost">Follow</Button>
              <Button variant="ghost" size="icon">
                <EllipsisVertical strokeWidth={1} />
              </Button>
            </div>
          </div>
          <Listings />
        </div>
      </main>
    </div>
  )

  function Listings() {
    return (
      <Card>
        <CardHeader className="flex flex-row justify-between" >
          <CardTitle>Listings</CardTitle>
          <div className="flex gap-4">
            <SearchBar />
            <Button variant="ghost" size="icon">
              <Filter strokeWidth={2} className="text-zinc-500" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-8">
          {products.map(product => (
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

  function Profile() {
    return (
      <div className="">
        <User size={150} color="white" className="bg-slate-500 rounded-full p-8 relative -top-10" />
        <h3 className="font-bold">{dbUser?.name}</h3>
        <p className="text-gray-500">Singapore - Since 2015</p>
        <p className="text-gray-500">Verified</p>
      </div>
    )
  }
}
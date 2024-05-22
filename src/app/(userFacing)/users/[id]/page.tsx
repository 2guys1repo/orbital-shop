import { getProductsOfUser } from "@/app/_actions/product"
import { getUserByDbId } from "@/app/_actions/user"
import ProductCard from "@/components/ProductCard"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { notFound } from "next/navigation"

export default async function UserProfile({ params }: { params: { id: string } }) {
  // TODO check css
  const dbUser = await getUserByDbId(parseInt(params.id))
  if (!dbUser) return notFound();
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="bg-gray-100 dark:bg-gray-800 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 md:h-20 md:w-20">
              <AvatarImage alt="User Avatar" src="" />
              <AvatarFallback>{dbUser.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{dbUser.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">Lorem ipsum dolor sit amet.</p>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Renders all products of user */}
          {
            (await getProductsOfUser(dbUser.kindeId)).map(product =>(
              <ProductCard key={product.id} {...product}/>
            ))
          }
        </div>
      </main>
    </div>
  )
}
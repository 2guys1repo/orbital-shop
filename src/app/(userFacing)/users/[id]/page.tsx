import { getProductsOfUser } from "@/app/_actions/product"
import { getUserByDbId } from "@/app/_actions/user"
import Listings from "@/components/Listings"
import { Button } from "@/components/ui/button"
import { EllipsisVertical, User } from "lucide-react"
import { notFound } from "next/navigation"

type UserProfileProps = {
  params: { id: string },
}

// Page to show all listings of a user
export default async function UserProfile({ params }: UserProfileProps) {
  const dbUser = await getUserByDbId(parseInt(params.id))
  if (!dbUser) return notFound();
  const products = await getProductsOfUser(dbUser.kindeId)
  return (
    <div>
      <header className="bg-gradient-to-r from-slate-300 to-slate-500 py-8 h-32">
      </header>
      <main className="flex gap-48">
        <Profile />
        <div className="flex-grow min-h-[32rem]">
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
          <Listings products={products} />
        </div>
      </main>
    </div>
  )

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
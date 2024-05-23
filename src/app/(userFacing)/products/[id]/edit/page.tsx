import { getProductById } from "@/app/_actions/product";
import ProductForm from "@/components/ProductForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

// Page for admin use in future
export default async function EditPage({ params }: { params: { id: string } }) {
  const product = await getProductById(parseInt(params.id));
  if (!product) redirect("/"); // no such product
  
  const { getUser, isAuthenticated }= getKindeServerSession();
  if (!await isAuthenticated()) redirect("/api/auth/login");
  const kindeUser = await getUser();
  if (product.sellerKindeId != kindeUser?.id) redirect("/"); // unauthorise, can throw in future
  return (
    <ProductForm product={product}/>
  )
}
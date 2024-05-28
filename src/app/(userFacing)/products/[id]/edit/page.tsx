import { getAuthenticatedUser } from "@/app/_actions/auth";
import { getProductById } from "@/app/_actions/product";
import ProductForm from "@/components/ProductForm";
import { redirect } from "next/navigation";

// Page for admin use in future
export default async function EditPage({ params }: { params: { id: string } }) {
  const product = await getProductById(parseInt(params.id));
  if (!product) redirect("/"); // no such product
  const kindeUser = await getAuthenticatedUser();
  if (product.sellerId != kindeUser?.id) redirect("/"); // unauthorise, can throw in future
  return (
    <ProductForm product={product} />
  )
}
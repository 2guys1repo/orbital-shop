import { getAuthenticatedUser } from "@/app/_actions/auth";
import { getProductById } from "@/app/_actions/product";
import ProductForm from "@/components/ProductForm";
import { notFound } from "next/navigation";

export default async function EditPage({ params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser();
  const product = await getProductById(parseInt(params.id))
  if (product != null && user != null && product.sellerId == user.id) {
    // only shows edit page if product exist and is owned by seller
    return <ProductForm product={product} />
  }
  return notFound()
}
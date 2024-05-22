import { getProductById } from "@/app/_actions/product";
import ProductForm from "@/components/ProductForm";

export default async function EditPage({ params }: { params: { id: string } }) {
  const product = await getProductById(parseInt(params.id));
  if (!product) return;
  return (
    <ProductForm product={product}/>
  )
}
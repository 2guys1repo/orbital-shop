import { getAuthenticatedUser } from "@/app/_actions/auth";
import ProductForm from "@/components/ProductForm";

// Page for users to create new product
export default async function SellPage() {
  await getAuthenticatedUser();
  return (
    <ProductForm />
  )
}
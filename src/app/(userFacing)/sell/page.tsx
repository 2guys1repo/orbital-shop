import { getAuthenticatedUser } from "@/app/_actions/auth";
import ProductForm from "@/components/ProductForm";
import Utform from "./Utform";

// Page for users to create new product
export default async function SellPage() {
  await getAuthenticatedUser();
  return (
    <Utform />
  )
}
import ProductForm from "@/components/ProductForm";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

// Page for users to create new product
export default async function SellPage() {
  const { isAuthenticated } = getKindeServerSession();
  if (!await isAuthenticated()) redirect("/api/auth/login");
  return (
    <ProductForm />
  )
}
"use server"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

// Gets an authenticated user
export async function getAuthenticatedUser() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!await isAuthenticated()) redirect("/api/auth/login"); // Not logged in, not suppose to have access
  return await getUser();
}
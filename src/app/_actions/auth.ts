"use server"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

// Returns a kinde user if user is logged in
export async function getAuthenticatedUser() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  if (!await isAuthenticated()) redirect("/api/auth/login"); // Not logged in, not suppose to have access
  return await getUser();
}

// Returns a kinde user if user has a middleman role
export async function getAuthorizedMiddleman() {
  const { getPermission, getUser, isAuthenticated } = getKindeServerSession();
  if (!await isAuthenticated()) redirect("/api/auth/login"); // Not logged in, not suppose to have access
  const middlemanPerm = await getPermission("update:orderStatus");
  if (middlemanPerm?.isGranted) {
    return await getUser();
  }
}
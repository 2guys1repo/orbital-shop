"use server"

import { UserRole } from "@/lib/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Organizations, init } from "@kinde/management-api-js";
import { redirect } from "next/navigation";
import { updateDbUserRole } from "./user";

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

// Returns a kinde user if user has a middleman role
export async function isAdmin() {
  const { getPermission, isAuthenticated } = getKindeServerSession();
  if (!await isAuthenticated()) redirect("/api/auth/login"); // Not logged in, not suppose to have access
  const adminPerm = await getPermission("auth:middleman"); // able to authorize a middle
  if (adminPerm?.isGranted) {
    return true;
  }
  return false;
}

export async function updateUserRole(userId: string, curRole: UserRole, nextRole: UserRole) {
  init()
  const ORG_CODE = "org_2f1e861a9af"
  const MM_ROLE_ID = "018fbf21-256b-811c-0e6b-866f3c5f71a2";
  const ADMIN_ROLE_ID = "018fb47d-e4ad-19d9-6dd6-1ed9fa11fb65"
  switch (nextRole) {
    case UserRole.BASIC:
      // had middleman and admin role
      if (curRole == UserRole.ADMIN) {
        deleteOrgRole(ORG_CODE, userId, ADMIN_ROLE_ID)
      } else {
        // was middleman
        deleteOrgRole(ORG_CODE, userId, MM_ROLE_ID)
      }
      await updateDbUserRole(userId, UserRole.BASIC)
      break;
    case UserRole.MIDDLEMAN:
      if (curRole == UserRole.BASIC) {
        addOrgRole(ORG_CODE, userId, MM_ROLE_ID)
      } else {
        // was a admin
        deleteOrgRole(ORG_CODE, userId, ADMIN_ROLE_ID)
        addOrgRole(ORG_CODE, userId, MM_ROLE_ID)
      }
      await updateDbUserRole(userId, UserRole.MIDDLEMAN)
      break;
    case UserRole.ADMIN:
      if (curRole == UserRole.BASIC) {
        addOrgRole(ORG_CODE, userId, ADMIN_ROLE_ID)
      }
      else {
        // was middleman
        deleteOrgRole(ORG_CODE, userId, MM_ROLE_ID)
        addOrgRole(ORG_CODE, userId, ADMIN_ROLE_ID)
      }
      await updateDbUserRole(userId, UserRole.ADMIN)
      break;
  }
}

async function addOrgRole(orgCode: string, userId: string, role_id: string) {
  const c = await Organizations.createOrganizationUserRole({
    orgCode,
    userId,
    requestBody: {
      role_id,
    }
  })
}

async function deleteOrgRole(orgCode: string, userId: string, roleId: string) {
  const d = await Organizations.deleteOrganizationUserRole({
    orgCode,
    roleId,
    userId,
  })
}

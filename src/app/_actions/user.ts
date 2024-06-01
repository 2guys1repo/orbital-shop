"use server"

// File contains actions to interact with User model on the database
import prisma from "@/lib/db";
import { UserRole } from "@/lib/types";
import { isInStringEnum } from "@/lib/utils";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

// Gets a single db user by kinde id
export async function getUserByKindeId(kindeId: string) {
  return await prisma.user.findUnique({
    where: {
      kindeId: kindeId
    }
  })
}

// gets a single db user by its db id
export async function getUserByDbId(dbId: number) {
  return await prisma.user.findUnique({
    where: {
      id: dbId
    }
  })
}

export async function getDbUser(kindeUser: KindeUser) {
  return await prisma.user.findUniqueOrThrow({
    where: {
      kindeId: kindeUser.id
    }
  })
}

interface KindeUserResponse {
  id: string
  username: string
  email: string
  first_name: string
}

function isValidUserResponse(kindeUser: KindeUserResponse): boolean {
  for (const key in kindeUser) {
    if (kindeUser[key as keyof KindeUserResponse] === undefined) {
      return false;
    }
  }
  return true;
}

export async function createUser(kindeUser: KindeUserResponse) {
  if (!isValidUserResponse(kindeUser)) throw new Error("User data is incomplete");
  const user = await prisma.user.create({
    data: {
      kindeId: kindeUser.id,
      username: kindeUser.username,
      name: kindeUser.first_name!,
      email: kindeUser.email!,
      sellerDetails: { create: {} },
      buyerDetails: { create: {} }
    }
  })
  return user;
}

// return the names of users within the id array
export async function getUserNamesByIds(ids: string[]) {
  const users = await prisma.user.findMany({
    where: {
      kindeId: { in: ids }
    },
    select: {
      kindeId: true,
      name: true,
    }
  })
  return users;
}

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function updateDbUserRole(id: string, nextRole: UserRole) {
  console.log(nextRole)
  if (nextRole != UserRole.ADMIN) return;
  if (!isInStringEnum(nextRole, UserRole)) throw new Error("Invalid user role")
  const user = await prisma.user.update({
    where: { kindeId: id },
    data: {
      role: nextRole,
    }
  })
}
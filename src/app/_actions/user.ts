"use server"

// File contains actions to interact with User model on the database
import prisma from "@/lib/db";
import { UserRole } from "@/lib/types";
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

/**
 * A dictionary where keys are Kinde user IDs and values are user names.
 */
export type UserDict = {
  [kindeId: string]: string
}

/**
 * Find the names of all users from an input array of Kinde id
 * 
 * @param ids Array of Kinde user ids.
 * @returns A Promise that resolves to an object with keys of Kinde IDs and values of their names. 
 */
export async function getUserNamesByIds(ids: string[]): Promise<UserDict> {
  const users = await prisma.user.findMany({
    where: {
      kindeId: { in: ids }
    },
    select: {
      kindeId: true,
      name: true,
    }
  });
  const userDict: UserDict = {}
  for (const { kindeId, name } of users) {
    userDict[kindeId] = name;
  }
  return userDict;
}

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function updateDbUserRole(id: string, nextRole: UserRole) {
  if (nextRole == UserRole.BUYER || nextRole == UserRole.SELLER) throw new Error("Invalid user role");
  const user = await prisma.user.update({
    where: { kindeId: id },
    data: {
      role: nextRole,
    }
  })
}
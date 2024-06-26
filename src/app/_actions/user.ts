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

// gets a single db user by its username
export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: {
      username: username
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
  email: string
  first_name: string
  last_name: string
}

export async function createUser(kindeUser: KindeUserResponse) {
  let username = await createUsername(kindeUser.first_name + kindeUser.last_name);
  const user = await prisma.user.create({
    data: {
      kindeId: kindeUser.id,
      username: username,
      name: kindeUser.first_name!,
      email: kindeUser.email!,
      sellerDetails: { create: {} },
      buyerDetails: { create: {} }
    }
  })
  return user;
}

/**
 * Generates a username from the given name
 * @param name The full name of the user
 * @returns a username built from the given name
 */
async function createUsername(name: string) {
  let parsedName = name.replace(/[^a-zA-Z0-9]/g, '');
  let username = parsedName;
  let existingUser = await prisma.user.findUnique({ where: { username, } })
  while (existingUser !== null) { // user with the username exists
    const array = new Uint32Array(1);
    crypto.getRandomValues(array)
    username = parsedName + array[0]
    existingUser = await prisma.user.findUnique({ where: { username, } })
  }

  return username
}

/**
 * A dictionary where keys are Kinde user IDs and values are user names.
 */
export type UserDict = {
  [kindeId: string]: {
    name: string,
    username: string,
  }
}

/**
 * Find the names of all users from an input array of Kinde id
 * 
 * @param ids Array of Kinde user ids.
 * @returns A Promise that resolves to an object with keys of Kinde IDs and value is a mapping of name and username
 */
export async function getUserNamesByIds(ids: string[]): Promise<UserDict> {
  const users = await prisma.user.findMany({
    where: {
      kindeId: { in: ids }
    },
    select: {
      kindeId: true,
      name: true,
      username: true,
    }
  });
  const userDict: UserDict = {}
  for (const { kindeId, name, username } of users) {
    userDict[kindeId] = {
      name,
      username,
    };
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
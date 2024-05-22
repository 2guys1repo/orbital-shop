"use server"

// File contains actions to interact with User model on the database
import prisma from "@/lib/db";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types"

// Gets a single db user by kinde id
export async function getUserByKindeId(kinde_id: string) {
  return await prisma.user.findFirst({
    where: {
      kindeId: kinde_id
    }
  })
}

// creates a user in the db if not already present
// returns the db user
export async function createUserIfAbsent(kindeUser: KindeUser) {
  let user = await getUserByKindeId(kindeUser.id);
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: kindeUser.given_name!, // present unless signup process changes
        email: kindeUser.email!,
        kindeId: kindeUser.id,
      }
    })
  } 
  return user;
}

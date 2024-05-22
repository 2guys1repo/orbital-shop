"use server"

// File contains actions to interact with User model on the database

import prisma from "@/lib/db";

// Gets a single user by kinde id
export async function getUserByKindeId(kinde_id: string) {
  return await prisma.user.findFirst({
    where: {
      kindeId: kinde_id
    }
  })
}

// returns an existing user or create a return new user 
export async function getOrCreateUser(kinde_id: string, name: string|null, email: string|null) {
  let user = await getUserByKindeId(kinde_id);
  if (!user) {
    if (!name || !email) return; // Invalid fields
    user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        kindeId: kinde_id,
      }
    })
  } 
  return user;
}

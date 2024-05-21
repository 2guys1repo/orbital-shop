"use server"

// File contains actions to interact with User model on the database

import prisma from "@/lib/db";

// Gets a single user by id
export async function getUserById(user_id: number) {
  return await prisma.user.findFirst({
    where: {
      id: user_id
    }
  })
}
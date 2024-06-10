"use server"
import { UTApi } from "uploadthing/server"

// Deletes image from uploadthing server
export async function deleteImage(key: string) {
  const utapi = new UTApi()
  await utapi.deleteFiles(key);
}
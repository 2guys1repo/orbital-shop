"use server"

// File contains actions to interact with Product model on the database

import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

const imageSchema = z.instanceof(File, {
  message: "Required",
}).refine(file => file.size === 0 || file.type.startsWith("image/"))

const postSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().min(1),
  image: imageSchema.refine(file => file.size > 0, "Required"),
})

// Creates a new product to the database
export async function addProduct(formData: FormData) {
  const result = postSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data;
  await fs.mkdir("public/products", {recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
  await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));

  await prisma.product.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      imagePath: imagePath,
      sellerId: 1, // TODO currently all tagged id 1 
    }
  })
  revalidatePath("/")
  redirect("/")
}

const updateSchema = postSchema.extend({
  image: imageSchema.optional(),
})

// Updates existing product in the database
export async function updateProduct(id: number, formData: FormData) {
  const result = updateSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data;
  const product = await prisma.product.findFirst({ where: { id }})
  if (!product) return notFound();

  let imagePath = product.imagePath;
  if (data.image != undefined && data.image.size > 0) {
    await fs.unlink(`public${product.imagePath}`) // removes existing image
    await fs.mkdir("public/products", {recursive: true });
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));
  }

  await prisma.product.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      imagePath: imagePath,
      sellerId: 1, // TODO currently all tagged id 1 
    }
  })
  revalidatePath("/")
  redirect("/")
}

// Deletes existing product from db
export async function deleteProduct(id: number) {
  const product = await prisma.product.delete({
    where: { id }
  })
  if (!product) return notFound();

  await fs.unlink(`public${product.imagePath}`)
  revalidatePath("/")
  redirect("/")
}

// Fetches all the products from db
export async function getAllProducts() {
  return await prisma.product.findMany()
}

// fetches a single product of the product id
export async function getProductById(product_id: number) {
  return await prisma.product.findFirst({
    where: {
      id: product_id
    }
  })
}
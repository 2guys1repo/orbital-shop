"use server"

// File contains actions to interact with Product model on the database
import prisma from "@/lib/db";
import { ProductType } from "@/lib/types";
import { Prisma } from "@prisma/client";
import Fuse from "fuse.js";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { UTApi } from "uploadthing/server";
import { z } from "zod";
import { SearchParamsType } from "../(userFacing)/search/page";
import { getAuthenticatedUser } from "./auth";

// Schema describing a post form
const postSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(5),
  price: z.coerce.number().min(1),
  imageKey: z.string().min(1),
})

// Creates a new product in the database
export async function addProduct(_prevState: unknown, formData: FormData) {
  const kindeUser = await getAuthenticatedUser();
  if (!kindeUser) throw new Error("Server issue, Unable to add product"); // Kinde server issue
  const result = postSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }
  const data = result.data;
  const imagePath = `https://utfs.io/f/${data.imageKey}`  //path built from Uploadthing service
  await prisma.product.create({
    data: {
      // TODO: add quantity
      title: data.title,
      description: data.description,
      price: data.price,
      imagePath: imagePath,
      sellerId: kindeUser.id,
      quantity: 1,
    }
  })
  revalidatePath("/")
  redirect("/")
}

// Schema for an edit post form
const updateSchema = postSchema.extend({
  imageKey: z.string().optional(),
  prevPath: z.string().optional(),
})

// Updates existing product in the database
export async function updateProduct(id: number, _prevState: unknown, formData: FormData) {
  const kindeUser = await getAuthenticatedUser();
  if (!kindeUser) throw new Error("Server issue, Unable to add product"); // Kinde server issue
  const result = updateSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data;
  const product = await prisma.product.findFirst({ where: { id } })
  if (!product) return notFound();
  if (product.sellerId != kindeUser.id) throw new Error("Unauthorised");

  let imagePath = product.imagePath;
  const utapi = new UTApi();
  if (data.imageKey) { // delete prevpath
    const url = product.imagePath // get the original image path
    const imgKey = url.substring(url.lastIndexOf("/") + 1);
    await utapi.deleteFiles(imgKey)
    imagePath = `https://utfs.io/f/${data.imageKey}`  // new image path
  }
  await prisma.product.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      imagePath: imagePath,
    }
  })
  revalidatePath("/")
  revalidatePath("/manage-listing")
}

// Deletes existing product from db
export async function deleteProduct(id: number) {
  const product = await prisma.product.delete({
    where: { id }
  })
  if (!product) return notFound();
  const url = product.imagePath
  const imgKey = url.substring(url.lastIndexOf("/") + 1);
  const utapi = new UTApi()
  await utapi.deleteFiles(imgKey);
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

// Fetches all the products from db
export async function getProductsOfUser(kindeId: string) {
  return await prisma.product.findMany({
    where: {
      sellerId: kindeId
    }
  })
}

export async function getProductName(id: number) {
  return await prisma.product.findUniqueOrThrow({
    where: { id },
    select: { title: true }
  })
}

/**
 * Finds a list of products matching the query. 
 * 
 * @param query The query string used to search for products. 
 * @param searchFilters The filters to apply to the results
 * @returns A promise that resolves to an array containing products matching the query string.
 */
export async function getFilteredProducts(searchParams: SearchParamsType): Promise<ProductType[]> {
  const { query, sortBy, priceRange } = searchParams
  const orderBy: Prisma.ProductOrderByWithRelationInput[] = []
  let [minPrice, maxPrice] = [0, 999]
  if (priceRange) {
    const [minPriceStr, maxPriceStr] = priceRange.split("-")
    minPrice = parseFloat(minPriceStr)
    maxPrice = parseFloat(maxPriceStr)
  }
  if (sortBy) {
    const [field, order] = sortBy.split('-');
    if (field === "price" && (order == "asc" || order == "desc")) {
      orderBy.push({ price: order })
    } else if (field === "date") {
      // TODO Sort by date
      // orderBy.push({createdAt: order})
    }
  }
  const products = await prisma.product.findMany({
    where: {
      price: {
        gte: minPrice,
        lte: maxPrice
      }
    },
    orderBy: orderBy.length > 0 ? orderBy : undefined
  })
  const fuse = new Fuse(products, {
    keys: ["title", "description"],
    distance: 50,
    threshold: 0.4,
    ignoreLocation: true,
    shouldSort: sortBy === "best-match" // only sort if order by best match else prisma handles sort
  })
  if (query) {
    const fuseResults = fuse.search(query)
    const results = fuseResults.map(res => res.item);
    return results
  }
  return products
}
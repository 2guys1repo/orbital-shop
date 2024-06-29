"use server"

import prisma from "@/lib/db"
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import Stripe from "stripe"
import { getProductName } from "./product";
import { getUserNamesByIds } from "./user";
import { getAuthorizedMiddleman } from "./auth";
import { OrderStatus } from "@prisma/client";

// create an order 
export async function createOrder(charge: Stripe.Charge) {
  const { buyerId, sellerId, middlemanId, productId } = charge.metadata;
  try {
    const order = await prisma.order.create({
      data: {
        buyerId,
        sellerId,
        middlemanId,
        totalAmount: charge.amount, // TODO currently assumes one item
        orderItems: {
          create: {
            priceSold: charge.amount,
            productId: parseInt(productId)
          }
        }
      }
    })
  } catch (error) {
    console.log(error)
  }
}

// Gets all purchases, with necessary fields, of a user 
export async function getPurchasesOfUser(user: KindeUser) {
  const rawOrders = await prisma.order.findMany({
    where: {
      buyerId: user.id,
    },
    include: {
      sellerDetails: {
        include: {
          user: true
        }
      }
    },
  });
  const filteredOrders = rawOrders.map(order => {
    return {
      id: order.id,
      sellerName: order.sellerDetails.user.name,
      orderDate: order.orderDate.toLocaleDateString(),
      orderStatus: order.status,
    }
  });
  return filteredOrders
}

// Gets all sales, with necessary fields, of a user 
export async function getSalesOfUser(user: KindeUser) {
  const rawOrders = await prisma.order.findMany({
    where: {
      sellerId: user.id,
    },
    include: {
      buyerDetails: {
        include: {
          user: true
        }
      }
    },
  });
  const filteredOrders = rawOrders.map(order => {
    return {
      id: order.id,
      buyerName: order.buyerDetails.user.name,
      orderDate: order.orderDate.toLocaleDateString(),
      orderStatus: order.status,
    }
  });
  return filteredOrders
}

// Gets the relelevant details for a order
export async function getOrderDetailsById(id: number, role: string) {
  // TODO might need to edit models to improve queries
  const order = await prisma.order.findUniqueOrThrow({
    where: { id },
    include: { orderItems: true }
  })
  const userId = role == "Customer" ? order.buyerId : order.sellerId; // Assumes either Customer or Seller as role
  const user = await prisma.user.findUniqueOrThrow({
    where: { kindeId: userId },
    select: { name: true, email: true }
  });
  const orderItems = await Promise.all(order.orderItems.map(async (order) => {
    return {
      id: order.id,
      priceSold: order.priceSold,
      quantity: order.quantity,
      productName: (await getProductName(order.productId)).title,
    }
  }))
  const transformedOrder = {
    id: order.id,
    orderDate: order.orderDate.toLocaleDateString(),
    orderTotal: order.totalAmount,
    orderStatus: order.status,
    role,
    name: user.name,
    email: user.email,
    orderItems,
  }
  return transformedOrder;
}

// Returns all orders in the db associated to the middleman
export async function getMiddlemanOrders(userId: string) {
  // create if absent
  const mmDetails = await prisma.middlemanDetails.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: { orders: true },
  })
  const transformedOrders = await Promise.all(mmDetails.orders.map(async (order) => {
    const userDict = await getUserNamesByIds([order.buyerId, order.sellerId])
    return {
      id: order.id,
      buyerName: userDict[order.buyerId]["name"],
      sellerName: userDict[order.sellerId]["name"],
      date: order.orderDate.toLocaleDateString(),
      status: order.status,
    }
  }))
  return transformedOrders
}

export async function updateOrderStatus(id: number, nextStatus: OrderStatus) {
  const user = await getAuthorizedMiddleman();
  if (!user) throw new Error("An error occured, unable to update order status")
  await prisma.order.update({
    where: { id },
    data: {
      status: nextStatus
    }
  })
}
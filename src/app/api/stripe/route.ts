import { createOrder } from "@/app/_actions/order";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
export async function POST(req: NextRequest) {
  try {
    const event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    )
    if (event.type == "charge.succeeded") {
      const charge = event.data.object;
      await createOrder(charge) // creates the order with the charge details
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json("Bad Request", { status: 400 })
    }
  }
  return NextResponse.json({ status: 200, statusText: "received" });
}
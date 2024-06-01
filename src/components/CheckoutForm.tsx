"use client"

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent } from "react";
import { Button } from "./ui/button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
export default function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  return <Elements options={{ clientSecret }} stripe={stripePromise}>
    <Form />
  </Elements>
};

// TODO can add states for form(error and loading)
function Form() {
  const stripe = useStripe()
  const elements = useElements()
  async function handleSubmit(formEvent: FormEvent) {
    formEvent.preventDefault()
    if (!stripe || !elements) return;
    stripe.confirmPayment({
      elements, confirmParams: {
        return_url: "https://orbital-shop.vercel.app/buy/success" // TODO can use env
      }
    })
  }
  return <form onSubmit={handleSubmit}>
    <PaymentElement />
    <Button
      type="submit"
      className="w-full mt-4 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      Checkout
    </Button>
  </form>
}

import Stripe from "stripe"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export default async function SuccessPage({ searchParams }: { searchParams: { payment_intent: string } }) {
  if (searchParams.payment_intent == undefined) return notFound();
  const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent)
  const isSuccess = paymentIntent.status == "succeeded"; // TODO can check time created field for extra validation

  return <>
    {/* TODO can add retry page */}
    {isSuccess ? <SuccessCard /> : notFound()}
  </>
};

function SuccessCard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-md w-full p-8 mb-24 md:mb-32 lg:mb-40">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Order Received!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-500 ">
            Thank you for your order! We&apos;re processing your request and you&apos;ll receive your items soon.
          </p>
          <Link
            className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-gray-900 text-gray-50 font-medium transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
            href="/purchases"
          >
            View My Orders
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
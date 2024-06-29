import { getAuthenticatedUser } from "@/app/_actions/auth";
import { getProductById } from "@/app/_actions/product";
import CheckoutForm from "@/components/CheckoutForm";
import { Card, CardContent } from "@/components/ui/card";
import { ProductType } from "@/lib/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string) // instantiate a new stripe instance
export default async function PurchasePage({ params }: { params: { id: string } }) {
  // auth
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("unknown user");

  // create payment intent
  const productId = parseInt(params.id);
  const product = await getProductById(productId);
  if (!product) return notFound();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.price * 100, // TODO must allow float in listing price
    currency: "sgd",
    metadata: {
      buyerId: user.id,
      sellerId: product.sellerId,
      middlemanId: "kp_19127ee229284767b48ffa1b49039ad2", // TODO, hardcoded john to be the middleman
      productId: productId,
    }
  })
  if (!paymentIntent.client_secret) throw new Error("An error occured with the payment")
  return (
    <div className="flex justify-center gap-10 mt-12">
      {/* Checkout form */}
      <Card className="flex-1">
        <CardContent>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 0">
            Checkout
          </h2>
          <p className="mt-2 mb-12 text-center text-sm text-gray-600 0">Complete your purchase</p>
          <CheckoutForm clientSecret={paymentIntent.client_secret} />
        </CardContent>
      </Card>
      {/* Product info */}
      <ProductDetails product={product} />
    </div>
  )
};

function ProductDetails({ product }: { product: ProductType }) {
  return <>
    <Card className="w-1/3" >
      <h2 className="p-4 text-3xl font-semibold">
        Order Summary
      </h2>
      <div className="p-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Image
              alt="Product Image"
              className="rounded-lg object-cover w-full aspect-square"
              height={300}
              src={product.imagePath}
              width={300}
            />
          </div>
          <div className="space-y-4">
            <h3 className="" >{product.title}</h3>
            <p className="text-gray-500">
              ${product.price}.00
            </p>
          </div>
        </div>
      </div>
    </Card>
  </>
}

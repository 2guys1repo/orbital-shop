import { getAuthenticatedUser } from "@/app/_actions/auth";
import { getProductById } from "@/app/_actions/product";
import CheckoutForm from "@/components/CheckoutForm";
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
    amount: product.price,
    currency: "sgd",
    metadata: {
      buyerId: user.id,
      sellerId: product.sellerId,
      middlemanId: "kp_4c4b25b7a8ee4a208017531c59dca211", // TODO all same tag for now
      productId: productId,
    }
  })
  if (!paymentIntent.client_secret) throw new Error("An error occured with the payment")
  return <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-md space-y-8">
      <ProductDetails product={product} />
      <CheckoutForm clientSecret={paymentIntent.client_secret} />
    </div>
  </div>
};

function ProductDetails({ product }: { product: ProductType }) {
  return <>
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
        <h3 className="text-2xl font-bold">{product.title}</h3>
        <p className="text-gray-500 0">
          {product.description}
        </p>
        <div className="text-3xl font-bold">${product.price}</div>
      </div>
    </div>
    <div>
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 0">
        Checkout
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 0">Complete your purchase</p>
    </div>

  </>
}

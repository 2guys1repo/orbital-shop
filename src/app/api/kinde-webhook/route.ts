import { createUser } from "@/app/_actions/user";
import jwt, { Jwt } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { NextResponse } from "next/server";

// This will fetch the public JSON web keys file
const client = jwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export async function POST(req: Request) {
  try {
    // Get the token from the request
    const token = await req.text();

    // Decode the token
    const { header } = jwt.decode(token, { complete: true }) as Jwt;
    const { kid } = header;

    // Verify the token
    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    const event = jwt.verify(token, signingKey) as jwt.JwtPayload;

    // Handle various events
    switch (event?.type) {
      case "user.authenticated":
        // handle user authenticated event
        // console.log(event.data.user.id);
        break;
      case "user.created":
        // handle user created event
        // console.log(event.data);
        await createUser(event.data.user) // Creates the user in our database
        break;
      default:
        // other events that we don't handle
        break;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message)
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
  }
  return NextResponse.json({ status: 200, statusText: "success" }); // only prod returns response
}
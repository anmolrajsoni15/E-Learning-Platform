import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import {headers} from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST (req: Request){
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    console.log("error", error);
    return new NextResponse("Webhook Error", {status: 400})
  }

  const session = event.data.object as Stripe.Checkout.Session;

  console.log("session metadata", session.metadata);

  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if(event.type === "checkout.session.completed"){
    if(!userId || !courseId){
      return new NextResponse("Missing metadata", {status: 400})
    }

    await db.purchase.create({
      data: {
        userId,
        courseId,
      }
    })
  }
  else{
    return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, {status: 200})
  }

  return new NextResponse("Success", {status: 200})
}
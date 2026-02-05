import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  
  // 1. 获取签名 (Next.js 新版中 headers 是异步的，必须加 await)
  const headerPayload = await headers();
  const signature = headerPayload.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    // 2. 验证 Webhook 签名 (确保请求真的来自 Stripe)
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    // -------------------------------------------------------
    // 事件 A：首次支付成功 (checkout.session.completed)
    // -------------------------------------------------------
    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      if (!session?.metadata?.userId) {
        return new NextResponse("User id is required", { status: 400 });
      }

      console.log(`Payment successful for user: ${session.metadata.userId}`);

      // 🔥 关键修复：使用 upsert (更新或创建)
      // 如果用户之前点过生成按钮，数据库里已经有记录了，用 create 会报错。
      // upsert 的意思是：如果存在就更新，如果不存在就创建。
      await db.userSubscription.upsert({
        where: {
          userId: session.metadata.userId,
        },
        create: {
          userId: session.metadata.userId,
          stripeCustomerId: subscription.customer as string,
          isPro: true, // 开通权限
        },
        update: {
          stripeCustomerId: subscription.customer as string,
          isPro: true, // 更新权限
        },
      });
    }

    // -------------------------------------------------------
    // 事件 B：自动续费成功 (invoice.payment_succeeded)
    // -------------------------------------------------------
    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      // 根据 Stripe 客户 ID 更新数据库
      await db.userSubscription.update({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
        data: {
          isPro: true,
        },
      });
    }
    
  } catch (error) {
    // 捕获数据库操作错误，防止服务器崩溃，并在终端打印具体原因
    console.error("Database operation failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}
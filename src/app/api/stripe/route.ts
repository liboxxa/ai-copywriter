import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

const absoluteUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
};

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. 查找用户订阅记录
    const userSubscription = await db.userSubscription.findUnique({
      where: { userId },
    });

    // 2. 如果已经是 Stripe 客户，尝试跳转到管理面板 (取消订阅等)
    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: absoluteUrl("/dashboard"),
      });
      return NextResponse.json({ url: stripeSession.url });
    }

    // 3. 如果不是，创建一个新的支付会话 (Checkout Session)
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: absoluteUrl("/dashboard?success=1"), // 支付成功跳回 dashboard
      cancel_url: absoluteUrl("/dashboard?canceled=1"),  // 取消也跳回
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "AI Copywriter Pro",
              description: "无限次生成文案",
            },
            unit_amount: 999, // $9.99 (单位是美分)
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId, // 关键：把 userId 传给 Stripe，以便 Webhook 知道是谁付的钱
      },
    });

    return NextResponse.json({ url: stripeSession.url });

  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
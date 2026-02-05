import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2026-01-28.clover", // 使用最新版即可
  typescript: true,
});
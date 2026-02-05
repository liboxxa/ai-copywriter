import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import OpenAI from "openai"; // 引入 OpenAI SDK

// 初始化客户端 (指向阿里云)
const client = new OpenAI({
  apiKey: process.env.ALIYUN_API_KEY,
  baseURL: process.env.ALIYUN_BASE_URL,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { prompt } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // 1. 检查额度
    const userSubscription = await db.userSubscription.findUnique({
      where: { userId },
    });

    // 如果没有记录（新用户），创建记录
    if (!userSubscription) {
      await db.userSubscription.create({
        data: { userId, maxUsage: 3 },
      });
    }

    // 再次查询以获取最新状态
    const subscription = await db.userSubscription.findUnique({
      where: { userId },
    });

    // 权限检查：不是 Pro 且 次数已用完
    if (!subscription?.isPro && subscription?.usageCount! >= subscription?.maxUsage!) {
      return new NextResponse("Free trial expired.", { status: 403 });
    }

    // 2. 调用真 AI (通义千问 qwen-plus)
    const completion = await client.chat.completions.create({
      model: "qwen-plus", // 阿里云的模型名称
      messages: [
        {
          role: "system",
          content: "你是一个资深的小红书爆款文案专家。请根据用户关键词，写一段吸引人的种草文案。要求：包含Emoji表情，语气活泼，包含3-5个相关Hashtag。直接输出文案内容，不要包含'好的'等废话。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const aiContent = completion.choices[0].message.content || "生成失败，请重试";

    // 3. 扣减次数 (仅非 Pro 用户扣除，或者都扣除看你策略，这里既然是无限次，Pro就不扣了或者仅记录)
    if (!subscription?.isPro) {
      await db.userSubscription.update({
        where: { userId },
        data: { usageCount: subscription!.usageCount + 1 },
      });
    }

    // 4. 记录生成历史
    await db.marketingCopy.create({
      data: {
        userId,
        prompt,
        content: aiContent,
      },
    });

    return NextResponse.json(aiContent);

  } catch (error) {
    console.log("[GENERATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
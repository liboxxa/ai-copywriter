import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // 确保你之前的 db.ts 在 src/lib/db.ts

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

    // 1. 获取或创建用户订阅信息 (Lazy Creation)
    // 对应 JD：数据库设计、SaaS 基础设施
    let userSubscription = await db.userSubscription.findUnique({
      where: { userId },
    });

    if (!userSubscription) {
      userSubscription = await db.userSubscription.create({
        data: {
          userId,
          maxUsage: 3, // 默认免费 3 次
        },
      });
    }

    // 2. 检查剩余次数
    if (!userSubscription.isPro && userSubscription.usageCount >= userSubscription.maxUsage) {
      return new NextResponse("Free trial expired. Please upgrade.", { status: 403 });
    }

    // 3. 模拟 AI 生成 (这里用 Mock 代替真实的 LLM 调用，确保速度)
    // 对应 JD：AI 生成逻辑、模型接入
    // 如果你有通义千问/OpenAI Key，可以在这里替换
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 假装思考1秒
    
    const brands = ["绝绝子", "YYDS", "暴风吸入", "甚至还有点小确幸", "真的好用到哭"];
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    
    const aiContent = `
【${prompt}】亲测有效！✨
家人们，谁懂啊！今天必须给你们安利这个神器！
${prompt} 真的太好用了吧，${randomBrand}！
使用体验直接拉满，感觉之前的都白买了 😭
真心推荐给各位刘亦菲们，冲就完事了！👉 #好物推荐 #${prompt}
    `.trim();

    // 4. 更新数据库：扣除次数 + 记录历史
    // 对应 JD：Prisma 操作
    await db.userSubscription.update({
      where: { userId },
      data: { usageCount: userSubscription.usageCount + 1 },
    });

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
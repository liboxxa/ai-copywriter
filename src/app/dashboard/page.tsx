import DashboardClient from "./dashboard-client";
import HistoryList from "./history";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;

  const userSubscription = userId
    ? await db.userSubscription.findUnique({ where: { userId } })
    : null;

  const isPro = Boolean(userSubscription?.isPro);
  const checkoutSuccess = searchParams?.success === "1";
  const checkoutCanceled = searchParams?.canceled === "1";

  const userInfo = user
    ? {
        imageUrl: user.imageUrl,
        name: user.firstName || user.username || "用户",
      }
    : null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 动态背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 right-16 w-[28rem] h-[28rem] bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-16 left-16 w-[28rem] h-[28rem] bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <DashboardClient
          isPro={isPro}
          userInfo={userInfo}
          checkoutSuccess={checkoutSuccess}
          checkoutCanceled={checkoutCanceled}
        />
        
        {/* 分割线 */}
        <div className="my-20 flex items-center justify-center">
          <span className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"></span>
          <span className="absolute bg-secondary/70 backdrop-blur-xl border border-border px-8 py-3 text-sm font-black text-foreground tracking-wider uppercase rounded-full shadow-xl shadow-black/20">
            历史记录
          </span>
        </div>

        <HistoryList />
      </div>
    </div>
  );
}
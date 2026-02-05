import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Clock } from "lucide-react";

export default async function HistoryList() {
  const { userId } = await auth();
  if (!userId) return null;

  const history = await db.marketingCopy.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  if (history.length === 0) return (
    <div className="text-center py-24">
      <div className="w-24 h-24 bg-card/60 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-6 border border-border shadow-xl shadow-black/20">
        <Clock className="w-12 h-12 text-primary" />
      </div>
      <p className="text-foreground text-xl font-black">暂无历史记录</p>
      <p className="text-muted-foreground text-sm mt-2 font-semibold">开始创作你的第一个爆款文案吧！</p>
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {history.map((item) => (
        <div key={item.id} className="group bg-card/60 backdrop-blur-xl p-7 rounded-2xl border border-border shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/25 transition-all hover:-translate-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <span className="font-black text-foreground line-clamp-1 max-w-[80%] text-lg">{item.prompt}</span>
              <Clock className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-medium">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
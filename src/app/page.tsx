import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Sparkles, TrendingUp, ShieldCheck, ArrowRight ,Zap} from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  const user = userId ? await currentUser() : null;
  const userSubscription = userId
    ? await db.userSubscription.findUnique({ where: { userId } })
    : null;
  const isPro = Boolean(userSubscription?.isPro);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4ODdlZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtOS45NC04LjA2LTE4LTE4LTE4UzAgOC4wNiAwIDE4czguMDYgMTggMTggMTggMTgtOC4wNiAxOC0xOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-15"></div>
      
      {/* 顶部导航 */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-border/60 bg-background/70 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl text-foreground">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 rotate-3 hover:rotate-0 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">灵感工坊</span>
          </div>
          {userId && user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="secondary" className="rounded-full">
                  进入工作台
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-[2px] ${
                    isPro
                      ? "bg-gradient-to-r from-cyan-400/70 via-blue-400/70 to-indigo-400/70"
                      : "bg-border"
                  }`}
                >
                  <img
                    src={user.imageUrl}
                    alt="avatar"
                    className="h-9 w-9 rounded-full bg-secondary object-cover"
                  />
                </div>

                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-foreground">
                    {user.firstName || user.username || "用户"}
                  </span>
                  {isPro ? (
                    <span className="text-[11px] font-bold text-primary">PRO</span>
                  ) : (
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Free
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" className="hover:bg-accent/60 text-muted-foreground font-medium">登录</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all">
                  免费注册
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero 区域 */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/60 border border-border text-muted-foreground text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-35"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New: 通义千问大模型已接入
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            让 AI 替你写出
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
              全网爆款文案
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000">
            拒绝灵感枯竭。专为小红书、抖音创作者设计。
            <br />
            输入关键词，3秒生成包含表情包、Hashtag 的种草文案。
          </p>

          <div className="flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/15 hover:shadow-2xl hover:-translate-y-1 transition-all">
                免费开始使用 <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 背景装饰球 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-indigo-500/20 rounded-full blur-3xl -z-10 opacity-60"></div>
      </section>

      {/* 特性卡片 */}
      <section className="py-20 bg-card/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-yellow-500" />}
            title="极速生成"
            desc="基于通义千问大模型，响应速度快，懂中文语境，3秒出稿。"
            delay="0"
          />
          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6 text-green-500" />}
            title="爆款逻辑"
            desc="内置经过验证的 Prompt 模板，生成的文案自带流量感，CTR 翻倍。"
            delay="100"
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-blue-500" />}
            title="商业闭环"
            desc="完整的 SaaS 架构，支持订阅管理与额度控制，安全可靠。"
            delay="200"
          />
        </div>
      </section>

      <footer className="py-8 text-center text-muted-foreground text-sm">
        © 2026 AI Copywriter SaaS. Built with Next.js & Stripe.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: string }) {
  return (
    <div 
      className="p-8 bg-card/60 rounded-2xl border border-border/60 shadow-lg shadow-black/15 hover:shadow-xl hover:shadow-black/20 transition-all hover:-translate-y-1 duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 bg-secondary/60 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}
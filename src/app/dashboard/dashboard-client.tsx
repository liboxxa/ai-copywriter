"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Crown, Copy, Check, Wand2 } from "lucide-react";

type Props = {
  isPro: boolean;
  userInfo: {
    imageUrl: string;
    name: string;
  } | null;
  checkoutSuccess: boolean;
  checkoutCanceled: boolean;
};

export default function DashboardClient(props: Props) {
  const { isPro, userInfo, checkoutSuccess, checkoutCanceled } = props;
  const { user: clerkUser } = useUser();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const displayUser =
    userInfo ??
    (clerkUser
      ? {
          imageUrl: clerkUser.imageUrl,
          name: clerkUser.firstName || clerkUser.username || "用户",
        }
      : null);

  const onGenerate = async () => {
    // ... 保持你之前的逻辑不变 ...
    // 为了演示 UI，这里只是外壳，逻辑请保留原来的 fetch
    try {
      setLoading(true);
      setResult("");
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      if (response.status === 403) {
        alert("请升级 Pro 版！");
        return;
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubscribe = async () => {
    // ... 保持你之前的逻辑不变 ...
    if (isPro) {
      setNotice("您已是 Pro 会员");
      return;
    }
    const response = await fetch("/api/stripe");
    const data = await response.json();
    window.location.href = data.url;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!checkoutSuccess) return;

    if (isPro) {
      setNotice("开通成功：您已成为 Pro 会员");
      return;
    }

    setNotice("支付成功：正在为您开通 Pro 权益（如未生效请稍后刷新）");
  }, [checkoutSuccess, isPro]);

  useEffect(() => {
    if (!checkoutCanceled) return;
    setNotice("已取消支付");
  }, [checkoutCanceled]);

  useEffect(() => {
    if (!checkoutSuccess && !checkoutCanceled) return;
    window.history.replaceState(null, "", "/dashboard");
  }, [checkoutSuccess, checkoutCanceled]);

  return (
    <div className="space-y-10">
      {notice && (
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl px-6 py-4 shadow-xl shadow-black/20 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start justify-between gap-4">
            <div className="text-sm font-semibold text-foreground">{notice}</div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 顶部文案 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8">
        <div>
          <h2 className="text-5xl md:text-6xl font-black flex items-center gap-4 mb-4 text-foreground">
            ✨ AI 创作工作台
            <span className="text-xs bg-secondary/70 backdrop-blur-xl border border-border px-4 py-2 rounded-full text-foreground font-black shadow-lg shadow-black/20">
              Beta
            </span>
          </h2>
          <p className="text-muted-foreground text-xl font-bold">
            激发灵感，瞬间生成高质量种草文案 🚀
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-[2px] ${
                isPro
                  ? "bg-gradient-to-r from-cyan-400/70 via-blue-400/70 to-indigo-400/70"
                  : "bg-border"
              }`}
            >
              {displayUser ? (
                <img
                  src={displayUser.imageUrl}
                  alt="avatar"
                  className="h-10 w-10 rounded-full bg-secondary object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-secondary/70 animate-pulse" />
              )}
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-foreground">
                {displayUser ? displayUser.name : "加载中"}
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

          <button
            onClick={onSubscribe}
            className="flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-2xl text-base font-black shadow-xl shadow-primary/20 hover:shadow-primary/25 transition-all"
          >
            <Crown className="w-6 h-6" /> 升级 Pro 会员
          </button>
        </div>
      </div>

      {/* 核心卡片 */}
      <div className="bg-card/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 p-4 border border-border">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          {/* 输入框 */}
          <div className="flex-1 bg-secondary/60 rounded-2xl flex items-center px-6 hover:bg-secondary/80 transition-all border border-border group">
            <Wand2 className="w-7 h-7 text-primary mr-4 group-hover:rotate-12 transition-transform" />
            <input 
              className="flex-1 bg-transparent border-none outline-none h-16 text-foreground placeholder:text-muted-foreground text-lg font-semibold"
              placeholder="✍️ 输入关键词，例如：迪奥999、全自动咖啡机..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
          </div>
          
          {/* 按钮 */}
          <Button 
            onClick={onGenerate} 
            disabled={loading || !prompt}
            className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/25 transition-all font-black text-lg"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Sparkles className="w-6 h-6 mr-2" />}
            开始生成
          </Button>
        </div>
      </div>

      {/* 结果展示 */}
      {result && (
        <div className="bg-card/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-secondary/70 backdrop-blur-xl border-b border-border px-8 py-5 flex justify-between items-center">
            <span className="text-lg font-black text-foreground flex items-center gap-3">
              <Sparkles className="w-6 h-6" /> 生成结果
            </span>
            <button onClick={handleCopy} className="text-sm text-foreground flex items-center gap-2 bg-background/40 hover:bg-background/60 border border-border px-5 py-2.5 rounded-xl transition-all font-bold backdrop-blur-sm">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />} {copied ? "已复制 ✓" : "复制"}
            </button>
          </div>
          <div className="p-10 text-foreground leading-relaxed whitespace-pre-wrap text-lg font-medium">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
      {/* 动态背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 right-16 w-[28rem] h-[28rem] bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-16 left-16 w-[28rem] h-[28rem] bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10">
        <SignIn />
      </div>
    </div>
  );
}
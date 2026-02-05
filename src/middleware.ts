import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 定义需要保护的路由
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // 1. 获取认证对象
    const authObj = await auth();
    
    // 2. 手动检查：如果没有 userId，说明没登录
    if (!authObj.userId) {
      // 3. 强制重定向到登录页
      return authObj.redirectToSignIn();
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
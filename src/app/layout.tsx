import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="zh-CN" className={`${inter.variable} dark`}>
        <body className="antialiased bg-background text-foreground min-h-dvh">{children}</body>
      </html>
    </ClerkProvider>
  )
}
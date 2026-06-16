import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "HealthShop AI - Sức khỏe thông minh",
  description:
    "Cửa hàng thực phẩm chức năng và sản phẩm sức khỏe hàng đầu Việt Nam, được AI tư vấn cá nhân hóa.",
  keywords: ["thực phẩm chức năng", "sức khỏe", "vitamin", "supplement", "AI tư vấn"],
};

import AuthProvider from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-white font-[family-name:var(--font-inter)]">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

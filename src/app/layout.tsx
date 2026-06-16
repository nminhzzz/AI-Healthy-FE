import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-slate-800 font-[family-name:Times_New_Roman,Times,serif]">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

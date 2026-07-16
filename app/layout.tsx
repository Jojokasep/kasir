import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aplikasi Kasir POS Modern",
  description: "Aplikasi Kasir Full Fitur dengan Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </body>
    </html>
  );
}
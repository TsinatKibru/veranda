import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import BasketDrawer from "@/components/BasketDrawer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Veranda Plastics - Premium Outdoor Furniture",
  description:
    "High-quality plastic outdoor furniture for hotels and resorts. Durable, stylish, and sustainable.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <BasketDrawer />
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Sahi.LK - Authentic Electronics & Gadgets in Sri Lanka",
    template: "%s | Sahi.LK",
  },
  description:
    "Your trusted source for authentic electronics, wireless earbuds, Xiaomi accessories, and mobile gadgets in Sri Lanka. Fast delivery island-wide with 100% genuine products.",
  keywords: [
    "electronics Sri Lanka",
    "wireless earbuds",
    "Xiaomi accessories",
    "mobile gadgets",
    "online shopping Sri Lanka",
    "SoundPEATS",
    "authentic products",
  ],
  authors: [{ name: "Sahi.LK" }],
  creator: "Sahi.LK",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sahi.lk",
    title: "Sahi.LK - Authentic Electronics & Gadgets",
    description: "Your trusted source for authentic electronics and gadgets in Sri Lanka",
    siteName: "Sahi.LK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sahi.LK - Authentic Electronics & Gadgets",
    description: "Your trusted source for authentic electronics and gadgets in Sri Lanka",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

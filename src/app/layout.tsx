import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MetaPixelTracker from "@/components/tracking/meta-pixel-tracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FPT 3 Miền - Lắp Wifi Tốc Độ Cao Toàn Quốc",
  description: "Lắp đặt mạng Wifi Internet cáp quang toàn quốc. Uy tín - Tận tâm - Nhiệt tình.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: ["/logo.png"],
    apple: [
      { url: "/logo.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <MetaPixelTracker />
        {children}
      </body>
    </html>
  );
}

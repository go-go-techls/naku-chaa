import * as React from "react";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import ThemeRegistry from "./ThemeRegistry";
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: "AIにみてもらおう by テックルズ",
  description:
    "生成AIにあなたの作品を見てもらって、感想やアドバイスをもらえるサービスです",
  keywords: "生成AI, 作品評価, アート, クリエイティブ, AI, フィードバック",
  authors: [{ name: "テックルズ" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/techls-color.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* Google FontsからKosugi Maruフォントをインポート */}
        <link
          href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeRegistry>
          <AuthProvider>{props.children}</AuthProvider>
        </ThemeRegistry>
        <Analytics />
      </body>
    </html>
  );
}

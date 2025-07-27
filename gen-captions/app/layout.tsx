import * as React from "react";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import ThemeRegistry from "./ThemeRegistry";

export const metadata = {
  title: "AIにみてもらおう by テックルズ",
  description:
    "生成AIにあなたの作品を見てもらって、感想やアドバイスをもらえるサービスです",
  keywords: "生成AI, 作品評価, アート, クリエイティブ, AI, フィードバック",
  authors: [{ name: "テックルズ" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AIにみてもらう",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/techls-color.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
  viewportFit: "cover",
  themeColor: "#3386E7",
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
        {/* PWA設定 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3386E7" />

        {/* iOS Safari設定 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AIにみてもらおう" />
        <link rel="apple-touch-icon" href="/techls-color.svg" />

        {/* Android Chrome設定 */}
        <meta name="mobile-web-app-capable" content="yes" />

        {/* 全画面表示設定 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        {/* Service Worker登録 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <ThemeRegistry>
          <AuthProvider>{props.children}</AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}

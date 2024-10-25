import * as React from "react";
import "./globals.css";

export const metadata = {
  title: "naku-chaa",
  description: "naku-chaa",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google FontsからKosugi Maruフォントをインポート */}
        <link
          href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{props.children}</body>
    </html>
  );
}

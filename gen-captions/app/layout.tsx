import * as React from "react";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

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
      <body>
        <AuthProvider>
          {props.children}
        </AuthProvider>
      </body>
    </html>
  );
}

import * as React from "react";
import "./globals.css";

export const metadata = {
  title: "naku-chaa",
  description: "naku-chaa",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

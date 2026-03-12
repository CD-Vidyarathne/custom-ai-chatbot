import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat Bubble",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-transparent">{children}</body>
    </html>
  );
}

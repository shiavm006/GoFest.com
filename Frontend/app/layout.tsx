import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat_Brush, Audiowide } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveatBrush = Caveat_Brush({
  weight: "400",
  variable: "--font-caveat-brush",
  subsets: ["latin"],
});

const audiowide = Audiowide({
  weight: "400",
  variable: "--font-audiowide",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoFest - College Fest Management Platform",
  description: "Discover and host college fests and events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveatBrush.variable} ${audiowide.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

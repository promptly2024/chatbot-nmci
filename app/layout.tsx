import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatBot NMCI",
  description: "Admin app to see dashboard, stats and analytics with chatbots",
  openGraph: {
    title: "ChatBot NMCI",
    description: "Admin app to see dashboard, stats and analytics with chatbots",
    url: "http://nmci.co.in/chatbot",
    siteName: "ChatBot NMCI",
    images: [
      {
        url: "http://nmci.co.in/wp-content/uploads/2023/01/NMCI-Logo-1.png",
        width: 800,
        height: 600,
        alt: "ChatBot NMCI Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}

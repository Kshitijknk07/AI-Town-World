import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/main-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Town World",
  description: "Autonomous AI Agent Simulation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "WeCan Academy | AI Course",
  description:
    "Learn AI fundamentals, prompt engineering, and build real-world AI projects in our comprehensive 12-week course at WeCan Academy.",
  keywords: [
    "AI course",
    "artificial intelligence",
    "machine learning",
    "prompt engineering",
    "WeCan Academy",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

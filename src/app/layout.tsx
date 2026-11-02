import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import { AdminShell } from "@/components/AdminShell";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crave Admin",
  description: "Operations workspace for the Crave food delivery platform.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}

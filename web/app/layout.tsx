import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const siteUrl = "https://programming-books-pdf.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ultimate Programming Books — Curated library for 30 languages",
    template: "%s · Ultimate Programming Books",
  },
  description:
    "Browse 581+ curated programming books for Python, JavaScript, Java, Rust, Go, and more. Search by title, filter by skill level, and read via public Drive links.",
  keywords: [
    "programming books",
    "programming ebooks",
    "python books",
    "javascript books",
    "learn to code",
    "coding books",
    "rust books",
    "golang books",
    "developer learning resources",
  ],
  authors: [{ name: "Ultimate Programming Books" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Ultimate Programming Books — Curated library for 30 languages",
    description:
      "Searchable library of programming books by language and skill level. Python, JavaScript, Java, Rust, Go, and more.",
    siteName: "Ultimate Programming Books",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate Programming Books",
    description:
      "Curated programming books for 30 languages — beginner to advanced.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

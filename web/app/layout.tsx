import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const siteUrl = "https://freecodebooks.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ultimate Programming Books — Curated library for 32 languages",
    template: "%s · Ultimate Programming Books",
  },
  description:
    "Browse 634+ curated programming books for Python, JavaScript, Java, Rust, Go, and more. Search by title, filter by skill level, and read via public Drive links.",
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
  creator: "Ultimate Programming Books",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Ultimate Programming Books — Curated library for 32 languages",
    description:
      "Searchable library of programming books by language and skill level. Python, JavaScript, Java, Rust, Go, and more.",
    siteName: "Ultimate Programming Books",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultimate Programming Books",
    description:
      "Curated programming books for 32 languages — beginner to advanced.",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "education",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Ultimate Programming Books",
      description:
        "Curated programming books for 32 languages with a searchable web library.",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Ultimate Programming Books",
      url: siteUrl,
      sameAs: ["https://github.com/sx4im/programming-books-pdf"],
    },
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/library#collection`,
      url: `${siteUrl}/library`,
      name: "Programming books library",
      description:
        "Browse programming books by language, filter by skill level, and search by title.",
      isPartOf: { "@id": `${siteUrl}/#website` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const siteUrl = "https://freecodebooks.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Programming Books — 32 Languages, Beginner to Advanced",
    template: "%s · Programming Books",
  },
  description:
    "Browse 670+ curated programming books for Python, JavaScript, Java, Rust, Go, and more. Search by title, filter by skill level, and read on the live library.",
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
  authors: [{ name: "Programming Books" }],
  creator: "Programming Books",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Programming Books — 32 Languages, Beginner to Advanced",
    description:
      "Searchable library of programming books by language and skill level. Python, JavaScript, Java, Rust, Go, and more.",
    siteName: "Programming Books",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Programming Books — 670+ curated titles across 32 languages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Programming Books",
    description:
      "Curated programming books for 32 languages — beginner to advanced.",
    images: ["/og.png"],
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
      name: "Programming Books",
      description:
        "Curated programming books for 32 languages with a searchable web library.",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Programming Books",
      url: siteUrl,
      sameAs: ["https://github.com/sx4im/programming-books-pdf"],
    },
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/library#collection`,
      url: `${siteUrl}/library`,
      name: "Programming Books library",
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

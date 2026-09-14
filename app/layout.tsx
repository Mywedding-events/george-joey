import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import "./globals.css";

const coverImageTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
} as const;

function getCoverImage() {
  const uploadsDirectory = join(process.cwd(), "public", "uploads");
  const supportedExtensions = Object.keys(coverImageTypes);
  const fileName = readdirSync(uploadsDirectory).find((entry) => {
    const lowerCaseEntry = entry.toLowerCase();

    return supportedExtensions.some(
      (extension) => lowerCaseEntry === `whatsapp-cover${extension}`,
    );
  });

  if (!fileName) {
    throw new Error(
      "Missing WhatsApp cover image. Add whatsapp-cover.jpg, whatsapp-cover.jpeg, or whatsapp-cover.png to public/uploads.",
    );
  }

  const extension = fileName
    .slice(fileName.lastIndexOf("."))
    .toLowerCase() as keyof typeof coverImageTypes;

  return {
    path: `/uploads/${fileName}`,
    type: coverImageTypes[extension],
  };
}

function getSiteUrl() {
  // metadataBase must match the real host so chat crawlers can resolve the
  // Open Graph image. NEXT_PUBLIC_SITE_URL can override this.
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    "https://georgejoey.mywedding.events";

  return new URL(
    configuredUrl.startsWith("http") ? configuredUrl : `https://${configuredUrl}`,
  );
}

const siteUrl = getSiteUrl();
// Use a lightweight 1200x630 cover for link previews. WhatsApp (and most
// chat apps) will not render Open Graph images larger than ~300 KB, so the
// full-resolution photos in /uploads are unsuitable as preview images.
const coverImage = getCoverImage();
const coverImageUrl = new URL(coverImage.path, siteUrl).toString();
const previewImage = {
  url: coverImageUrl,
  width: 1200,
  height: 630,
  alt: "George and Joey wedding invitation",
  type: coverImage.type,
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "George & Joey - Wedding Invitation",
  description:
    "Wedding invitation for George and Joey on Friday, September 18, 2027.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "George & Joey - Wedding Invitation",
    description:
      "Wedding invitation for George and Joey on Friday, September 18, 2027.",
    url: siteUrl.toString(),
    siteName: "George & Joey Wedding Invitation",
    type: "website",
    locale: "en_US",
    images: [previewImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "George & Joey - Wedding Invitation",
    description:
      "Wedding invitation for George and Joey on Friday, September 18, 2027.",
    images: [previewImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2e5882",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Libre+Baskerville:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ visibility: "hidden" }}>
        <noscript>
          <style>{`body{visibility:visible!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}

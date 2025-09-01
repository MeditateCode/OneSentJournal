import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneSentJournal - Minimal Journal",
  description:
    "OneSentJournal - Minimal Journal is your simple, minimal online journal. Write one line daily to track your thoughts and moods effortlessly.",
  keywords: ["simple journal", "minimal journal", "daily journal", "online journal", "one line journal"],
  openGraph: {
    title: "OneSentJournal - Minimal Journal | Simple & Minimal Journal",
    description:
      "Track your daily thoughts effortlessly with OneSentJournal. A minimal, online journal to capture one line every day.",
    url: "https://onesentjournal.vercel.app/",
    siteName: "OneSentJournal Journal",
    images: [
      {
        url: "https://1sentjournal.com/og-image.png", // replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "OneSentJournal Journal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneSentJournal - Minimal Journal",
    description:
      "Track your daily thoughts effortlessly with 1S-E-N-T Journal. A minimal, online journal to capture one line every day.",
  },
  icons: {
    icon: "/favicon.ico", // main favicon
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // optional for Apple devices
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

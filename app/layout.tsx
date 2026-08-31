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
  metadataBase: new URL("https://the-quiet-page-ivory.vercel.app"),

  title: {
    default: "The Quiet Page",
    template: "%s | The Quiet Page",
  },

  description:
    "A quiet space for reflections, stories, fragments, notes, and things worth sitting with.",

  openGraph: {
    title: "The Quiet Page",
    description:
      "A quiet space for reflections, stories, fragments, notes, and things worth sitting with.",
    url: "https://the-quiet-page-ivory.vercel.app",
    siteName: "The Quiet Page",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

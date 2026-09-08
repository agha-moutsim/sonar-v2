import type { Metadata, Viewport } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SONAR — One name. Every chain.",
  description:
    "SONAR replaces tangled wallet addresses with a single web3 identity. Claim a SONAR ID, route every chain through it, and hold your assets in one wallet.",
  openGraph: {
    title: "SONAR — One name. Every chain.",
    description:
      "Replacing tangled wallet addresses with a single web3 identity. Claim a SONAR ID and route every chain through it.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070b10",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable}`}
    >
      <body className="bg-sonar-void text-sonar-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-sonar-signal focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-sonar-void"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

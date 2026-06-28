import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solvo Lab — Management Consultancy | Ajman Free Zone, UAE",
  description:
    "Solvo Lab FZE LLC helps startups, SMEs, and corporates bridge ideas and outcomes through strategic consultancy, innovation support, and 360° business services — based in Ajman Free Zone, UAE.",
  openGraph: {
    title: "Solvo Lab — Management Consultancy",
    description:
      "Where strategy meets execution. Tailored consulting for startups, SMEs, and corporates in the UAE and beyond.",
    url: "https://www.solvo-lab.com",
    siteName: "Solvo Lab",
    locale: "en_AE",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="bg-bg text-text antialiased">{children}</body>
    </html>
  );
}

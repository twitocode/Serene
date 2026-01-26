import Providers from "@/lib/components/providers";
import type { Metadata } from "next";
import {
  Funnel_Sans,
  IBM_Plex_Mono,
  Playfair_Display,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const yeastyFlavors = localFont({
  src: "./fonts/Yeasty_Flavors.ttf",
  variable: "--font-yeasty",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: "400",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

const funnelSans = Funnel_Sans({
  variable: "--font-sans",
  weight: "400",
  subsets: ["latin"],
});
const funnelDisplay = Funnel_Sans({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Serene - Mental Wellness for Students",
  description:
    "A mental health platform for university and college students. Track your emotional well-being, connect with your community, and discover personalized wellness content.",
  icons: {
    icon: "/mochi/mochi.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ibmPlexMono.variable} ${playfairDisplay.variable} ${funnelSans.variable} ${funnelDisplay.variable} ${yeastyFlavors.variable} antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

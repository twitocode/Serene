import type { Metadata } from "next";
import { IBM_Plex_Mono, Lora, Plus_Jakarta_Sans } from "next/font/google";
import Providers from "@/lib/components/providers";
import { Toaster } from "@/lib/components/ui/sonner";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
	variable: "--font-family-mono",
	weight: ["400", "500"],
	subsets: ["latin"],
});

const lora = Lora({
	variable: "--font-family-serif",
	weight: ["400", "500", "600", "700"],
	style: ["normal", "italic"],
	subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
	variable: "--font-family-sans",
	weight: ["400", "500", "600", "700"],
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
			<head>
				<link rel="icon" href="/favicons/favicon-32x32.png" sizes="any" />
			</head>
			<body
				className={`${ibmPlexMono.variable} ${lora.variable} ${plusJakarta.variable} font-sans antialiased`}
			>
				<Providers>{children}</Providers>
				<Toaster
					position="top-right"
					toastOptions={{
						style: {
							marginTop: "64px",
						},
					}}
				/>
			</body>
		</html>
	);
}

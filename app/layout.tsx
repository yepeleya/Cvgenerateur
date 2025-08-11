import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CV Pro - Créez votre CV professionnel | Tenena",
  description: "Créez des CV professionnels adaptés à votre pays avec des modèles personnalisés. Supports la France, Côte d'Ivoire, et de nombreux autres pays. Par Tenena.",
  keywords: "CV, générateur CV, curriculum vitae, emploi, carrière, Tenena",
  authors: [{ name: "Tenena" }],
  robots: "index, follow"
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
      <html lang="fr" data-theme="cvlight">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning={true}
        >
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
}

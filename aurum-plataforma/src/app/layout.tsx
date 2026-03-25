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
  title: "AURUM — Nova Escola | Educação Financeira Completa",
  description:
    "Aprenda educação financeira do zero ao avançado. Cursos de mentalidade, renda fixa, renda variável, investimentos e muito mais. Comece agora com aula grátis.",
  keywords: [
    "educação financeira",
    "investimentos",
    "renda fixa",
    "renda variável",
    "cursos financeiros",
    "como investir",
    "liberdade financeira",
    "AURUM",
  ],
  metadataBase: new URL("https://www.aurumnovaescola.com.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AURUM — Nova Escola | Educação Financeira Completa",
    description:
      "Aprenda educação financeira do zero ao avançado. Cursos de mentalidade, renda fixa, renda variável e investimentos.",
    url: "https://www.aurumnovaescola.com.br",
    siteName: "AURUM Nova Escola",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
  },
    
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/ favicon.png" type="image/svg+xml" />
      </head> 
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

//layout
import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "SmartBookings",
  description:
    "Plataforma SaaS para gestión de citas y reservaciones para pequeños negocios.",
  keywords: ["reservaciones", "citas", "booking", "agenda", "negocios", "SaaS"],
  generator: "Cristian",
  icons: {
    icon: "/public/Copilot_20251202_111206.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#041C32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { BottomNavigation } from "@/components/bottom-navigation";

export const metadata: Metadata = {
  title: "Aero Taxi - Drone Taxi Service",
  description: "Book drone taxi rides in Bangalore with real-time tracking",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased min-h-screen bg-gray-50 font-sans"
      >
        <main className="pb-20">
          {children}
        </main>
        <BottomNavigation />
      </body>
    </html>
  );
}

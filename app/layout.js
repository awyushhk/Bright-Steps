import { Manrope, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bright Steps",
  description: "AI-Enabled Decision-Support Platform for Early Detection of Autism",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${manrope.variable} ${geistMono.variable} antialiased`}
        >
          <main className="min-h-screen">
            {children}
          </main> 
        </body>
      </html>
    </ClerkProvider>
  );
}

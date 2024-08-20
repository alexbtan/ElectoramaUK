import type { Metadata } from "next";
import { Commissioner } from "next/font/google";
import NavBar from "./components/NavBar";
import "./globals.css";

const commissioner = Commissioner({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Electorama UK",
  description: "UK Electoral Mapping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#F7DCB9] w-full">
      <body className={commissioner.className}>
        <main className="h-full bg-[#F7DCB9] w-full">
          <NavBar />
          {children}
        </main>
      </body>
    </html>
  );
}

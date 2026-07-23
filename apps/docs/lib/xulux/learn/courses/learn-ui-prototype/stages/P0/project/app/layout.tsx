import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn assistant-ui",
  description: "The welcome stage for the Learn Mode prototype.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

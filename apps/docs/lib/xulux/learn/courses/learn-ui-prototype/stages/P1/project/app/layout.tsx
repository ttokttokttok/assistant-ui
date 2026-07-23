import type { Metadata } from "next";
import { RuntimeProvider } from "../components/runtime-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn assistant-ui",
  description: "The first assistant stage for the Learn Mode prototype.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <RuntimeProvider>{children}</RuntimeProvider>
      </body>
    </html>
  );
}

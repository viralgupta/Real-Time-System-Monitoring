import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/app/components/theme-provider";
import Header from "./components/Header";
import Body from "./components/Body";

export const metadata: Metadata = {
  title: "WatchDawg",
  description: "Monitor your data with WatchDawg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <Body>{children}</Body>
        </ThemeProvider>
      </body>
    </html>
  );
}

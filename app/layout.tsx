import type { Metadata } from "next"

import { ThemeProvider } from "@/app/providers"
import {
  geistSans,
  geistMono,
  hahmlet,
} from "@/app/fonts"
import "@/app/styles/globals.css"

export const metadata: Metadata = {
  title: "JGPARK",
  description: "JGPARK - Frontend Engineer",
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${hahmlet.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

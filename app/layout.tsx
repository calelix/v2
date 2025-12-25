import type { Metadata } from "next"

import { ThemeProvider } from "@/app/providers"
import {
  geistSans,
  geistMono,
  hahmlet,
  pretendard,
} from "@/app/fonts"
import "@/app/styles/globals.css"

export const metadata: Metadata = {
  title: "JGPARK",
  description: "JGPARK - Frontend Engineer",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${hahmlet.variable} ${pretendard.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

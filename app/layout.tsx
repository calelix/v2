import type { Metadata } from "next"

import "@/app/styles/globals.css"
import {
  geistSans,
  geistMono,
  hahmlet,
} from "@/app/fonts"
import {
  QueryProvider,
  ThemeProvider,
} from "@/app/providers"
import { Banner } from "@/widgets/banner"

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
    <html lang="en" data-scroll-behavior="smooth" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${hahmlet.variable} font-sans antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            <Banner>
              <p className="text-sm">
                블로그 이전 중입니다.
              </p>
            </Banner>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "@workspace/ui/globals.css"
import "@/app/styles/globals.css"
import {
  fontGeist,
  fontGeistMono,
} from "@/app/fonts"
import { ThemeProvider } from "@/app/providers"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontGeist.variable} ${fontGeistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

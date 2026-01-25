import {
  Geist,
  Geist_Mono,
  Hahmlet,
} from "next/font/google"

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  adjustFontFallback: false,
})

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const hahmlet = Hahmlet({
  variable: "--font-hahmlet",
  subsets: ["latin"],
})

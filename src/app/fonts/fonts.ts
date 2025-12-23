import {
  Geist,
  Geist_Mono,
  Hahmlet,
} from "next/font/google"
import localFont from "next/font/local"

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

export const pretendard = localFont({
  src: "../../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
})

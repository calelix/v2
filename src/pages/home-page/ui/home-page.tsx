"use client"

import { useState } from "react"

import { motion } from "framer-motion"

import { HomePageIntro } from "./home-page-intro"
import { SectionCarousel } from "./section-carousel"

export const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true)

  const handleIntroComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <HomePageIntro onComplete={handleIntroComplete} />
    )
  }

  return (
    <div
      className="px-4 lg:px-0"
      style={
        {
          "--header-height": "calc(var(--spacing)*32)",
          "--footer-height": "calc(var(--spacing)*32)",
        } as React.CSSProperties
      }
    >
      <div aria-hidden="true" className="h-32" />
      <main className="w-full max-w-2xl mx-auto min-h-[calc(100svh-var(--header-height)-var(--footer-height))]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.25 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25 }}
            className="text-center"
          >
            <h1 className="text-lg font-bold">
              Welcome !
            </h1>
            <p className="mt-4 text-xs/relaxed text-muted-foreground">
              I take my time here. This place isn{"'"}t in a hurry.
            </p>
          </motion.div>
          <SectionCarousel />
        </motion.div>
      </main>
      <div aria-hidden="true" className="h-32" />
    </div>
  )
}

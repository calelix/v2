"use client"

import { useState } from "react"

import { Button } from "@/shared/ui/shadcn/button"
import { HomePageIntro } from "./home-page-intro"

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
    <div className="flex flex-col items-center justify-center h-svh">
      <Button>
        Hello World
      </Button>
    </div>
  )
}

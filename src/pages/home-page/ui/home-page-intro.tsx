"use client"

import { useEffect } from "react"

import {
  motion,
  animate,
  useMotionValue,
  useTransform,
} from "framer-motion"

import { delay } from "@/shared/lib/utils/delay"

interface HomePageIntroProps {
  onComplete: () => void
}

const ANIMATION_DURATION = 1.25
const COMPLETE_DELAY = 0.25

export const HomePageIntro = ({
  onComplete,
}: HomePageIntroProps) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  const handleAnimationComplete = async () => {
    await delay(COMPLETE_DELAY * 1000)
    onComplete()
  }

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: ANIMATION_DURATION,
      ease: "easeInOut",
    })

    return () => {
      controls.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="relative"
        >

          <motion.div className="text-lg font-bold tabular-nums relative z-10">
            {rounded}
          </motion.div>

          <motion.div className="mt-6 w-28 h-px bg-muted/20 mx-auto rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-secondary to-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: ANIMATION_DURATION,
                ease: "easeInOut",
              }}
              onAnimationComplete={handleAnimationComplete}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}


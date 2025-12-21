"use client"

import {
  type Variants,
  motion,
} from "framer-motion"

interface FadeUpContainerProps extends React.ComponentProps<typeof motion.div> {
  staggerDelay?: number
  delay?: number
  viewportTrigger?: boolean
  onAnimationComplete?: () => void
}

export const FadeUpContainer = ({
  staggerDelay = 0.1,
  delay = 0,
  viewportTrigger = false,
  onAnimationComplete,
  children,
  ...props
}: FadeUpContainerProps) => {
  const variants: Variants = {
    hidden: {
      opacity: 1,
    },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
      },
    },
  }

  const animationProps = viewportTrigger
    ? {
      initial: "hidden",
      whileInView: "visible",
      viewport: {
        once: true,
        amount: 0.25,
      },
    } : {
      initial: "hidden",
      animate: "visible",
    }

  return (
    <motion.div
      variants={variants}
      onAnimationComplete={onAnimationComplete}
      {...animationProps}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface FadeUpItemProps extends React.ComponentProps<typeof motion.div> {
  distance?: number
  duration?: number
}

export const FadeUpItem = ({
  distance = 20,
  duration = 0.5,
  children,
  ...props
}: FadeUpItemProps) => {
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: distance,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  return (
    <motion.div variants={itemVariants} {...props}>
      {children}
    </motion.div>
  )
}

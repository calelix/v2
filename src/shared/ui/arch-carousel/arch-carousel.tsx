"use client"

import * as React from "react"
import { useWindowSize } from "usehooks-ts"

import {
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import {
  motion,
  AnimatePresence,
} from "framer-motion"

import { cn } from "@/shared/lib/utils/tailwindcss"
import { Button } from "@/shared/ui/shadcn/button"

// 삼각함수 계산에 사용되는 각도를 라디안으로 변환하는 상수 (radian = degree * (PI / 180))
const DEGREE_TO_RADIAN = Math.PI / 180
// Arch의 높이 조절 상수 (Golden Ratio 0.618, 클 수록 Arch가 깊어짐)
const Y_COMPRESSION = 0.618
// 기본 뷰포트 너비 상수 (1024px)
const DEFAULT_VIEWPORT_WIDTH = 1024

// Viewport 기반 Radius (피보나치 수열 기반)
const RADIUS_VIEWPORT_RATIO = 1 / 3 // 뷰포트 너비의 1/3
const RADIUS_MIN = 233
const RADIUS_MAX = 377

// AngleStep 설정 (원의 기하학적 분할 기반)
const ANGLE_BASE = 48 // 기본 각도
const ANGLE_MIN = 30 // 최소 간격
const ANGLE_MAX = 48 // 최대 간격
const ANGLE_SCALE_FACTOR = 200 // 뷰포트 크기 스케일링 계수 (작을수록 강한 효과)

// 깊이감 효과 설정
const SCALE_DECREASE_RATE = 0.1 // 한 칸당 크기 감소율 (10%)
const OPACITY_DECREASE_RATE = 0.2 // 한 칸당 투명도 감소율 (20%)
const SCALE_MIN = 0.75 // 최소 크기 비율 (75%)
const VISIBILITY_THRESHOLD = 2 // 가시성 임계값 칸수

// 자동 스크롤 간격 (5초)
const AUTOPLAY_INTERVAL = 5000

interface CarouselItemStyle {
  x: number
  y: number
  rotate: number
  scale: number
  opacity: number
  zIndex: number
}

interface ViewportConfig {
  radius: number
  angleStep: number
}

interface ArchCarouselContextProps {
  currentIndex: number
  totalItems: number
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  getCarouselItemStyle: (index: number) => CarouselItemStyle
  setTotalItems: (total: number) => void
}

const ArchCarouselContext = React.createContext<ArchCarouselContextProps | null>(null)

const useArchCarousel = () => {
  const context = React.useContext(ArchCarouselContext)

  if (!context) {
    throw new Error("useArchCarousel must be used within an <ArchCarousel />")
  }

  return context
}

interface ArchCarouselProps extends React.ComponentProps<"div"> {
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  loop?: boolean
  autoplay?: boolean
}

const ArchCarousel = ({
  defaultIndex = 0,
  onIndexChange,
  loop = false,
  autoplay = false,
  className,
  children,
  ...props
}: ArchCarouselProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(defaultIndex)
  const [totalItems, setTotalItems] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)

  const {
    width: viewportWidth = DEFAULT_VIEWPORT_WIDTH,
  } = useWindowSize({
    initializeWithValue: true,
    debounceDelay: 150,
  })

  const viewportConfig = React.useMemo((): ViewportConfig => {
    // Radius: Carousel Arch의 반지름 (RADIUS_MIN ~ RADIUS_MAX)
    const radius = Math.min(
      Math.max(viewportWidth * RADIUS_VIEWPORT_RATIO, RADIUS_MIN),
      RADIUS_MAX
    )

    // AngleStep: CarouselItem 간격 (ANGLE_MIN ~ ANGLE_MAX), 뷰포트 너비가 클수록 간격이 좁아짐
    const angleStep = Math.min(
      Math.max(ANGLE_BASE - viewportWidth / ANGLE_SCALE_FACTOR, ANGLE_MIN),
      ANGLE_MAX
    )

    return {
      radius,
      angleStep,
    }
  }, [viewportWidth])

  const scrollPrev = React.useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev > 0) {
        const newIndex = prev - 1
        onIndexChange?.(newIndex)
        return newIndex
      }
      if (loop) {
        const newIndex = totalItems - 1
        onIndexChange?.(newIndex)
        return newIndex
      }
      return prev
    })
  }, [totalItems, onIndexChange, loop])

  const scrollNext = React.useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < totalItems - 1) {
        const newIndex = prev + 1
        onIndexChange?.(newIndex)
        return newIndex
      }
      if (loop) {
        const newIndex = 0
        onIndexChange?.(newIndex)
        return newIndex
      }
      return prev
    })
  }, [totalItems, onIndexChange, loop])

  const scrollTo = React.useCallback((index: number) => {
    setCurrentIndex(index)
    onIndexChange?.(index)
  }, [onIndexChange])

  React.useEffect(() => {
    const shouldPauseAutoplay = !autoplay || isHovered || totalItems === 0

    if (shouldPauseAutoplay) {
      return
    }

    const intervalId = setInterval(() => {
      scrollNext()
    }, AUTOPLAY_INTERVAL)

    return () => {
      clearInterval(intervalId)
    }
  }, [autoplay, isHovered, scrollNext, totalItems])

  const getCarouselItemStyle = React.useCallback((index: number): CarouselItemStyle => {
    const position = index - currentIndex
    const absPosition = Math.abs(position)

    const { radius, angleStep } = viewportConfig
    const angle = position * angleStep

    const radian = angle * DEGREE_TO_RADIAN
    const sinValue = Math.sin(radian)
    const cosValue = Math.cos(radian)

    const x = sinValue * radius
    const y = (1 - cosValue) * radius * Y_COMPRESSION

    const scale = absPosition > VISIBILITY_THRESHOLD ? SCALE_MIN : 1 - absPosition * SCALE_DECREASE_RATE
    const opacity = absPosition > VISIBILITY_THRESHOLD ? 0 : 1 - absPosition * OPACITY_DECREASE_RATE

    return {
      x,
      y,
      rotate: angle,
      scale,
      opacity,
      zIndex: 10 - absPosition,
    }
  }, [currentIndex, viewportConfig])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  const handleMouseEnter = React.useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false)
  }, [])

  return (
    <ArchCarouselContext.Provider
      value={{
        currentIndex,
        totalItems,
        scrollPrev,
        scrollNext,
        scrollTo,
        getCarouselItemStyle,
        setTotalItems,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Arch carousel"
        {...props}
      >
        {children}
      </div>
    </ArchCarouselContext.Provider>
  )
}

const ArchCarouselContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { setTotalItems } = useArchCarousel()

  React.useEffect(() => {
    const count = React.Children.count(children)
    setTotalItems(count)
  }, [children, setTotalItems])

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        "min-h-[320px] h-[clamp(320px,40vh,450px)]",
        "md:min-h-[380px] md:h-[clamp(380px,45vh,500px)]",
        className
      )}
      {...props}
    >
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </div>
  )
}

interface ArchCarouselItemProps extends Omit<React.ComponentProps<"div">, "children"> {
  index: number
  children: React.ReactNode | ((props: { isCenter: boolean }) => React.ReactNode)
}

const ArchCarouselItem = ({
  index,
  className,
  children,
}: ArchCarouselItemProps) => {
  const { currentIndex, getCarouselItemStyle } = useArchCarousel()
  const style = getCarouselItemStyle(index)
  const isCenter = index === currentIndex

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        x: style.x,
        y: style.y,
        rotate: style.rotate,
        scale: style.scale,
        opacity: style.opacity,
      }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        zIndex: style.zIndex,
      }}
      className={cn("absolute", className)}
      data-center={isCenter}
    >
      {typeof children === "function" ? children({ isCenter }) : children}
    </motion.div>
  )
}

const ArchCarouselPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { scrollPrev } = useArchCarousel()

  return (
    <Button
      variant="outline"
      size="icon-lg"
      onClick={scrollPrev}
      className={cn(
        "absolute z-20 top-1/2 -translate-y-1/2 rounded-full",
        "border-primary/25 bg-muted cursor-pointer",
        "left-1 sm:left-2",
        className
      )}
      aria-label="Previous Carousel Item"
      {...props}
    >
      <IconChevronLeft className="size-5" />
    </Button>
  )
}

const ArchCarouselNext = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { scrollNext } = useArchCarousel()

  return (
    <Button
      variant="outline"
      size="icon-lg"
      onClick={scrollNext}
      className={cn(
        "absolute z-20 top-1/2 -translate-y-1/2 rounded-full",
        "border-primary/25 bg-muted cursor-pointer",
        "right-1 sm:right-2",
        className
      )}
      aria-label="Next Carousel Item"
      {...props}
    >
      <IconChevronRight className="size-5" />
    </Button>
  )
}

const ArchCarouselIndicator = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { totalItems, currentIndex, scrollTo } = useArchCarousel()

  return (
    <div
      className={cn("flex justify-center items-center gap-1.5 sm:gap-2 mt-4", className)}
      {...props}
    >
      {Array.from({ length: totalItems }, (_, index) => {
        const isActive = index === currentIndex

        return (
          <Button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all p-0 bg-primary",
              isActive ? "w-7" : "w-2 bg-primary/25"
            )}
            aria-label={`Go to carousel item ${index + 1}`}
          />
        )
      })}
    </div>
  )
}

export {
  ArchCarousel,
  ArchCarouselContent,
  ArchCarouselItem,
  ArchCarouselPrevious,
  ArchCarouselNext,
  ArchCarouselIndicator,
  useArchCarousel,
}

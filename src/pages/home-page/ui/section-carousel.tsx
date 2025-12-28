"use client"

import Link from "next/link"

import {
  IconChevronRight,
} from "@tabler/icons-react"
import {
  motion,
} from "framer-motion"

import { cn } from "@/shared/lib/utils/tailwindcss"
import { Badge } from "@/shared/ui/shadcn/badge"
import {
  ArchCarousel,
  ArchCarouselContent,
  ArchCarouselItem,
  ArchCarouselPrevious,
  ArchCarouselNext,
  ArchCarouselIndicator,
} from "@/shared/ui/arch-carousel/arch-carousel"

import { type Section } from "../model/section"
import { sections } from "../config/sections"

export const SectionCarousel = () => {
  return (
    <ArchCarousel loop autoplay>
      <ArchCarouselContent>
        {sections.map((item, index) => (
          <ArchCarouselItem key={item.id} index={index}>
            {({ isCenter }) => {
              if (item.published) {
                return (
                  <Link href={item.href}>
                    <CarouselCard item={item} isCenter={isCenter} />
                  </Link>
                )
              }

              return (
                <CarouselCard item={item} isCenter={isCenter} />
              )
            }}
          </ArchCarouselItem>
        ))}
      </ArchCarouselContent>
      <ArchCarouselPrevious />
      <ArchCarouselNext />
      <ArchCarouselIndicator />
    </ArchCarousel>
  )
}

interface CarouselCardProps {
  item: Section
  isCenter: boolean
}

const CarouselCard = ({
  item,
  isCenter,
}: CarouselCardProps) => {
  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-lg border p-3 sm:p-4 md:p-5",
        "backdrop-blur-sm transition-all duration-300",
        "w-[160px] h-[200px] sm:w-[180px] sm:h-[230px] md:w-[200px] md:h-[260px]",
        item.published
          ? "border-primary bg-muted cursor-pointer"
          : "border-primary/75 bg-muted/75 opacity-50 cursor-not-allowed",
        isCenter && item.published && "bg-linear-to-br from-primary/25 to-transparent"
      )}
      whileHover={item.published ? { scale: 1.05 } : undefined}
    >
      <div className="relative z-10 flex flex-col justify-center h-full gap-2 sm:gap-3 md:gap-4">
        <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-2.5">
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
            <div className={cn("size-2.5 rounded-full", item.published ? "bg-primary" : "bg-primary/50")} />
            <h3 className="text-sm font-medium">
              {item.title}
            </h3>
          </div>
          {!item.published && (
            <Badge variant="secondary">
              Coming Soon
            </Badge>
          )}
          <p className="text-muted-foreground text-xs/relaxed">
            {item.description}
          </p>
        </div>
        {item.published && (
          <div className="flex items-center gap-1 sm:gap-1.5 mt-auto">
            <span className="text-primary text-xs/relaxed">
              Explore
            </span>
            <IconChevronRight className="size-3.5 text-primary" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

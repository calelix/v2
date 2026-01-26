import { Skeleton } from "@/shared/ui/shadcn/skeleton"

export const MomentsGallerySkeleton = () => {
  return (
    <>
      <div className="relative">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin">
          <div className="flex w-max space-x-4 pb-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton className="w-80 h-60 bg-muted/50" />
                <Skeleton className="w-24 h-3 bg-muted/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 mt-4 text-muted-foreground">
        <span className="text-xs">
          <Skeleton className="w-24 h-3 bg-muted/50" />
        </span>
      </div>
    </>
  )
}

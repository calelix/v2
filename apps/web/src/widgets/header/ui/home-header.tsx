import { IconMenu2 } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"

import { ModeToggle } from "@/shared/ui"

export const HomeHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-primary">
            —
          </span>
          <span className="capitalize text-lg font-light tracking-widest">
            Calelix
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="size-9 md:hidden">
            <IconMenu2 className="size-5" />
          </Button>
          <ModeToggle />
        </div>
      </div>

      <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
    </header>
  )
}

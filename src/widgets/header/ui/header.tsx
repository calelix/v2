import Link from "next/link"

import { IconBrandGithub } from "@tabler/icons-react"

import { cn } from "@/shared/lib/utils/tailwindcss"
import { Button } from "@/shared/ui/shadcn/button"
import { ModeToggle } from "@/shared/ui/mode-toggle/mode-toggle"
import { BrandLogo } from "@/shared/ui/logo/brand-logo"
import { navigations } from "../config/navigations"
import { informations } from "../config/informations"

type HeaderProps = React.ComponentProps<"header">

export const Header = ({
  className,
  ...props
}: HeaderProps) => {
  return (
    <header className={cn("flex items-center w-full", className)} {...props}>
      <div className="container flex items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            id="header-logo"
            aria-label="Go to home page"
          >
            <BrandLogo className="w-5 text-primary pointer-events-none" />
          </Link>
          <nav className="flex items-center justify-between">
            {navigations.map((item) => (
              <Button key={item.href} variant="ghost" size="lg" asChild>
                <Link href={item.href}>
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex items-center ml-auto">
          <Button variant="ghost" size="lg" asChild>
            <Link
              href={informations.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandGithub />
              <span className="sr-only">Calelix Github</span>
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

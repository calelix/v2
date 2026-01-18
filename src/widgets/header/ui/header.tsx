import Link from "next/link"

import { IconBrandGithub } from "@tabler/icons-react"

import { cn } from "@/shared/lib/utils/tailwindcss"
import { buttonVariants } from "@/shared/ui/shadcn/button"
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
              <Link
                key={item.href}
                href={item.href}
                className={buttonVariants({ variant: "ghost", size: "lg" })}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center ml-auto">
          <Link
            href={informations.github}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost", size: "lg" })}
          >
            <IconBrandGithub />
            <span className="sr-only">
              Calelix Github
            </span>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

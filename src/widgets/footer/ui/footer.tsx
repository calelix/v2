import { cn } from "@/shared/lib/utils/tailwindcss"

type FooterProps = React.ComponentProps<"footer">

export const Footer = ({
  className,
  ...props
}: FooterProps) => {
  return (
    <footer className={cn("flex items-center w-full max-w-2xl mx-auto", className)} {...props}>
      <p className="text-xs/relaxed text-muted-foreground">
        &copy; {new Date().getFullYear()} JGPARK
      </p>
    </footer>
  )
}

import { cn } from "@/shared/lib/utils/tailwindcss"

type FooterProps = React.ComponentProps<"footer">

export const Footer = ({
  className,
  ...props
}: FooterProps) => {
  return (
    <footer className={cn("flex items-center w-full", className)} {...props}>
      <div className="container flex items-center">
        <p className="text-xs/loose text-body">
          &copy; {new Date().getFullYear()} JGPARK
        </p>
      </div>
    </footer>
  )
}

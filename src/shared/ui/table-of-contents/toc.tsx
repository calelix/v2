import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/shared/lib/utils/tailwindcss"

interface TableOfContentsProps extends React.ComponentProps<"nav"> {
  asChild?: boolean
}

const TableOfContents = ({
  asChild = false,
  className,
  children,
  ...props
}: TableOfContentsProps) => {
  const Comp = asChild ? Slot : "nav"

  return (
    <Comp className={cn(className)} {...props}>
      {children}
    </Comp>
  )
}

interface TableOfContentsListProps extends React.ComponentProps<"ol"> {
  asChild?: boolean
  indent?: boolean
}

const TableOfContentsList = ({
  asChild = false,
  indent,
  className,
  ...props
}: TableOfContentsListProps) => {
  const Comp = asChild ? Slot : "ol"

  return (
    <Comp className={cn("list-none", indent && "pl-4", className)} {...props} />
  )
}

interface TableOfContentsTitleProps extends React.ComponentProps<"p"> {
  asChild?: boolean
}

const TableOfContentsTitle = ({
  asChild = false,
  className,
  ...props
}: TableOfContentsTitleProps) => {
  const Comp = asChild ? Slot : "p"

  return (
    <Comp className={cn("font-medium text-foreground", className)} {...props} />
  )
}

interface TableOfContentsItemProps extends React.ComponentProps<"li"> {
  asChild?: boolean
  indent?: boolean
}

const TableOfContentsItem = ({
  asChild = false,
  indent,
  className,
  ...props
}: TableOfContentsItemProps) => {
  const Comp = asChild ? Slot : "li"

  return (
    <Comp className={cn("pt-2", indent && "ml-4", className)} {...props} />
  )
}

interface TableOfContentsLinkProps extends React.ComponentProps<"a"> {
  asChild?: boolean
  isActive?: boolean
}

const TableOfContentsLink = ({
  asChild = false,
  isActive,
  className,
  ...props
}: TableOfContentsLinkProps) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp className={cn(isActive && "text-foreground", className)} {...props} />
  )
}

export {
  TableOfContents,
  TableOfContentsList,
  TableOfContentsTitle,
  TableOfContentsItem,
  TableOfContentsLink,
}

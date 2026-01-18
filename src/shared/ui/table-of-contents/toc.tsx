import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/shared/lib/utils/tailwindcss"

type TableOfContentsProps = React.ComponentPropsWithRef<"nav">

const TableOfContents = ({
  className,
  children,
  ...props
}: TableOfContentsProps) => {
  return (
    <aside>
      <nav className={cn(className)} {...props}>
        {children}
      </nav>
    </aside>
  )
}

interface TableOfContentsListProps extends React.ComponentPropsWithRef<"ul"> {
  indent?: boolean
}

const TableOfContentsList = ({
  indent,
  className,
  ...props
}: TableOfContentsListProps) => {
  return (
    <ul className={cn("list-none", indent && "pl-4", className)} {...props} />
  )
}

interface TableOfContentsTitleProps extends React.ComponentPropsWithRef<"p"> {
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

interface TableOfContentsItemProps extends React.ComponentPropsWithRef<"li"> {
  indent?: boolean
}

const TableOfContentsItem = ({
  indent,
  className,
  ...props
}: TableOfContentsItemProps) => {
  return (
    <li className={cn("pt-2", indent && "ml-4", className)} {...props} />
  )
}

interface TableOfContentsLinkProps extends React.ComponentPropsWithRef<"a"> {
  isActive?: boolean
}

const TableOfContentsLink = ({
  isActive,
  className,
  ...props
}: TableOfContentsLinkProps) => {
  return (
    <a className={cn(isActive && "text-foreground", className)} {...props} />
  )
}

export {
  TableOfContents,
  TableOfContentsList,
  TableOfContentsTitle,
  TableOfContentsItem,
  TableOfContentsLink,
}

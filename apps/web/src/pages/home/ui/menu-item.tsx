interface MenuItemProps {
  item: {
    id: string
    title: string
    subtitle: string
    description: string
    icon?: string
  }
}

export const MenuItem = ({
  item,
}: MenuItemProps) => {
  return (
    <div className="group relative p-4 cursor-pointer transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-px bg-border dark:bg-muted transition-all duration-500 group-hover:bg-muted-foreground dark:group-hover:bg-accent" />

      <div className="absolute left-0 top-0 bottom-0 w-px bg-border dark:bg-muted opacity-40 transition-all duration-500 group-hover:bg-muted-foreground dark:group-hover:bg-accent dark:group-hover:opacity-100" />

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-light text-muted-foreground transition-colors duration-300 group-hover:text-primary">
            {item.icon}
          </span>
          <h3 className="text-base font-light tracking-wide text-foreground transition-colors duration-300 group-hover:text-primary">
            {item.title}
          </h3>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-muted-foreground font-light tracking-wide italic">
          {item.subtitle}
        </p>

        {/* Description */}
        <div className="max-h-24 sm:max-h-0 sm:opacity-0 overflow-hidden transition-all duration-300 sm:group-hover:max-h-24 sm:group-hover:opacity-100">
          <p className="text-xs text-muted-foreground font-light leading-relaxed pt-2">
            {item.description}
          </p>
        </div>

        <div className="w-0 opacity-0 transition-all duration-300 origin-left group-hover:w-full dark:group-hover:opacity-100">
          <div className="h-px bg-border dark:bg-accent" />
        </div>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-px bg-border dark:bg-muted opacity-20 transition-all duration-500 group-hover:bg-muted-foreground dark:group-hover:bg-accent dark:group-hover:opacity-100" />

      <div className="absolute bottom-0 left-0 right-0 h-px bg-border dark:bg-muted opacity-20 transition-all duration-500 group-hover:bg-muted-foreground dark:group-hover:bg-accent dark:group-hover:opacity-100" />
    </div>
  )
}

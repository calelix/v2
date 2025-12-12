export const HomeFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="pb-24">
      <div className="space-y-4 mb-12">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-20" />
      </div>

      {/* HomeFooter Contents */}

      <div className="pt-8 border-t border-border dark:border-muted">
        <p className="text-xs text-muted-foreground font-light text-center">
          Copyright {currentYear}. © {process.env.NEXT_PUBLIC_AUTHOR}
        </p>
      </div>
    </footer>
  )
}

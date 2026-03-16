import "@/app/styles/globals.css"

export default function Layout({
  children,
}: LayoutProps<"/">) {
  return (
    <>
      <div className="blur" aria-hidden="true" />
      <div className="pt-(--page-spacing) pb-6">
        {children}
      </div>
    </>
  )
}

import "@/app/styles/globals.css"
import { Banner } from "@/widgets/banner"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Banner>
        <p className="text-sm">
          블로그 이전 중입니다.
        </p>
      </Banner>
      <div className="blur" aria-hidden="true" />
      <div className="pt-(--page-spacing)">
        {children}
      </div>
    </>
  )
}

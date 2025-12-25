"use client"

import { Fragment } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/shadcn/breadcrumb"

export const AppBreadcrumb = () => {
  const pathname = usePathname()

  if (!pathname) {
    return null
  }

  const paths = pathname.split("/").filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`
          const isCurrentPage = index === paths.length - 1

          return (
            <Fragment key={path}>
              <BreadcrumbItem>
                {isCurrentPage ? (
                  <BreadcrumbPage className="capitalize">
                    {path}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="capitalize">
                      {path}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isCurrentPage && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

import {
  IconArticleOff,
  IconArrowLeft,
} from "@tabler/icons-react"
import Link from "next/link"

import { Button } from "@/shared/ui/shadcn/button"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/shared/ui/shadcn/empty"

interface EmptyPostProps {
  backUrl: string
}

export const EmptyPost = ({
  backUrl = "/",
}: EmptyPostProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconArticleOff />
        </EmptyMedia>
        <EmptyTitle>No Posts Yet</EmptyTitle>
        <EmptyDescription>
          There are no published posts in this category yet.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline" asChild>
          <Link href={backUrl}>
            <IconArrowLeft className="size-4" />
            Go Back
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

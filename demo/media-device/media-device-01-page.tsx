"use client"

import {
  type MediaSupportState,
  useMediaSupport,
} from "@/packages/hooks/media-devices"

import { cn } from "@/shared/lib/classnames/cn"

export function MediaDevice01Page() {
  const support = useMediaSupport()

  return (
    <div className={cn("flex flex-col gap-2 p-4 text-sm")}>
      <MediaSupportStatus support={support} />
    </div>
  )
}

interface MediaSupportStatusProps {
  support: MediaSupportState
}


function MediaSupportStatus({
  support,
}: MediaSupportStatusProps) {
  if (support.isPending) {
    return (
      <span className="text-muted-foreground">
        브라우저에서 미디어 API 지원 여부를 확인하는 중입니다.
      </span>
    )
  }

  if (support.isSuccess) {
    return (
      <span className="text-primary">
        권한·미디어 장치·장치 목록 API를 모두 지원합니다. 환경 검사를 통과했습니다.
      </span>
    )
  }

  return (
    <span className="text-destructive">
      {support.error}
    </span>
  )
}

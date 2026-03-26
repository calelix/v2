"use client"

import { } from "@tabler/icons-react"

import {
  type MediaPermissionState,
  type MediaSupportState,
  useMediaPermission,
  useMediaSupport,
} from "@/packages/hooks/media-devices"

import { cn } from "@/shared/lib/classnames/cn"
import { Button } from "@/shared/ui/shadcn/button"

export function MediaDevice01Page() {
  const support = useMediaSupport()
  const {
    state: permission,
    refresh: onRefreshPermission,
  } = useMediaPermission()

  return (
    <div className={cn("flex flex-col gap-6 p-4 text-sm")}>
      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          1. 환경 검사 (useMediaSupport)
        </h2>
        <MediaSupportStatus support={support} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          2. 권한 상태 (useMediaPermission)
        </h2>
        <MediaPermissionStatus
          permission={permission}
          onRefreshPermission={onRefreshPermission}
        />
      </section>
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

interface MediaPermissionStatusProps {
  permission: MediaPermissionState
  onRefreshPermission: () => void
}

function MediaPermissionStatus({
  permission,
  onRefreshPermission,
}: MediaPermissionStatusProps) {
  if (permission.isPending) {
    return (
      <span className="text-muted-foreground">
        카메라·마이크 권한 상태를 조회하는 중입니다.
      </span>
    )
  }

  if (permission.isError) {
    return (
      <span className="text-destructive">
        {permission.error}
      </span>
    )
  }

  const {
    permissions,
    isQuerySupported,
  } = permission

  return (
    <div className="flex flex-col gap-3">
      {!isQuerySupported && (
        <p className="text-muted-foreground">
          이 브라우저에서는 Permissions API로 camera/microphone 상태를 조회할 수 없습니다. 값은
          unknown으로 표시됩니다.
        </p>
      )}
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="text-muted-foreground">카메라</dt>
        <dd className="font-mono text-xs">{permissions.video}</dd>
        <dt className="text-muted-foreground">마이크</dt>
        <dd className="font-mono text-xs">{permissions.audio}</dd>
      </dl>
      {isQuerySupported && (
        <Button type="button" variant="outline" size="sm" className="w-fit" onClick={onRefreshPermission}>
          권한 상태 다시 조회
        </Button>
      )}
    </div>
  )
}

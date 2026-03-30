"use client"

import * as React from "react"

import {
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
  IconHourglassEmpty,
  IconLoader2,
} from "@tabler/icons-react"

import {
  type MediaAccessDeviceResult,
  type MediaAccessErrorCause,
  type MediaAccessPrecheck,
  type MediaAccessRequestState,
  type MediaDeviceListState,
  type MediaPermissionState,
  type MediaPermissionStatus,
  type MediaSupportState,
  evaluateMediaAccessPrecheck,
  useMediaAccessRequest,
  useMediaDeviceList,
  useMediaPermission,
  useMediaSupport,
} from "@/packages/hooks/media-devices"

import { cn } from "@/shared/lib/classnames/cn"
import { Button } from "@/shared/ui/shadcn/button"

const iconBox = "mt-0.5 size-5 shrink-0"
const transitionClasses = "transition-all duration-300 ease-in-out"

const MEDIA_SUPPORT_DESCRIPTION =
  "브라우저에 Permissions, MediaDevices, enumerateDevices가 있는지 확인합니다. " +
  "하나라도 없으면 권한·장치 목록 단계를 진행할 수 없습니다."

const PERMISSION_QUERY_DESCRIPTION =
  "Permissions API로 카메라·마이크 권한 상태를 읽습니다. " +
  "브라우저가 camera/microphone 쿼리를 지원하지 않으면 unknown으로 돌아올 수 있습니다."

const CAMERA_PERMISSION_DESCRIPTION =
  "카메라(비디오 입력)에 대한 현재 권한입니다. " +
  "granted는 허용, denied는 차단, prompt는 아직 요청 전, unknown은 조회 불가를 뜻합니다."

const MIC_PERMISSION_DESCRIPTION =
  "마이크(오디오 입력)에 대한 현재 권한입니다. " +
  "값의 의미는 카메라와 같습니다."

const ACCESS_REQUEST_DESCRIPTION =
  "navigator.mediaDevices.getUserMedia로 브라우저·OS 프롬프트를 띄워 접근을 허가받습니다. " +
  "단계 2에서 해당 종류가 denied이면 호출하지 않고 설정 안내로 보낼 수 있습니다. " +
  "성공 후 트랙을 즉시 stop()하면 프리뷰 없이 권한만 연 상태로 끝낼 수 있습니다."

const DEVICE_LIST_DESCRIPTION =
  "navigator.mediaDevices.enumerateDevices()로 연결된 카메라·마이크를 나열합니다. " +
  "권한 부여 전에는 레이블이 비어 있는 경우가 많으므로 단계 3 이후에 다시 열거하는 패턴이 일반적입니다. " +
  "devicechange 이벤트를 구독하여 USB 연결·해제 시 자동으로 목록을 갱신합니다."

type PipelineBadge = "waiting" | "active" | "done" | "failed" | "blocked"

export function MediaDevice01Page() {
  const support = useMediaSupport()
  const {
    state: permission,
    refresh: onRefreshPermission,
  } = useMediaPermission()

  const {
    state: deviceList,
    refresh: onRefreshDeviceList,
  } = useMediaDeviceList()

  const {
    state: accessState,
    request: requestAccess,
    reset: resetAccess,
  } = useMediaAccessRequest({
    stopTracksImmediately: true,
    onSettled: () => {
      onRefreshPermission()
      onRefreshDeviceList()
    },
  })

  const envBadge = envPipelineBadge(support)
  const envBlocked = support.isError

  const permQueryBadge = permissionQueryPipelineBadge(support, permission, envBlocked)
  const deviceBadge = devicePipelineBadge(support, permission, envBlocked)

  const permissions = permission.isSuccess ? permission.permissions : null
  const isQuerySupported = permission.isSuccess ? permission.isQuerySupported : false

  const videoPre = evaluateMediaAccessPrecheck(permissions, { video: true, audio: false })
  const audioPre = evaluateMediaAccessPrecheck(permissions, { video: false, audio: true })
  const allBlocked = !videoPre.ok && !audioPre.ok
  const accessBadge = accessRequestPipelineBadge(
    support,
    permission,
    accessState,
    envBlocked,
    allBlocked,
  )
  const deviceListBadge = deviceListPipelineBadge(support, permission, deviceList, envBlocked)
  const canRequest = !envBlocked && !permission.isPending && !permission.isError && !accessState.isPending
  const step3Ready = !envBlocked && permission.isSuccess
  const step4Ready = !envBlocked && deviceList.isSuccess

  return (
    <div className={cn("flex flex-col gap-6 p-4 text-sm")}>
      {/* ── 단계 1: 환경 검사 ── */}
      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          1. 환경 검사 (useMediaSupport)
        </h2>
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          <li>
            <PipelineStepCard
              title="환경 검사"
              badge={envBadge}
              staticBody={MEDIA_SUPPORT_DESCRIPTION}
              errorDetail={support.isError ? (support.error ?? undefined) : undefined}
            />
          </li>
        </ol>
      </section>

      {/* ── 단계 2: 권한 조회 ── */}
      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          2. 권한 상태 (useMediaPermission)
        </h2>
        <ol className="m-0 flex list-none flex-col gap-3 p-0" aria-live="polite">
          <li>
            <PipelineStepCard
              title="권한 상태 조회"
              badge={permQueryBadge}
              staticBody={PERMISSION_QUERY_DESCRIPTION}
              errorDetail={
                permission.isError ? (permission.error ?? undefined) : undefined
              }
            />
          </li>
          <li>
            <PipelineDeviceStepCard
              title="카메라"
              badge={deviceBadge}
              staticBody={CAMERA_PERMISSION_DESCRIPTION}
              status={permissions?.video ?? null}
            />
          </li>
          <li>
            <PipelineDeviceStepCard
              title="마이크"
              badge={deviceBadge}
              staticBody={MIC_PERMISSION_DESCRIPTION}
              status={permissions?.audio ?? null}
            />
          </li>
        </ol>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("w-fit", transitionClasses)}
          disabled={!permission.isSuccess || !isQuerySupported}
          onClick={onRefreshPermission}
        >
          권한 상태 다시 조회
        </Button>
      </section>

      {/* ── 단계 3: 권한 요청 ── */}
      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          3. 권한 요청 (useMediaAccessRequest)
        </h2>
        <ol className="m-0 flex list-none flex-col gap-3 p-0" aria-live="polite">
          <li>
            <PipelineStepCard
              title="getUserMedia로 접근 요청"
              badge={accessBadge}
              staticBody={ACCESS_REQUEST_DESCRIPTION}
              errorDetail={accessState.isError ? accessState.error : undefined}
            />
          </li>
        </ol>

        <div
          className={cn(
            "flex flex-col gap-3 rounded-md border border-border/70 bg-muted/25 px-3 py-2.5",
            transitionClasses,
            !step3Ready && "opacity-50",
          )}
        >
          <p className="text-muted-foreground text-xs leading-snug">
            장치별로 개별 요청합니다. 성공 시 권한 조회를 다시 돌려 단계 2와 맞춥니다.
          </p>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              disabled={!canRequest || !videoPre.ok}
              onClick={() => requestAccess({ video: true, audio: false })}
            >
              카메라 접근 요청
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!canRequest || !audioPre.ok}
              onClick={() => requestAccess({ video: false, audio: true })}
            >
              마이크 접근 요청
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={accessState.status === "idle" || accessState.isPending}
              onClick={() => resetAccess()}
            >
              초기화
            </Button>
          </div>

          {/* precheck 힌트 — 항상 렌더, 내용만 전환 */}
          <AccessPrecheckHint label="카메라" precheck={videoPre} ready={step3Ready} />
          <AccessPrecheckHint label="마이크" precheck={audioPre} ready={step3Ready} />

          {/* device 결과 — 항상 렌더, 상태만 전환 */}
          <div className="space-y-2">
            <DeviceResultRow
              kind="카메라"
              result={accessState.video}
              pending={accessState.status === "pending" && accessState.constraints.video}
            />
            <DeviceResultRow
              kind="마이크"
              result={accessState.audio}
              pending={accessState.status === "pending" && accessState.constraints.audio}
            />
          </div>
        </div>
      </section>

      {/* ── 단계 4: 장치 목록 ── */}
      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          4. 장치 목록 (useMediaDeviceList)
        </h2>
        <ol className="m-0 flex list-none flex-col gap-3 p-0" aria-live="polite">
          <li>
            <PipelineStepCard
              title="장치 열거"
              badge={deviceListBadge}
              staticBody={DEVICE_LIST_DESCRIPTION}
              errorDetail={deviceList.isError ? deviceList.error : undefined}
            />
          </li>
        </ol>

        <div
          className={cn(
            "flex flex-col gap-3 rounded-md border border-border/70 bg-muted/25 px-3 py-2.5",
            transitionClasses,
            !step4Ready && "opacity-50",
          )}
        >
          <p className="text-muted-foreground text-xs leading-snug">
            enumerateDevices로 연결된 장치를 나열합니다.
            권한 획득 전에는 레이블이 비어 있을 수 있습니다.
          </p>

          <DeviceListGroup
            label="카메라"
            kind="videoinput"
            devices={deviceList.isSuccess ? deviceList.devices.video : []}
            ready={step4Ready}
          />
          <DeviceListGroup
            label="마이크"
            kind="audioinput"
            devices={deviceList.isSuccess ? deviceList.devices.audio : []}
            ready={step4Ready}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("w-fit", transitionClasses)}
          disabled={!deviceList.isSuccess}
          onClick={onRefreshDeviceList}
        >
          장치 목록 다시 조회
        </Button>
      </section>
    </div>
  )
}

function envPipelineBadge(support: MediaSupportState): PipelineBadge {
  if (support.isPending) {
    return "active"
  }
  if (support.isSuccess) {
    return "done"
  }
  return "failed"
}

function permissionQueryPipelineBadge(
  support: MediaSupportState,
  permission: MediaPermissionState,
  envFailed: boolean,
): PipelineBadge {
  if (envFailed) {
    return "blocked"
  }
  if (support.isPending) {
    return "waiting"
  }
  if (permission.isPending) {
    return "active"
  }
  if (permission.isError) {
    return "failed"
  }
  return "done"
}

function accessRequestPipelineBadge(
  support: MediaSupportState,
  permission: MediaPermissionState,
  access: MediaAccessRequestState,
  envFailed: boolean,
  allBlocked: boolean,
): PipelineBadge {
  if (envFailed || permission.isError) {
    return "blocked"
  }
  if (support.isPending || permission.isPending) {
    return "waiting"
  }
  if (allBlocked) {
    return "blocked"
  }
  if (access.status === "pending") {
    return "active"
  }
  if (access.status === "error") {
    return "failed"
  }
  if (access.status === "success") {
    return "done"
  }
  return "waiting"
}

function deviceListPipelineBadge(
  support: MediaSupportState,
  permission: MediaPermissionState,
  deviceListState: MediaDeviceListState,
  envFailed: boolean,
): PipelineBadge {
  if (envFailed || permission.isError) {
    return "blocked"
  }
  if (support.isPending || permission.isPending) {
    return "waiting"
  }
  if (deviceListState.isPending) {
    return "active"
  }
  if (deviceListState.isError) {
    return "failed"
  }
  return "done"
}

function devicePipelineBadge(
  support: MediaSupportState,
  permission: MediaPermissionState,
  envFailed: boolean,
): PipelineBadge {
  if (envFailed || permission.isError) {
    return "blocked"
  }
  if (support.isPending) {
    return "waiting"
  }
  if (permission.isPending) {
    return "waiting"
  }
  return "done"
}

function AccessPrecheckHint({
  label,
  precheck,
  ready,
}: {
  label: string
  precheck: MediaAccessPrecheck
  ready: boolean
}) {
  const message = precheck.ok
    ? `${label} — 요청 가능`
    : `${label}: ${accessPrecheckMessage(precheck)}`

  return (
    <p
      className={cn(
        "text-xs leading-snug",
        transitionClasses,
        precheck.ok
          ? "text-muted-foreground"
          : ready
            ? "text-amber-800 dark:text-amber-200/90"
            : "text-muted-foreground",
      )}
    >
      {message}
    </p>
  )
}

function accessPrecheckMessage(precheck: MediaAccessPrecheck): string {
  if (precheck.ok) {
    return "요청 가능"
  }

  if (precheck.denied.length > 0) {
    return "권한이 조회상 거부(denied)입니다. 브라우저 설정에서 허용한 뒤 권한을 다시 조회하세요."
  }

  if (precheck.reason.includes("not ready")) {
    return "권한 조회가 끝난 뒤에만 이 단계로 진행할 수 있습니다."
  }

  return precheck.reason
}

function DeviceResultRow({
  kind,
  result,
  pending,
}: {
  kind: string
  result: MediaAccessDeviceResult | null
  pending: boolean
}) {
  if (pending) {
    return (
      <p className={cn("text-xs leading-snug text-muted-foreground", transitionClasses)}>
        <span className="font-medium">{kind}</span>
        <span> — </span>
        <span>요청 중…</span>
      </p>
    )
  }

  if (result === null) {
    return (
      <p className={cn("text-xs leading-snug text-muted-foreground", transitionClasses)}>
        <span className="font-medium">{kind}</span>
        <span> — </span>
        <span>아직 요청되지 않음</span>
      </p>
    )
  }

  if (result.status === "success") {
    return (
      <p className={cn("text-xs leading-snug text-foreground", transitionClasses)}>
        <span className="font-medium">{kind}</span>
        <span className="text-muted-foreground"> — </span>
        <span className="text-green-700 dark:text-green-400">접근 허용됨</span>
      </p>
    )
  }

  return (
    <div className={cn("space-y-0.5", transitionClasses)}>
      <p className="text-xs leading-snug text-foreground">
        <span className="font-medium">{kind}</span>
        <span className="text-muted-foreground"> — </span>
        <span className="text-destructive">실패</span>
        {result.name !== null && result.name !== "" && (
          <span className="text-muted-foreground font-mono"> ({result.name})</span>
        )}
      </p>
      <p className="pl-2 text-xs leading-snug">
        <span className="font-mono text-foreground/90">{result.cause}</span>
        <span className="text-muted-foreground"> — </span>
        <span>{causeLabel(result.cause, kind)}</span>
      </p>
    </div>
  )
}

function causeLabel(cause: MediaAccessErrorCause, kind: string): string {
  switch (cause) {
    case "browser-denied":
      return `${kind} 접근이 거부되었습니다. 브라우저 사이트 설정에서 권한을 허용해 주세요.`
    case "os-blocked":
      return `시스템(OS) 설정에서 브라우저의 ${kind} 접근이 차단되어 있습니다. OS 설정에서 브라우저에 액세스 권한을 부여하세요.`
    case "device":
      return `${kind} 장치를 찾을 수 없거나, 다른 앱에서 사용 중입니다.`
    case "unknown":
      return `${kind} 접근에 실패했습니다. 브라우저 및 시스템 설정을 확인해 주세요.`
  }
}

interface PipelineStepCardProps {
  title: string
  badge: PipelineBadge
  staticBody: string
  errorDetail?: string
}

function PipelineStepCard({
  title,
  badge,
  staticBody,
  errorDetail,
}: PipelineStepCardProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-md border border-border/70 bg-muted/25 px-3 py-2.5",
        transitionClasses,
        badge === "waiting" && "opacity-60",
      )}
    >
      {pipelineBadgeIcon(badge)}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <PipelineBadgeLabel badge={badge} />
          <p className="font-medium leading-tight">{title}</p>
        </div>
        <p className="text-muted-foreground leading-snug">{staticBody}</p>
        <p
          className={cn(
            "border-border/60 border-t pt-2 text-xs leading-snug",
            transitionClasses,
            errorDetail !== undefined && errorDetail !== ""
              ? "text-destructive"
              : "text-muted-foreground/60",
          )}
        >
          {errorDetail !== undefined && errorDetail !== ""
            ? errorDetail
            : "오류 없음"}
        </p>
      </div>
    </div>
  )
}

interface PipelineDeviceStepCardProps {
  title: string
  badge: PipelineBadge
  staticBody: string
  status: MediaPermissionStatus | null
}

function PipelineDeviceStepCard({
  title,
  badge,
  staticBody,
  status,
}: PipelineDeviceStepCardProps) {
  const presentation = status !== null ? permissionPresentation(status) : null
  const resolved = badge === "done" && presentation !== null && status !== null

  return (
    <div
      className={cn(
        "flex gap-3 rounded-md border border-border/70 bg-muted/25 px-3 py-2.5",
        transitionClasses,
        badge === "waiting" && "opacity-60",
      )}
    >
      {pipelineBadgeIcon(badge)}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <PipelineBadgeLabel badge={badge} />
          <p className="font-medium leading-tight">{title}</p>
        </div>
        <p className="text-muted-foreground leading-snug">{staticBody}</p>
        <div className="border-border/60 border-t pt-2 text-xs leading-snug">
          <p
            className={cn(
              transitionClasses,
              resolved ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <span className="font-medium">결과</span>
            <span className="text-muted-foreground"> : </span>
            {resolved ? (
              <>
                <span className="font-mono text-foreground/90">{status}</span>
                <span className="text-muted-foreground"> — </span>
                <span>
                  {presentation.label}. {presentation.detail}
                </span>
              </>
            ) : badge === "blocked" ? (
              <span>환경 검사 실패 또는 권한 조회 실패로 이 장치 값은 채울 수 없습니다.</span>
            ) : (
              <span>조회 대기 중</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

function pipelineBadgeIcon(badge: PipelineBadge): React.ReactNode {
  switch (badge) {
    case "waiting":
      return <IconHourglassEmpty className={cn(iconBox, "text-muted-foreground")} aria-hidden />
    case "active":
      return <IconLoader2 className={cn(iconBox, "animate-spin text-muted-foreground")} aria-hidden />
    case "done":
      return <IconCircleCheck className={cn(iconBox, "text-green-600 dark:text-green-500")} aria-hidden />
    case "failed":
      return <IconCircleX className={cn(iconBox, "text-destructive")} aria-hidden />
    case "blocked":
      return <IconAlertCircle className={cn(iconBox, "text-muted-foreground")} aria-hidden />
  }
}

function PipelineBadgeLabel({
  badge,
}: {
  badge: PipelineBadge
}) {
  const config = {
    waiting: {
      label: "대기",
      className: "bg-muted text-muted-foreground",
    },
    active: {
      label: "진행 중",
      className: "bg-muted text-foreground",
    },
    done: {
      label: "완료",
      className: "bg-green-600/15 text-green-800 dark:bg-green-500/15 dark:text-green-400",
    },
    failed: {
      label: "실패",
      className: "bg-destructive/10 text-destructive",
    },
    blocked: {
      label: "보류",
      className: "bg-muted text-muted-foreground",
    },
  }[badge]

  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        transitionClasses,
        config.className,
      )}
    >
      {config.label}
    </span>
  )
}

function permissionPresentation(status: MediaPermissionStatus): {
  label: string
  detail: string
} {
  switch (status) {
    case "granted":
      return {
        label: "허용됨",
        detail: "이 장치에 대한 접근이 허용된 상태입니다.",
      }
    case "denied":
      return {
        label: "거부됨",
        detail: "사용자 또는 브라우저 설정에 의해 접근이 막혀 있습니다.",
      }
    case "prompt":
      return {
        label: "아직 묻지 않음",
        detail: "getUserMedia 등으로 요청할 때 브라우저가 허용 여부를 묻습니다.",
      }
    case "unknown":
      return {
        label: "알 수 없음",
        detail: "쿼리를 지원하지 않거나 조회에 실패한 경우 이 값이 됩니다.",
      }
  }
}

function DeviceListGroup({
  label,
  kind,
  devices,
  ready,
}: {
  label: string
  kind: string
  devices: readonly MediaDeviceInfo[]
  ready: boolean
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-foreground">
        {label}
        <span className="font-normal text-muted-foreground"> ({devices.length})</span>
      </p>
      {ready && devices.length === 0 && (
        <p className="pl-2 text-xs text-muted-foreground">
          연결된 {label} 장치 없음
        </p>
      )}
      {devices.map((device, i) => (
        <DeviceInfoRow key={device.deviceId || `${kind}-${i}`} device={device} />
      ))}
    </div>
  )
}

function DeviceInfoRow({ device }: { device: MediaDeviceInfo }) {
  const hasLabel = device.label !== ""

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 rounded border border-border/50 bg-background/50 px-2.5 py-1.5",
        transitionClasses,
      )}
    >
      <p className="text-xs leading-snug">
        <span
          className={cn(
            "font-medium",
            hasLabel ? "text-foreground" : "italic text-muted-foreground",
          )}
        >
          {hasLabel ? device.label : "(레이블 없음 — 권한 획득 후 갱신)"}
        </span>
      </p>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        <p className="truncate font-mono text-[11px] leading-snug text-muted-foreground">
          id: {device.deviceId || "—"}
        </p>
        {device.groupId !== "" && (
          <p className="truncate font-mono text-[11px] leading-snug text-muted-foreground">
            group: {device.groupId}
          </p>
        )}
      </div>
    </div>
  )
}

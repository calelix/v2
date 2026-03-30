"use client"

import * as React from "react"

import { ResultAsync } from "neverthrow"

/**
 * 개별 미디어 장치 유형의 권한 상태.
 *
 * - `"granted"` — 사용자가 접근을 허용함
 * - `"denied"` — 사용자가 접근을 차단함
 * - `"prompt"` — 아직 권한을 요청하지 않음
 * - `"unknown"` — 쿼리가 지원되지 않거나 실패함
 */
export type MediaPermissionStatus = "granted" | "denied" | "prompt" | "unknown"

const validPermissionStatuses: ReadonlySet<string> = new Set<MediaPermissionStatus>([
  "granted",
  "denied",
  "prompt",
  "unknown",
])

/** 권한 조회가 완료되기 전의 대기 상태. */
export interface MediaPermissionStatePending {
  status: "pending"
  isPending: true
  isSuccess: false
  isError: false
  error: null
  permissions: null
  isQuerySupported: null
}

/** 권한이 성공적으로 조회된 상태. */
export interface MediaPermissionStateSuccess {
  status: "success"
  isPending: false
  isSuccess: true
  isError: false
  error: null
  permissions: { video: MediaPermissionStatus; audio: MediaPermissionStatus }
  isQuerySupported: boolean
}

/** 권한 조회가 실패한 오류 상태. */
export interface MediaPermissionStateError {
  status: "error"
  isPending: false
  isSuccess: false
  isError: true
  error: string
  permissions: null
  isQuerySupported: null
}

/** 미디어 권한 조회의 전체 비동기 상태 유니온. */
export type MediaPermissionState =
  | MediaPermissionStatePending
  | MediaPermissionStateSuccess
  | MediaPermissionStateError

/**
 * {@link useMediaPermission}의 반환값.
 *
 * @see {@link useMediaPermission}
 */
export interface UseMediaPermissionResult {
  /** 현재 권한 조회의 비동기 상태. */
  state: MediaPermissionState
  /** 수동으로 권한을 다시 조회한다. */
  refresh: () => void
}

interface MediaPermissionInternal {
  phase: "pending" | "resolved"
  isQuerySupported: boolean | null
  video: MediaPermissionStatus
  audio: MediaPermissionStatus
  error: string | null
}

/**
 * 카메라와 마이크의 권한 상태를 조회한다.
 *
 * Permissions API를 사용하여 비디오·오디오 장치의 현재
 * 권한 상태를 확인한다. 브라우저가 `permissions.query`를
 * 지원하면 `PermissionStatus.onchange`를 구독하여 사용자가
 * 권한을 허용하거나 철회할 때 자동으로 상태를 갱신한다.
 *
 * `refresh`를 호출하면 수동으로 권한을 다시 조회한다.
 *
 * @returns `{ state, refresh }` — `state`는
 *   `permissions.video`와 `permissions.audio`를 포함하는
 *   비동기 상태 객체이고, `refresh`는 재조회를 트리거한다
 *
 * @example
 * ```tsx
 * const { state, refresh } = useMediaPermission()
 *
 * if (state.isPending) return <Spinner />
 * if (state.isError) return <Alert>{state.error}</Alert>
 *
 * return (
 *   <div>
 *     <p>Camera: {state.permissions.video}</p>
 *     <p>Mic: {state.permissions.audio}</p>
 *     <button onClick={refresh}>Refresh</button>
 *   </div>
 * )
 * ```
 *
 * @see {@link useMediaSupport} 브라우저 API 지원 여부를 먼저 확인
 */
export function useMediaPermission(): UseMediaPermissionResult {
  const [internal, setInternal] = React.useState<MediaPermissionInternal>({
    phase: "pending",
    isQuerySupported: null,
    video: "unknown",
    audio: "unknown",
    error: null,
  })

  const [queryKey, setQueryKey] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    const permissionStatuses: globalThis.PermissionStatus[] = []

    const cleanupListeners = () => {
      for (const status of permissionStatuses) {
        status.onchange = null
      }
      permissionStatuses.length = 0
    }

    if (typeof navigator === "undefined" || !navigator.permissions) {
      setInternal({
        phase: "resolved",
        isQuerySupported: null,
        video: "unknown",
        audio: "unknown",
        error: "Browser does not support the Permissions API.",
      })
    } else {
      const queryDevice = (name: "camera" | "microphone") =>
        ResultAsync.fromPromise(
          navigator.permissions.query({ name }),
          () => new Error(`${name} query not supported`),
        )

      Promise.all([
        queryDevice("camera"),
        queryDevice("microphone"),
      ]).then(([videoResult, audioResult]) => {
        if (cancelled) {
          return
        }

        const isVideoOk = videoResult.isOk()
        const isAudioOk = audioResult.isOk()

        setInternal({
          phase: "resolved",
          isQuerySupported: isVideoOk && isAudioOk,
          video: isVideoOk ? toMediaPermissionStatus(videoResult.value.state) : "unknown",
          audio: isAudioOk ? toMediaPermissionStatus(audioResult.value.state) : "unknown",
          error: null,
        })

        if (isVideoOk) {
          permissionStatuses.push(videoResult.value)
        }

        if (isAudioOk) {
          permissionStatuses.push(audioResult.value)
        }

        for (const status of permissionStatuses) {
          status.onchange = () => {
            setQueryKey((c) => c + 1)
          }
        }
      }).catch(() => {
        if (cancelled) {
          return
        }

        setInternal({
          phase: "resolved",
          isQuerySupported: null,
          video: "unknown",
          audio: "unknown",
          error: "Unexpected error while querying permissions.",
        })
      })
    }

    return () => {
      cancelled = true
      cleanupListeners()
    }
  }, [queryKey])

  const refresh = React.useCallback(() => {
    setQueryKey((prev) => prev + 1)
  }, [])

  const state = React.useMemo(() => {
    return toMediaPermissionState(internal)
  }, [internal])

  return {
    state,
    refresh,
  }
}

function toMediaPermissionState(internal: MediaPermissionInternal): MediaPermissionState {
  if (internal.phase === "pending") {
    return {
      status: "pending",
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
      permissions: null,
      isQuerySupported: null,
    } satisfies MediaPermissionStatePending
  }

  if (internal.error != null) {
    return {
      status: "error",
      isPending: false,
      isSuccess: false,
      isError: true,
      error: internal.error,
      permissions: null,
      isQuerySupported: null,
    } satisfies MediaPermissionStateError
  }

  return {
    status: "success",
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    permissions: {
      video: internal.video,
      audio: internal.audio,
    },
    isQuerySupported: internal.isQuerySupported ?? false,
  } satisfies MediaPermissionStateSuccess
}

function toMediaPermissionStatus(state: string): MediaPermissionStatus {
  return validPermissionStatuses.has(state)
    ? (state as MediaPermissionStatus)
    : "unknown"
}

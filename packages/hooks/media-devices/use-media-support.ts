"use client"

import * as React from "react"

/** 아직 클라이언트 환경 검사가 완료되지 않은 대기 상태. */
export interface MediaSupportStatePending {
  status: "pending"
  isPending: true
  isSuccess: false
  isError: false
  error: null
}

/** 브라우저가 필요한 미디어 API를 모두 지원하는 성공 상태. */
export interface MediaSupportStateSuccess {
  status: "success"
  isPending: false
  isSuccess: true
  isError: false
  error: null
}

/** 하나 이상의 필수 API가 누락되었을 때의 오류 상태. */
export interface MediaSupportStateError {
  status: "error"
  isPending: false
  isSuccess: false
  isError: true
  error: string
}

/** 미디어 장치 지원 검사의 전체 비동기 상태 유니온. */
export type MediaSupportState =
  | MediaSupportStatePending
  | MediaSupportStateSuccess
  | MediaSupportStateError

/** `MediaSupportState`의 `status` 필드에 올 수 있는 리터럴 유니온. */
export type MediaSupportStatus = MediaSupportState["status"]

interface MediaSupportInternal {
  phase: "pending" | "resolved"
  error: string | null
}

/**
 * 현재 브라우저가 미디어 장치 API를 지원하는지 검사한다.
 *
 * 마운트 시점에 다음 API의 존재 여부를 확인한다:
 * `Permissions`, `MediaDevices`, `enumerateDevices`.
 *
 * 결과를 비동기 상태 객체로 반환하며,
 * SSR 환경에서는 `pending` 상태를 유지한다.
 *
 * @returns 현재 지원 검사의 비동기 상태 (`pending` | `success` | `error`)
 *
 * @example
 * ```tsx
 * const support = useMediaSupport()
 *
 * if (support.isPending) return <Spinner />
 * if (support.isError) return <Alert>{support.error}</Alert>
 *
 * return <MediaDeviceList />
 * ```
 *
 * @see {@link getMediaSupportError} 지원 여부 판별 로직
 */
export function useMediaSupport(): MediaSupportState {
  const [internal, setInternal] = React.useState<MediaSupportInternal>({
    phase: "pending",
    error: null,
  })

  // SSR에서는 실행되지 않으므로 pending을 유지하고, 클라이언트 마운트 시점에만 지원 여부를 판별한다.
  React.useEffect(() => {
    setInternal({
      phase: "resolved",
      error: getMediaSupportError(),
    })
  }, [])

  return toMediaSupportState(internal)
}

/**
 * 브라우저의 미디어 장치 관련 API 지원 여부를 검사한다.
 *
 * 다음 API를 순차적으로 확인하여 첫 번째로 누락된
 * API에 대한 오류 메시지를 반환한다:
 *
 * - `navigator.permissions` — 권한 조회
 * - `navigator.mediaDevices` — 장치 접근
 * - `enumerateDevices` — 장치 목록 열거
 *
 * @returns 지원하지 않는 API가 있으면 오류 메시지, 모두 지원하면 `null`
 */
export function getMediaSupportError(): string | null {
  if (typeof navigator === "undefined") {
    return "Cannot access media devices in a server environment."
  }

  const noPermissions = !navigator.permissions
  const noMediaDevices = !navigator.mediaDevices
  const noEnumerate = !navigator.mediaDevices?.enumerateDevices

  if (noPermissions) {
    return "Browser does not support the Permissions API."
  }

  if (noMediaDevices) {
    return "Browser does not support the MediaDevices API."
  }

  if (noEnumerate) {
    return "Browser does not support enumerateDevices."
  }

  return null
}

function toMediaSupportState(internal: MediaSupportInternal): MediaSupportState {
  if (internal.phase === "pending") {
    return {
      status: "pending",
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
    } satisfies MediaSupportStatePending
  }

  if (internal.error != null) {
    return {
      status: "error",
      isPending: false,
      isSuccess: false,
      isError: true,
      error: internal.error,
    } satisfies MediaSupportStateError
  }

  return {
    status: "success",
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
  } satisfies MediaSupportStateSuccess
}

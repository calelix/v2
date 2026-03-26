"use client"

import * as React from "react"

interface MediaSupportInternal {
  phase: "pending" | "resolved"
  error: string | null
}

export interface MediaSupportStatePending {
  status: "pending"
  isPending: true
  isSuccess: false
  isError: false
  error: null
}

export interface MediaSupportStateSuccess {
  status: "success"
  isPending: false
  isSuccess: true
  isError: false
  error: null
}

export interface MediaSupportStateError {
  status: "error"
  isPending: false
  isSuccess: false
  isError: true
  error: string
}

export type MediaSupportState =
  | MediaSupportStatePending
  | MediaSupportStateSuccess
  | MediaSupportStateError

export type MediaSupportStatus = MediaSupportState["status"]

export function useMediaSupport(): MediaSupportState {
  const [internal, setInternal] = React.useState<MediaSupportInternal>({
    phase: "pending",
    error: null,
  })

  React.useEffect(() => {
    setInternal({
      phase: "resolved",
      error: getMediaSupportError(),
    })
  }, [])

  return toMediaSupportState(internal)
}

export function getMediaSupportError(): string | null {
  if (typeof navigator === "undefined") {
    return "서버 환경에서 미디어 장치에 접근할 수 없습니다."
  }

  const noPermissions = !navigator.permissions
  const noMediaDevices = !navigator.mediaDevices
  const noEnumerate = !navigator.mediaDevices?.enumerateDevices

  if (noPermissions) {
    return "브라우저가 권한 API를 지원하지 않습니다."
  }

  if (noMediaDevices) {
    return "브라우저가 미디어 장치 API를 지원하지 않습니다."
  }

  if (noEnumerate) {
    return "브라우저가 미디어 장치 목록 조회를 지원하지 않습니다."
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
    }
  }

  if (internal.error != null) {
    return {
      status: "error",
      isPending: false,
      isSuccess: false,
      isError: true,
      error: internal.error,
    }
  }

  return {
    status: "success",
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
  }
}

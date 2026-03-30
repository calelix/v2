"use client"

import * as React from "react"

/** 장치 목록 열거가 완료되기 전의 대기 상태. */
export interface MediaDeviceListStatePending {
  status: "pending"
  isPending: true
  isSuccess: false
  isError: false
  error: null
  devices: null
}

/**
 * 장치 목록이 성공적으로 열거된 상태.
 *
 * `devices.video`와 `devices.audio`에는 각각
 * `videoinput`과 `audioinput` 장치 정보가 담긴다.
 */
export interface MediaDeviceListStateSuccess {
  status: "success"
  isPending: false
  isSuccess: true
  isError: false
  error: null
  devices: { video: MediaDeviceInfo[]; audio: MediaDeviceInfo[] }
}

/** 장치 목록 열거가 실패한 오류 상태. */
export interface MediaDeviceListStateError {
  status: "error"
  isPending: false
  isSuccess: false
  isError: true
  error: string
  devices: null
}

/** 미디어 장치 목록 열거의 전체 비동기 상태 유니온. */
export type MediaDeviceListState =
  | MediaDeviceListStatePending
  | MediaDeviceListStateSuccess
  | MediaDeviceListStateError

/** `MediaDeviceListState`의 `status` 필드에 올 수 있는 리터럴 유니온. */
export type MediaDeviceListStatus = MediaDeviceListState["status"]

/**
 * {@link useMediaDeviceList}의 반환값.
 *
 * @see {@link useMediaDeviceList}
 */
export interface UseMediaDeviceListResult {
  /** 현재 장치 목록 열거의 비동기 상태. */
  state: MediaDeviceListState
  /** 수동으로 장치 목록을 다시 열거한다. */
  refresh: () => void
}

interface MediaDeviceListInternal {
  phase: "pending" | "resolved"
  video: MediaDeviceInfo[]
  audio: MediaDeviceInfo[]
  error: string | null
}

/**
 * 연결된 카메라와 마이크 장치 목록을 열거한다.
 *
 * `navigator.mediaDevices.enumerateDevices()`를 호출하여
 * `videoinput`과 `audioinput` 장치를 분류한 뒤 비동기 상태
 * 객체로 반환한다. `devicechange` 이벤트를 구독하여 USB
 * 장치가 연결·분리될 때 자동으로 목록을 갱신한다.
 *
 * 권한이 부여되기 전에는 장치 레이블이 빈 문자열일 수 있다.
 * `refresh`를 호출하면 수동으로 다시 열거하므로, 권한 획득
 * 직후 레이블을 갱신하는 데 활용할 수 있다.
 *
 * @returns `{ state, refresh }` — `state`는 `devices.video`와
 *   `devices.audio`를 포함하는 비동기 상태 객체이고,
 *   `refresh`는 재열거를 트리거한다
 *
 * @example
 * ```tsx
 * const { state, refresh } = useMediaDeviceList()
 *
 * if (state.isPending) return <Spinner />
 * if (state.isError) return <Alert>{state.error}</Alert>
 *
 * return (
 *   <div>
 *     <span>Cameras</span>
 *     <ul>
 *       {state.devices.video.map((d) => (
 *         <li key={d.deviceId}>{d.label || d.deviceId}</li>
 *       ))}
 *     </ul>
 *     <span>Microphones</span>
 *     <ul>
 *       {state.devices.audio.map((d) => (
 *         <li key={d.deviceId}>{d.label || d.deviceId}</li>
 *       ))}
 *     </ul>
 *     <button onClick={refresh}>Refresh</button>
 *   </div>
 * )
 * ```
 *
 * @see {@link useMediaPermission} 카메라·마이크 권한 상태 조회
 * @see {@link useMediaSupport} 브라우저 API 지원 여부를 먼저 확인
 */
export function useMediaDeviceList(): UseMediaDeviceListResult {
  const [internal, setInternal] = React.useState<MediaDeviceListInternal>({
    phase: "pending",
    video: [],
    audio: [],
    error: null,
  })

  const [queryKey, setQueryKey] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.enumerateDevices
    ) {
      setInternal({
        phase: "resolved",
        video: [],
        audio: [],
        error: "Browser does not support enumerateDevices.",
      })
      return
    }

    const enumerate = () => {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          if (cancelled) {
            return
          }

          setInternal({
            phase: "resolved",
            video: devices.filter((d) => d.kind === "videoinput"),
            audio: devices.filter((d) => d.kind === "audioinput"),
            error: null,
          })
        })
        .catch((err: unknown) => {
          if (cancelled) {
            return
          }

          const message =
            err instanceof Error
              ? err.message
              : "Failed to enumerate media devices."

          setInternal({
            phase: "resolved",
            video: [],
            audio: [],
            error: message,
          })
        })
    }

    enumerate()

    const handleDeviceChange = () => {
      enumerate()
    }

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange)

    return () => {
      cancelled = true
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange,
      )
    }
  }, [queryKey])

  const refresh = React.useCallback(() => {
    setQueryKey((prev) => prev + 1)
  }, [])

  const state = React.useMemo(() => {
    return toMediaDeviceListState(internal)
  }, [internal])

  return {
    state,
    refresh,
  }
}

function toMediaDeviceListState(
  internal: MediaDeviceListInternal,
): MediaDeviceListState {
  if (internal.phase === "pending") {
    return {
      status: "pending",
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
      devices: null,
    } satisfies MediaDeviceListStatePending
  }

  if (internal.error != null) {
    return {
      status: "error",
      isPending: false,
      isSuccess: false,
      isError: true,
      error: internal.error,
      devices: null,
    } satisfies MediaDeviceListStateError
  }

  return {
    status: "success",
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    devices: {
      video: internal.video,
      audio: internal.audio,
    },
  } satisfies MediaDeviceListStateSuccess
}

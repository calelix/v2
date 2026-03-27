"use client"

import * as React from "react"

/**
 * 개별 미디어 장치 유형의 권한 상태.
 *
 * - `"granted"` — 사용자가 접근을 허용함
 * - `"denied"` — 사용자가 접근을 차단함
 * - `"prompt"` — 아직 권한을 요청하지 않음
 * - `"unknown"` — 쿼리가 지원되지 않거나 실패함
 */
export type MediaPermissionStatus = "granted" | "denied" | "prompt" | "unknown"

/**
 * `getUserMedia`에 넘길 비디오·오디오 요청 플래그.
 * 둘 다 `false`이면 호출할 수 없다.
 */
export interface MediaAccessConstraints {
  /** 비디오 입력을 요청할지 여부. */
  video: boolean
  /** 오디오 입력을 요청할지 여부. */
  audio: boolean
}

/**
 * 권한 조회 결과를 보고 `getUserMedia` 호출을 건너뛸지 판단할 때 쓰는 판정.
 * `denied`가 아닌 값(`prompt`, `granted`, `unknown`)은 진행 가능으로 본다.
 */
export type MediaAccessPrecheck =
  | {
    ok: true
  }
  | {
    ok: false
    /** UI에 그대로 노출 가능한 짧은 이유. */
    reason: string
    /** `permissions.query`상 거부로 판단된 종류. */
    denied: readonly ("video" | "audio")[]
  }

/**
 * `getUserMedia` 실패 원인의 소거법 판정 결과.
 *
 * - `"browser-denied"` — 실패 후 `permissions.query`가 `denied`로 바뀜. 브라우저/사이트 수준 거부.
 * - `"os-blocked"` — `permissions.query`는 여전히 `granted`인데 스트림을 못 얻음. OS 수준 차단.
 * - `"device"` — 장치를 찾을 수 없거나 하드웨어가 사용 중(`NotFoundError`, `NotReadableError`).
 * - `"unknown"` — 위 조건에 해당하지 않거나 재조회 자체가 실패한 경우.
 */
export type MediaAccessErrorCause =
  | "browser-denied"
  | "os-blocked"
  | "device"
  | "unknown"

/**
 * 단일 장치 유형(비디오 또는 오디오)에 대한 `getUserMedia` 결과.
 */
export type MediaAccessDeviceResult =
  | {
    status: "success"
    error: null
    name: null
    cause: null
  }
  | {
    status: "error"
    /** 에러 메시지. */
    error: string
    /** 브라우저가 넘긴 예외 이름(예: `NotAllowedError`), 없으면 `null`. */
    name: string | null
    /** 소거법으로 판정한 실패 원인. */
    cause: MediaAccessErrorCause
  }

/** 권한 요청 훅이 아직 호출되지 않았거나 `reset`된 상태. */
export interface MediaAccessRequestIdle {
  status: "idle"
  isIdle: true
  isPending: false
  isSuccess: false
  isError: false
  error: null
  /** 비디오 장치 결과. 요청하지 않았으면 `null`. */
  video: null
  /** 오디오 장치 결과. 요청하지 않았으면 `null`. */
  audio: null
}

/** `getUserMedia`가 진행 중인 상태. */
export interface MediaAccessRequestPending {
  status: "pending"
  isIdle: false
  isPending: true
  isSuccess: false
  isError: false
  error: null
  /** 이번 `request` 호출에서 요청 중인 비디오·오디오 여부. */
  constraints: MediaAccessConstraints
  /** 이전 호출에서 누적된 비디오 결과. 최초 요청이면 `null`. */
  video: MediaAccessDeviceResult | null
  /** 이전 호출에서 누적된 오디오 결과. 최초 요청이면 `null`. */
  audio: MediaAccessDeviceResult | null
}

/** 요청한 모든 장치가 성공한 상태. */
export interface MediaAccessRequestSuccess {
  status: "success"
  isIdle: false
  isPending: false
  isSuccess: true
  isError: false
  error: null
  /** 성공 직후 트랙을 모두 `stop()`했는지 여부. */
  tracksStopped: boolean
  /** 비디오 장치 결과. 요청하지 않았으면 `null`. */
  video: MediaAccessDeviceResult | null
  /** 오디오 장치 결과. 요청하지 않았으면 `null`. */
  audio: MediaAccessDeviceResult | null
}

/** 요청한 장치 중 하나 이상이 실패한 상태. */
export interface MediaAccessRequestError {
  status: "error"
  isIdle: false
  isPending: false
  isSuccess: false
  isError: true
  /** 전체 요약 에러 메시지. */
  error: string
  /** 비디오 장치 결과. 요청하지 않았으면 `null`. */
  video: MediaAccessDeviceResult | null
  /** 오디오 장치 결과. 요청하지 않았으면 `null`. */
  audio: MediaAccessDeviceResult | null
}

/**
 * `getUserMedia` 기반 권한 요청 한 번의 비동기 상태.
 */
export type MediaAccessRequestState =
  | MediaAccessRequestIdle
  | MediaAccessRequestPending
  | MediaAccessRequestSuccess
  | MediaAccessRequestError

/**
 * {@link useMediaAccessRequest}에 전달하는 옵션.
 */
export interface UseMediaAccessRequestOptions {
  /**
   * `request` 호출 시 기본으로 쓸 제약. `request` 인자로 부분 덮어쓰기 가능.
   *
   * @defaultValue `{ video: true, audio: true }`
   */
  defaultConstraints?: MediaAccessConstraints
  /**
   * 성공 직후 모든 트랙을 `stop()`해 프리뷰 없이 권한만 연 경우에 맞춘다.
   *
   * @defaultValue `true`
   */
  stopTracksImmediately?: boolean
  /**
   * `getUserMedia` 결과 처리(성공·실패 무관)가 끝난 뒤 호출된다.
   * 소비자 쪽에서 권한 조회를 다시 트리거하는 콜백을 넘길 수 있다.
   */
  onSettled?: () => void
}

/**
 * {@link useMediaAccessRequest}의 반환값.
 */
export interface UseMediaAccessRequestResult {
  /**
   * 마지막 `request`·`reset`에 따른 상태.
   *
   * `video`/`audio` 필드는 호출 간 누적된다. 카메라만 요청한 뒤 마이크만
   * 요청하면 두 결과가 모두 반영된다. `reset()`으로 초기화할 수 있다.
   * `status`는 누적 결과 전체를 반영하여, 어느 장치든 에러가 남아 있으면 `"error"`이다.
   */
  state: MediaAccessRequestState
  /**
   * `getUserMedia`로 실제 접근을 요청한다. 이미 `pending`이면 무시한다.
   *
   * 요청하지 않은 장치의 결과는 이전 호출의 값이 보존되어 누적된다.
   * 이전 장치 에러를 지우려면 해당 장치를 다시 요청하거나 `reset()`을 호출한다.
   *
   * @param constraints — `defaultConstraints`에 병합된다. 생략 시 기본만 사용.
   */
  request: (constraints?: Partial<MediaAccessConstraints>) => Promise<void>
  /** 성공·실패 상태와 누적된 장치 결과를 모두 지우고 `idle`로 돌린다. */
  reset: () => void
}

const idleState = {
  status: "idle",
  isIdle: true,
  isPending: false,
  isSuccess: false,
  isError: false,
  error: null,
  video: null,
  audio: null,
} satisfies MediaAccessRequestIdle

/**
 * Permissions API로 읽은 값이 `denied`인 종류는 `getUserMedia`를 호출하지 않도록 막는다.
 *
 * `permissions`가 아직 없으면(조회 전·실패) 진행하지 않는다. `unknown`·`prompt`·`granted`는
 * 막지 않는다.
 *
 * @param permissions — `{ video, audio }` 형태의 권한 상태 객체, 아직 없으면 `null`
 * @param constraints — 요청하려는 비디오·오디오 여부
 *
 * @returns `ok: false`이면 설정 안내 UI로 보내거나 버튼을 비활성화할 수 있다
 *
 * @example
 * ```tsx
 * const pre = evaluateMediaAccessPrecheck(permission.isSuccess ? permission.permissions : null, {
 *   video: true,
 *   audio: true,
 * })
 * if (!pre.ok) {
 *   return <p>{pre.reason}</p>
 * }
 * ```
 *
 */
export function evaluateMediaAccessPrecheck(
  permissions: { video: MediaPermissionStatus; audio: MediaPermissionStatus } | null,
  constraints: MediaAccessConstraints,
): MediaAccessPrecheck {
  if (!constraints.video && !constraints.audio) {
    return {
      ok: false,
      reason: "At least one of video or audio must be true to request media access.",
      denied: [],
    }
  }

  if (permissions === null) {
    return {
      ok: false,
      reason: "Permission state is not ready. Complete the permission query step first.",
      denied: [],
    }
  }

  const denied: ("video" | "audio")[] = []

  if (constraints.video && permissions.video === "denied") {
    denied.push("video")
  }

  if (constraints.audio && permissions.audio === "denied") {
    denied.push("audio")
  }

  if (denied.length > 0) {
    const deniedKinds = denied.join(" and ")
    return {
      ok: false,
      reason: `Permission query reports denied for: ${deniedKinds}. Open site settings instead of calling getUserMedia.`,
      denied,
    }
  }

  return { ok: true }
}

function mergeConstraints(
  base: MediaAccessConstraints,
  partial?: Partial<MediaAccessConstraints>,
): MediaAccessConstraints {
  if (partial === undefined) {
    return base
  }

  return {
    video: partial.video ?? base.video,
    audio: partial.audio ?? base.audio,
  }
}

async function requeryOnePermission(kind: "camera" | "microphone"): Promise<MediaPermissionStatus> {
  if (typeof navigator === "undefined" || !navigator.permissions) {
    return "unknown"
  }

  try {
    const result = await navigator.permissions.query({ name: kind as PermissionName })
    return toPermissionStatus(result.state)
  } catch {
    return "unknown"
  }
}

function toPermissionStatus(state: string): MediaPermissionStatus {
  if (state === "granted" || state === "denied" || state === "prompt") {
    return state
  }

  return "unknown"
}

/**
 * 단일 장치의 예외 이름과 재조회된 권한 상태로 소거법 판정을 수행한다.
 *
 * @param errorName — 예외 이름
 * @param requeried — `getUserMedia` 실패 직후 해당 장치의 `permissions.query` 결과
 */
function determineDeviceErrorCause(
  errorName: string | null,
  requeried: MediaPermissionStatus,
): MediaAccessErrorCause {
  if (errorName === "NotFoundError" || errorName === "DevicesNotFoundError") {
    return "device"
  }

  if (errorName === "NotReadableError" || errorName === "TrackStartError") {
    return "device"
  }

  if (requeried === "granted") {
    return "os-blocked"
  }

  if (requeried === "denied") {
    return "browser-denied"
  }

  return "unknown"
}

function normalizeGetUserMediaError(error: unknown): { message: string; name: string | null } {
  if (error instanceof DOMException) {
    const { name } = error
    if (name === "NotAllowedError") {
      return {
        message: "The user or browser denied media access (NotAllowedError). Check browser or OS settings.",
        name,
      }
    }

    if (name === "NotFoundError" || name === "DevicesNotFoundError") {
      return {
        message: "No media device was found for the requested kind (NotFoundError).",
        name,
      }
    }

    if (name === "NotReadableError" || name === "TrackStartError") {
      return {
        message: "The device could not be started; it may be in use by another app (NotReadableError).",
        name,
      }
    }

    return {
      message: error.message || "getUserMedia failed with a DOMException.",
      name,
    }
  }

  if (error instanceof Error) {
    return { message: error.message, name: null }
  }

  return {
    message: "Unknown error while requesting media access.",
    name: null,
  }
}

/**
 * 단일 장치에 대해 `getUserMedia`를 호출하고, 실패 시 소거법으로 원인을 판정한다.
 *
 * @param kind — `"video"` 또는 `"audio"`
 * @param stopTracks — 성공 시 트랙을 즉시 정지할지 여부
 */
async function requestSingleDevice(
  kind: "video" | "audio",
  stopTracks: boolean,
): Promise<MediaAccessDeviceResult> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(
      kind === "video" ? { video: true } : { audio: true },
    )

    if (stopTracks) {
      for (const track of stream.getTracks()) {
        track.stop()
      }
    }

    return {
      status: "success",
      error: null,
      name: null,
      cause: null,
    }
  } catch (caught) {
    const { message, name } = normalizeGetUserMediaError(caught)
    const permissionKind = kind === "video" ? "camera" as const : "microphone" as const
    const requeried = await requeryOnePermission(permissionKind)
    const cause = determineDeviceErrorCause(name, requeried)

    return {
      status: "error",
      error: message,
      name,
      cause,
    }
  }
}

/**
 * `getUserMedia`로 브라우저·OS에 미디어 접근을 실제로 요청한다.
 *
 * 비디오와 오디오를 **각각 별도의 `getUserMedia` 호출**로 요청하므로,
 * 장치별로 독립적인 성공·실패 판정과 소거법 원인 진단이 가능하다.
 *
 * 장치별 결과는 호출 간 **누적**된다. 카메라만 요청한 뒤 마이크만 요청하면
 * 양쪽 결과가 모두 `state`에 반영되며, 누적 결과 중 에러가 하나라도 있으면
 * `status`는 `"error"`가 된다. `reset()`을 호출하면 누적이 초기화된다.
 *
 * 마운트 시 자동 호출하지 않는다. `request`를 눌렀을 때만 프롬프트가 뜬다. 성공 후
 * `stopTracksImmediately`(기본 `true`)이면 트랙을 바로 끊어 프리뷰 없이 "권한만 연" 흐름에
 * 맞출 수 있다. `onSettled`로 권한 조회를 다시 읽어 UI를 맞출 수 있다.
 *
 * @param options — 기본 제약, 트랙 즉시 정지 여부, 성공 후 콜백
 *
 * @returns `{ state, request, reset }` — `state`는 `idle`에서 시작하고 `request` 결과로 바뀐다
 *
 * @example
 * ```tsx
 * const { state, request, reset } = useMediaAccessRequest()
 *
 * // 카메라만 요청
 * <button onClick={() => request({ video: true, audio: false })}>카메라 접근</button>
 *
 * // 마이크만 요청
 * <button onClick={() => request({ video: false, audio: true })}>마이크 접근</button>
 *
 * // 개별 결과 확인
 * {state.isError && state.video?.status === "error" && (
 *   <p>카메라: {state.video.cause}</p>
 * )}
 * ```
 */
export function useMediaAccessRequest(options: UseMediaAccessRequestOptions = {}): UseMediaAccessRequestResult {
  const {
    defaultConstraints = { video: true, audio: true },
    stopTracksImmediately = true,
    onSettled,
  } = options

  const defaultConstraintsRef = React.useRef(defaultConstraints)
  defaultConstraintsRef.current = defaultConstraints

  const stopTracksImmediatelyRef = React.useRef(stopTracksImmediately)
  stopTracksImmediatelyRef.current = stopTracksImmediately

  const onSettledRef = React.useRef(onSettled)
  onSettledRef.current = onSettled

  const [state, setState] = React.useState<MediaAccessRequestState>(idleState)
  const inFlightRef = React.useRef(false)
  const requestIdRef = React.useRef(0)

  const deviceResultsRef = React.useRef<{
    video: MediaAccessDeviceResult | null
    audio: MediaAccessDeviceResult | null
  }>({ video: null, audio: null })

  React.useEffect(() => {
    const ref = requestIdRef
    return () => {
      ref.current++
    }
  }, [])

  const request = React.useCallback(async (constraintsPartial?: Partial<MediaAccessConstraints>) => {
    if (inFlightRef.current) {
      return
    }

    const constraints = mergeConstraints(defaultConstraintsRef.current, constraintsPartial)

    if (!constraints.video && !constraints.audio) {
      deviceResultsRef.current = { video: null, audio: null }
      setState({
        status: "error",
        isIdle: false,
        isPending: false,
        isSuccess: false,
        isError: true,
        error: "At least one of video or audio must be true to request media access.",
        video: null,
        audio: null,
      } satisfies MediaAccessRequestError)
      return
    }

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      deviceResultsRef.current = { video: null, audio: null }
      setState({
        status: "error",
        isIdle: false,
        isPending: false,
        isSuccess: false,
        isError: true,
        error: "getUserMedia is not available in this environment.",
        video: null,
        audio: null,
      } satisfies MediaAccessRequestError)
      return
    }

    inFlightRef.current = true
    const currentRequestId = ++requestIdRef.current

    setState({
      status: "pending",
      isIdle: false,
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
      constraints,
      video: deviceResultsRef.current.video,
      audio: deviceResultsRef.current.audio,
    } satisfies MediaAccessRequestPending)

    try {
      const shouldStopTracks = stopTracksImmediatelyRef.current

      // 순차 실행: 브라우저가 권한 프롬프트를 한 번에 하나만 표시하므로,
      // 병렬 호출 시 두 번째 프롬프트가 무시되거나 예측 불가한 동작이 발생할 수 있다.
      const videoResult = constraints.video
        ? await requestSingleDevice("video", shouldStopTracks)
        : null

      if (requestIdRef.current !== currentRequestId) return

      const audioResult = constraints.audio
        ? await requestSingleDevice("audio", shouldStopTracks)
        : null

      if (requestIdRef.current !== currentRequestId) return

      if (videoResult !== null) {
        deviceResultsRef.current.video = videoResult
      }
      if (audioResult !== null) {
        deviceResultsRef.current.audio = audioResult
      }

      const mergedVideo = deviceResultsRef.current.video
      const mergedAudio = deviceResultsRef.current.audio

      const hasAccumulatedError =
        (mergedVideo !== null && mergedVideo.status === "error") ||
        (mergedAudio !== null && mergedAudio.status === "error")

      if (hasAccumulatedError) {
        const errorParts: string[] = []
        if (mergedVideo !== null && mergedVideo.status === "error") {
          errorParts.push(`Camera: ${mergedVideo.error}`)
        }
        if (mergedAudio !== null && mergedAudio.status === "error") {
          errorParts.push(`Microphone: ${mergedAudio.error}`)
        }

        setState({
          status: "error",
          isIdle: false,
          isPending: false,
          isSuccess: false,
          isError: true,
          error: errorParts.join(" / "),
          video: mergedVideo,
          audio: mergedAudio,
        } satisfies MediaAccessRequestError)
      } else {
        setState({
          status: "success",
          isIdle: false,
          isPending: false,
          isSuccess: true,
          isError: false,
          error: null,
          tracksStopped: shouldStopTracks,
          video: mergedVideo,
          audio: mergedAudio,
        } satisfies MediaAccessRequestSuccess)
      }

      onSettledRef.current?.()
    } finally {
      if (requestIdRef.current === currentRequestId) {
        inFlightRef.current = false
      }
    }
  }, [])

  const reset = React.useCallback(() => {
    requestIdRef.current++
    inFlightRef.current = false
    deviceResultsRef.current = { video: null, audio: null }
    setState(idleState)
  }, [])

  return {
    state,
    request,
    reset,
  }
}

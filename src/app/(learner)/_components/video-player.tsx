'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface VideoPlayerProps {
  url: string
  lastPosition: number
  lessonId: string
}

type YouTubePlayerInstance = {
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void
  getCurrentTime: () => number
  getDuration: () => number
  getPlayerState: () => number
  setPlaybackRate: (rate: number) => void
  getAvailablePlaybackRates: () => number[]
  setPlaybackQuality: (quality: string) => void
  getAvailableQualityLevels: () => string[]
  destroy?: () => void
}

type YouTubePlayerEvent = {
  target: YouTubePlayerInstance
}

type YouTubeConstructor = new (
  elementId: string,
  config: {
    videoId: string
    playerVars?: Record<string, string | number>
    events?: {
      onReady?: (event: YouTubePlayerEvent) => void
      onStateChange?: (event: YouTubePlayerEvent) => void
      onApiChange?: (event: YouTubePlayerEvent) => void
    }
  }
) => YouTubePlayerInstance

declare global {
  interface Window {
    YT?: {
      Player: YouTubeConstructor
      PlayerState: { PLAYING: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

const YOUTUBE_REGEX = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/

function extractYoutubeId(url: string): string | null {
  const trimmed = url.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
  return trimmed.match(YOUTUBE_REGEX)?.[1] ?? null
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function YouTubeCustomPlayer({ videoId, lastPosition }: { videoId: string; lastPosition: number }) {
  const containerId = useMemo(() => `yt-player-${videoId}`, [videoId])
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<YouTubePlayerInstance | null>(null)
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const metadataRetryRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasSeekedInitialRef = useRef(false)
  const isSeekingRef = useRef(false)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [quality, setQuality] = useState('auto')
  const [availableSpeeds, setAvailableSpeeds] = useState<number[]>([0.5, 1, 1.25, 1.5, 2])
  const [availableQualities, setAvailableQualities] = useState<string[]>(['auto'])
  const [isControlsVisible, setIsControlsVisible] = useState(true)

  const stopTimers = useCallback(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    if (metadataRetryRef.current) clearInterval(metadataRetryRef.current)
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    progressTimerRef.current = null
    metadataRetryRef.current = null
    controlsTimerRef.current = null
  }, [])

  const resetControlsAutoHide = useCallback(() => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    setIsControlsVisible(true)
    controlsTimerRef.current = setTimeout(() => {
      if (isSeekingRef.current) return
      setIsControlsVisible(false)
    }, 5000)
  }, [])

  const syncProgress = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    let nextCurrentTime = 0
    let nextDuration = 0
    let isNowPlaying = false
    let rates: number[] = []
    let qualities: string[] = []

    try {
      nextCurrentTime = player.getCurrentTime?.() || 0
      nextDuration = player.getDuration?.() || 0
      isNowPlaying = (player.getPlayerState?.() ?? -1) === window.YT?.PlayerState.PLAYING
      rates = player.getAvailablePlaybackRates?.() || []
      qualities = player.getAvailableQualityLevels?.() || []
    } catch {
      return
    }

    if (!isSeekingRef.current) {
      setCurrentTime(nextCurrentTime)
    }
    if (nextDuration > 0) setDuration(nextDuration)
    setIsPlaying(isNowPlaying)
    if (rates?.length) setAvailableSpeeds(rates)
    if (qualities?.length) {
      const normalizedQualities = Array.from(new Set(['auto', ...qualities.filter((q) => q !== 'auto')]))
      setAvailableQualities((prev) => (prev.join(',') === normalizedQualities.join(',') ? prev : normalizedQualities))
    }
  }, [])

  const startProgressTimer = useCallback(() => {
    stopTimers()
    progressTimerRef.current = setInterval(syncProgress, 500)
  }, [stopTimers, syncProgress])

  const initializePlayer = useCallback(() => {
    if (!window.YT?.Player) return
    stopTimers()
    playerRef.current?.destroy?.()
    playerRef.current = null
    hasSeekedInitialRef.current = false
    isSeekingRef.current = false

    playerRef.current = new window.YT.Player(containerId, {
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        rel: 0,
        playsinline: 1,
        disablekb: 1,
        iv_load_policy: 3,
        fs: 0,
        loop: 1,
        playlist: videoId
      },
      events: {
        onReady: (event) => {
          playerRef.current = event.target
          setIsReady(true)
          resetControlsAutoHide()
          if (!hasSeekedInitialRef.current && lastPosition > 0) {
            playerRef.current?.seekTo(lastPosition, true)
            hasSeekedInitialRef.current = true
          }
          syncProgress()
          startProgressTimer()

          // YouTube đôi khi trả duration=0 lúc vừa ready, retry ngắn để mở tua ngay.
          if (metadataRetryRef.current) clearInterval(metadataRetryRef.current)
          let retries = 0
          metadataRetryRef.current = setInterval(() => {
            retries += 1
            syncProgress()
            const d = playerRef.current?.getDuration() ?? 0
            if (d > 0 || retries > 20) {
              if (metadataRetryRef.current) clearInterval(metadataRetryRef.current)
            }
          }, 300)
        },
        onStateChange: (event) => {
          playerRef.current = event.target
          syncProgress()
        },
        onApiChange: (event) => {
          playerRef.current = event.target
          syncProgress()
        }
      }
    })
  }, [containerId, lastPosition, resetControlsAutoHide, startProgressTimer, stopTimers, syncProgress, videoId])

  useEffect(() => {
    if (window.YT?.Player) {
      initializePlayer()
      return () => {
        stopTimers()
        playerRef.current?.destroy?.()
        playerRef.current = null
      }
    }

    window.onYouTubeIframeAPIReady = initializePlayer
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    document.body.appendChild(script)

    return () => {
      stopTimers()
      playerRef.current?.destroy?.()
      playerRef.current = null
      window.onYouTubeIframeAPIReady = undefined
    }
  }, [initializePlayer, stopTimers])

  const togglePlay = () => {
    const player = playerRef.current
    if (!player) return
    if (isPlaying) player.pauseVideo()
    else player.playVideo()
    resetControlsAutoHide()
    syncProgress()
  }

  const onSeek = (value: number) => {
    const player = playerRef.current
    if (!player) return
    player.seekTo(value, true)
    setCurrentTime(value)
    resetControlsAutoHide()
  }

  const onChangeSpeed = (next: number) => {
    const player = playerRef.current
    if (!player) return
    player.setPlaybackRate(next)
    setSpeed(next)
    resetControlsAutoHide()
  }

  const onChangeQuality = (next: string) => {
    const player = playerRef.current
    if (!player) return
    if (next !== 'auto') player.setPlaybackQuality(next)
    setQuality(next)
    resetControlsAutoHide()
  }

  const toggleFullscreen = async () => {
    const el = wrapperRef.current
    if (!el) return
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    await el.requestFullscreen()
    resetControlsAutoHide()
  }

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 flex flex-col bg-black ${isControlsVisible ? 'cursor-default' : 'cursor-none'}`}
      onMouseMove={resetControlsAutoHide}
      onTouchStart={resetControlsAutoHide}
    >
      <div id={containerId} className='w-full h-full' />
      <div
        className={`absolute inset-x-0 bottom-0 bg-black/70 p-3 flex items-center gap-3 transition-opacity duration-300 ${
          isControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          type='button'
          onClick={togglePlay}
          disabled={!isReady}
          className='text-white text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-40'
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <span className='text-xs text-white/90 w-[84px] shrink-0'>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <input
          type='range'
          min={0}
          max={Math.max(duration, 0)}
          value={Math.min(currentTime, duration || 0)}
          onInput={(e) => onSeek(Number((e.target as HTMLInputElement).value))}
          onMouseDown={() => {
            isSeekingRef.current = true
            setIsControlsVisible(true)
            if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
          }}
          onMouseUp={() => {
            isSeekingRef.current = false
            resetControlsAutoHide()
            syncProgress()
          }}
          onTouchStart={() => {
            isSeekingRef.current = true
            setIsControlsVisible(true)
            if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
          }}
          onTouchEnd={() => {
            isSeekingRef.current = false
            resetControlsAutoHide()
            syncProgress()
          }}
          className='w-full'
          disabled={!isReady || duration <= 0}
        />
        <select
          value={speed}
          onChange={(e) => onChangeSpeed(Number(e.target.value))}
          className='bg-white/10 text-white text-xs rounded px-2 py-1'
          disabled={!isReady}
        >
          {availableSpeeds.map((rate) => (
            <option key={rate} value={rate} className='text-black'>
              {rate}x
            </option>
          ))}
        </select>
        <select
          value={quality}
          onChange={(e) => onChangeQuality(e.target.value)}
          className='bg-white/10 text-white text-xs rounded px-2 py-1'
          disabled={!isReady}
        >
          {availableQualities.map((q) => (
            <option key={q} value={q} className='text-black'>
              {q}
            </option>
          ))}
        </select>
        <button
          type='button'
          onClick={toggleFullscreen}
          className='text-white text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20'
        >
          Full
        </button>
      </div>
    </div>
  )
}

export function VideoPlayer({ url, lastPosition, lessonId }: VideoPlayerProps) {
  void lastPosition
  void lessonId
  const normalizedUrl = useMemo(() => url.trim(), [url])
  const isYoutube = useMemo(
    () => normalizedUrl.includes('youtube.com') || normalizedUrl.includes('youtu.be'),
    [normalizedUrl]
  )
  const isBunnyEmbed = useMemo(
    () =>
      normalizedUrl.includes('iframe.mediadelivery.net/embed/') ||
      normalizedUrl.includes('iframe.mediadelivery.net/play/') ||
      normalizedUrl.includes('mediadelivery.net/embed/') ||
      normalizedUrl.includes('mediadelivery.net/play/'),
    [normalizedUrl]
  )
  const youtubeVideoId = useMemo(() => extractYoutubeId(normalizedUrl), [normalizedUrl])

  return (
    <div className='relative aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border border-white/10'>
      {isYoutube && youtubeVideoId && (
        <YouTubeCustomPlayer key={youtubeVideoId} videoId={youtubeVideoId} lastPosition={lastPosition} />
      )}
      {isYoutube && !youtubeVideoId && (
        <iframe
          className='absolute top-0 left-0 w-full h-full'
          src={normalizedUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
          title='YouTube player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        />
      )}
      {!isYoutube && isBunnyEmbed && (
        <iframe
          className='absolute top-0 left-0 w-full h-full'
          src={normalizedUrl}
          title='Video player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        />
      )}
      {!isYoutube && !isBunnyEmbed && (
        <video controls playsInline className='w-full h-full object-contain' src={normalizedUrl} preload='metadata' />
      )}
    </div>
  )
}

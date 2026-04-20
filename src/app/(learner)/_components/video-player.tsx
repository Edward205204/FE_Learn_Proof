'use client'

import type React from 'react'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

type ReactPlayerInstance = {
  seekTo: (amount: number, type?: 'seconds' | 'fraction') => void
}

type VideoReactPlayerProps = {
  url: string
  width?: string | number
  height?: string | number
  controls?: boolean
  progressInterval?: number
  onReady?: () => void
  onProgress?: (state: { playedSeconds: number }) => void
  onEnded?: () => void
  config?: {
    youtube?: Record<string, unknown>
    file?: { attributes?: Record<string, string> }
  }
}

// `react-player` is CJS + loaded dynamically; keep typing local + minimal.
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false
}) as unknown as React.ComponentType<VideoReactPlayerProps & React.RefAttributes<ReactPlayerInstance>>

import { getVideoUrl } from '@/utils/course'

interface VideoPlayerProps {
  url: string
  lastPosition: number
  lessonId: string
  onEnded?: () => void
}

export function VideoPlayer({ url, lastPosition, lessonId, onEnded }: VideoPlayerProps) {
  void lessonId
  const formattedUrl = getVideoUrl(url)
  const playerRef = useRef<ReactPlayerInstance | null>(null)
  const hasJumpedRef = useRef(false)

  useEffect(() => {
    hasJumpedRef.current = false
  }, [formattedUrl])

  const handleReady = () => {
    if (!hasJumpedRef.current && lastPosition > 0 && playerRef.current) {
      playerRef.current.seekTo(lastPosition, 'seconds')
      hasJumpedRef.current = true
    }
  }

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    if (!hasJumpedRef.current && playedSeconds > 1 && lastPosition > 0 && playerRef.current) {
      playerRef.current.seekTo(lastPosition, 'seconds')
      hasJumpedRef.current = true
    }
  }

  return (
    <div className='relative aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border border-white/10'>
      <ReactPlayer
        key={formattedUrl}
        ref={playerRef}
        url={formattedUrl}
        width='100%'
        height='100%'
        controls
        onReady={handleReady}
        onProgress={handleProgress}
        onEnded={onEnded}
        progressInterval={5000}
        config={{
          youtube: { rel: 0 },
          file: { attributes: { controlsList: 'nodownload' } }
        }}
      />
    </div>
  )
}

'use client'

import type React from 'react'
import { useRef, useState, useEffect } from 'react'
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
  lastPosition: number // Tính bằng giây (s)
  lessonId: string
  onEnded?: () => void
}

export function VideoPlayer({ url, lastPosition, lessonId, onEnded }: VideoPlayerProps) {
  const formattedUrl = getVideoUrl(url)
  const playerRef = useRef<ReactPlayerInstance | null>(null)
  const [hasJumped, setHasJumped] = useState(false)

  // Dùng ref để heartbeat luôn đọc được giá trị mới nhất mà không reset interval
  const playedSecondsRef = useRef(0)
  // Lưu vị trí đã gửi lần cuối — tránh gửi heartbeat khi video đang pause
  const lastSentRef = useRef(0)

  // 1. Tự động nhảy đến vị trí cũ khi video sẵn sàng
  const handleReady = () => {
    if (!hasJumped && lastPosition > 0) {
      playerRef.current?.seekTo(lastPosition, 'seconds')
      setHasJumped(true)
    }
  }

  // 2. Cập nhật vị trí hiện tại (progressInterval = 5000ms để giảm overhead)
  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    playedSecondsRef.current = playedSeconds
  }

  // 3. Logic Heartbeat: Gửi dữ liệu về server mỗi 30 giây
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      const currentPos = Math.floor(playedSecondsRef.current)
      // Chỉ gửi khi video đang chạy (position thay đổi so với lần gửi trước)
      if (currentPos > 0 && currentPos !== lastSentRef.current) {
        lastSentRef.current = currentPos
        console.log(`[Heartbeat] Lesson: ${lessonId}, At: ${currentPos}s`)
        // Gọi hàm API của bạn ở đây:
        // saveProgress({ lessonId, position: currentPos })
      }
    }, 30000)

    return () => clearInterval(heartbeatInterval)
  }, [lessonId])

  const isYoutube = formattedUrl.includes('youtube.com') || formattedUrl.includes('youtu.be')

  if (isYoutube) {
    const embedUrl = formattedUrl
      .replace('watch?v=', 'embed/')
      .replace('youtu.be/', 'youtube.com/embed/')

    return (
      <div className='relative aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border border-white/10'>
        <iframe
          className='w-full h-full'
          src={embedUrl}
          title='YouTube video player'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        />
      </div>
    )
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

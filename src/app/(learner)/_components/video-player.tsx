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
  config?: {
    youtube?: Record<string, unknown>
    file?: { attributes?: Record<string, string> }
  }
}

// `react-player` is CJS + loaded dynamically; keep typing local + minimal.
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false
}) as unknown as React.ComponentType<VideoReactPlayerProps & React.RefAttributes<ReactPlayerInstance>>

interface VideoPlayerProps {
  url: string
  lastPosition: number // Tính bằng giây (s)
  lessonId: string
}

export function VideoPlayer({ url, lastPosition, lessonId }: VideoPlayerProps) {
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

  return (
    <div className='relative aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border border-white/10'>
      <ReactPlayer
        ref={playerRef}
        url={url}
        width='100%'
        height='100%'
        controls
        onReady={handleReady}
        onProgress={handleProgress}
        progressInterval={5000}
        config={{
          youtube: { rel: 0 },
          file: { attributes: { controlsList: 'nodownload' } }
        }}
      />
    </div>
  )
}

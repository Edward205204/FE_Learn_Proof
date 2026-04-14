'use client'

import { useMemo } from 'react'

interface VideoPlayerProps {
  url: string
  lastPosition: number // reserved for progress implementation
  lessonId: string // reserved for progress implementation
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
  const youtubeEmbedUrl = useMemo(
    () => normalizedUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/'),
    [normalizedUrl]
  )

  return (
    <div className='relative aspect-video bg-black rounded-2xl overflow-hidden shadow-xl border border-white/10'>
      {(isYoutube || isBunnyEmbed) && (
        <iframe
          className='absolute top-0 left-0 w-full h-full'
          src={isYoutube ? youtubeEmbedUrl : normalizedUrl}
          title='Video player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        />
      )}
      {!isYoutube && !isBunnyEmbed && (
        <video controls className='w-full h-full object-contain' src={normalizedUrl} preload='metadata' />
      )}
    </div>
  )
}

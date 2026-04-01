'use client'

import { useEffect, useRef } from 'react'

interface LazyVideoProps {
  src: string
  className?: string
}

export default function LazyVideo({ src, className }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    const card = el?.closest('a')
    if (!el || !card) return

    // Load metadata on intersection to show a thumbnail
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || el.src) return
        observer.disconnect()
        el.src = src
        el.preload = 'metadata'
        // Seek to first frame once metadata is ready so the thumbnail is visible
        el.addEventListener('loadedmetadata', () => { el.currentTime = 0.001 }, { once: true })
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)

    function play() {
      el!.play()
    }

    function pause() {
      el!.pause()
      el!.currentTime = 0.001
    }

    card.addEventListener('mouseenter', play)
    card.addEventListener('mouseleave', pause)

    return () => {
      observer.disconnect()
      card.removeEventListener('mouseenter', play)
      card.removeEventListener('mouseleave', pause)
    }
  }, [src])

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      className={className}
    />
  )
}

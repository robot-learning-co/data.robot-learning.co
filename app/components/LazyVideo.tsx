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
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !el.src) {
          el.src = src
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [src])

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      className={className}
    />
  )
}

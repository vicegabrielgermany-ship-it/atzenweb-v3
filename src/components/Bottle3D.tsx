import { useRef, useEffect } from 'react'
import { BottleScene } from '../lib/bottleScene'

export type BottleFinish = 'amber' | 'green' | 'clear'

export interface Bottle3DProps {
  labels?: {
    shoulder?: string
    body?: string
    back?: string
  }
  finish?: BottleFinish
  autoRotate?: boolean
  className?: string
}

const FINISH_INDEX: Record<BottleFinish, number> = {
  amber: 0,
  green: 1,
  clear: 2,
}

export default function Bottle3D({ labels, finish = 'amber', autoRotate = true, className = '' }: Bottle3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<BottleScene | null>(null)
  const labelsLoadedRef = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el || el.clientWidth === 0) return
    const scene = new BottleScene(el, {
      autoRotate,
      finishIndex: FINISH_INDEX[finish],
    })
    sceneRef.current = scene
    labelsLoadedRef.current = false
    return () => { scene.dispose(); sceneRef.current = null }
  }, [])

  useEffect(() => {
    sceneRef.current?.setAutoRotate(autoRotate)
  }, [autoRotate])

  useEffect(() => {
    sceneRef.current?.setFinish(FINISH_INDEX[finish])
  }, [finish])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene || !labels) return
    const timer = setTimeout(() => {
      if (sceneRef.current === scene) {
        Object.entries(labels).forEach(([id, url]) => {
          if (url) scene.loadLabelImage(id, url)
        })
        labelsLoadedRef.current = true
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [labels])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene || !labels) return
    labelsLoadedRef.current = false
    const timer = setTimeout(() => {
      if (sceneRef.current === scene) {
        Object.entries(labels).forEach(([id, url]) => {
          if (url) scene.loadLabelImage(id, url)
        })
        labelsLoadedRef.current = true
      }
    }, 50)
    return () => clearTimeout(timer)
  })

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ touchAction: 'none', cursor: 'grab', minWidth: 0, minHeight: 0 }}
      onMouseDown={() => { if (containerRef.current) containerRef.current.style.cursor = 'grabbing' }}
      onMouseUp={() => { if (containerRef.current) containerRef.current.style.cursor = 'grab' }}
      aria-label="Interactive 3D beer bottle"
      role="img"
    />
  )
}

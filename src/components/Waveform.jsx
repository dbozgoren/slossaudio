import { useRef, useEffect, useState } from 'react'

export default function Waveform() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const [frozen, setFrozen] = useState(false)
  const frozenRef = useRef(false)

  // Keep ref in sync with state for animation loop
  useEffect(() => {
    frozenRef.current = frozen
  }, [frozen])

  const handleClick = () => {
    setFrozen(true)
    setTimeout(() => setFrozen(false), 800)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let time = 0

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    function drawWave(yOffset, amplitude, frequency, speed, alpha, lineWidth) {
      const w = canvas.getBoundingClientRect().width
      const h = canvas.getBoundingClientRect().height

      ctx.beginPath()
      ctx.strokeStyle = `rgba(255, 107, 43, ${alpha})`
      ctx.lineWidth = lineWidth

      for (let x = 0; x <= w; x += 2) {
        const normalX = x / w
        const envelope = Math.sin(normalX * Math.PI)
        const y =
          yOffset * h +
          Math.sin(normalX * frequency + time * speed) * amplitude * envelope +
          Math.sin(normalX * frequency * 0.5 + time * speed * 1.3) * amplitude * 0.3 * envelope
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    function animate() {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      drawWave(0.5, 30, 8, 1.2, 0.06, 1)
      drawWave(0.5, 25, 6, 0.8, 0.08, 1)
      drawWave(0.5, 40, 4, 1.0, 0.12, 1.5)
      drawWave(0.5, 20, 12, 1.5, 0.15, 1)
      drawWave(0.5, 35, 5, 0.9, 0.4, 2)
      drawWave(0.5, 15, 10, 1.8, 0.2, 1)

      // Only advance time if not frozen
      if (!frozenRef.current) {
        time += 0.02
      }
      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="absolute inset-0 w-full h-full cursor-pointer"
      style={{ 
        opacity: 1,
        transition: 'filter 0.2s ease',
        filter: frozen ? 'brightness(1.3) saturate(1.5)' : 'none',
      }}
      title="Click to freeze"
    />
  )
}

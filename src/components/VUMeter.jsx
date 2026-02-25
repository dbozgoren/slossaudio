import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function VUMeter() {
  const [level, setLevel] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const lastScrollY = useRef(0)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const velocity = Math.abs(window.scrollY - lastScrollY.current)
      lastScrollY.current = window.scrollY
      
      // Map velocity to level (0-100)
      const newLevel = Math.min(100, velocity * 2)
      setLevel(newLevel)
      setIsRecording(true)

      // Decay
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setLevel(0)
        setIsRecording(false)
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const bars = 8
  const barLevels = Array.from({ length: bars }, (_, i) => {
    const threshold = (i / bars) * 100
    return level > threshold
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50 flex items-end gap-1 p-3 bg-bg/80 backdrop-blur-sm border border-border rounded-lg"
    >
      {/* REC indicator */}
      <div className="flex items-center gap-2 mr-3">
        <motion.div
          animate={{ 
            opacity: isRecording ? [1, 0.3, 1] : 0.3,
          }}
          transition={{ 
            duration: 0.5, 
            repeat: isRecording ? Infinity : 0,
          }}
          className="w-2 h-2 rounded-full bg-red-500"
          style={{
            boxShadow: isRecording ? '0 0 8px #ef4444' : 'none'
          }}
        />
        <span className="font-mono text-[10px] text-text-dim tracking-wider">
          {isRecording ? 'REC' : 'IDLE'}
        </span>
      </div>

      {/* VU Bars */}
      <div className="flex items-end gap-0.5 h-6">
        {barLevels.map((active, i) => {
          const isHot = i >= bars - 2
          return (
            <motion.div
              key={i}
              className="w-1 rounded-sm"
              animate={{
                height: active ? `${((i + 1) / bars) * 100}%` : '15%',
                backgroundColor: active 
                  ? isHot ? '#ef4444' : '#ff6b2b'
                  : '#333333',
              }}
              transition={{ duration: 0.05 }}
              style={{
                boxShadow: active && isHot ? '0 0 6px #ef4444' : 'none'
              }}
            />
          )
        })}
      </div>

      {/* dB label */}
      <span className="font-mono text-[9px] text-text-dim ml-1">
        dB
      </span>
    </motion.div>
  )
}

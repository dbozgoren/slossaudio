import { motion } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react'

// Audio context singleton
let audioCtx = null
const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

// Hidden synth that looks like a waveform graphic
function HiddenSynth() {
  const [isActive, setIsActive] = useState(false)
  const [freq, setFreq] = useState(220)
  const containerRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainRef = useRef(null)

  const startSound = useCallback(() => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()
    
    if (oscillatorRef.current) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sawtooth'
    osc.frequency.value = freq
    gain.gain.value = 0.15
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    
    oscillatorRef.current = osc
    gainRef.current = gain
    setIsActive(true)
  }, [freq])

  const stopSound = useCallback(() => {
    if (gainRef.current) {
      gainRef.current.gain.exponentialRampToValueAtTime(0.001, getAudioContext().currentTime + 0.1)
    }
    setTimeout(() => {
      if (oscillatorRef.current) {
        try { oscillatorRef.current.stop() } catch(e) {}
        oscillatorRef.current = null
        gainRef.current = null
      }
    }, 100)
    setIsActive(false)
  }, [])

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current || !isActive) return
    const rect = containerRef.current.getBoundingClientRect()
    const relativeX = (clientX - rect.left) / rect.width
    const clampedX = Math.max(0, Math.min(1, relativeX))
    const newFreq = 100 + clampedX * 600
    setFreq(newFreq)
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = newFreq
    }
  }, [isActive])

  // Draw a waveform that responds to frequency
  const points = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * 100
    const y = 50 + Math.sin((i / 39) * Math.PI * 4 + (freq / 100)) * 30
    return `${x},${y}`
  }).join(' ')

  return (
    <div 
      ref={containerRef}
      className={`mt-4 h-12 cursor-pointer transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
      onMouseDown={(e) => { startSound(); handleMove(e.clientX) }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={stopSound}
      onMouseLeave={stopSound}
      onTouchStart={(e) => { startSound(); handleMove(e.touches[0].clientX) }}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={stopSound}
      style={{ touchAction: 'none' }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={isActive ? 'text-accent' : 'text-text/40'}
        />
      </svg>
    </div>
  )
}

const services = [
  {
    title: 'Sound Design',
    description:
      'Crafting immersive audio landscapes for games, film, and interactive media. From subtle ambiences to explosive impacts.',
    icon: '~',
    hasEasterEgg: true,
  },
  {
    title: 'Field Recording',
    description:
      'Capturing real-world audio in the wild. Rain, machinery, footsteps, nature — authentic sounds that ground your project.',
    icon: '((·))',
  },
  {
    title: 'Soundtrack Design',
    description:
      'Composing and producing original music and sonic textures that elevate narrative and emotion.',
    icon: '|||',
  },
  {
    title: 'Audio Engineering',
    description:
      'Technical precision in mixing, mastering, and implementation. Clean signal paths from recording to final delivery.',
    icon: '0dB',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Services() {
  return (
    <section id="services" className="py-32 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-accent mb-4 uppercase">
            Services
          </p>
          <h2 className="text-3xl sm:text-4xl font-light mb-16">
            What I <span className="text-accent font-medium italic">do.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid sm:grid-cols-2 gap-4"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="group border border-border rounded-lg p-8 bg-bg hover:border-accent/40 transition-colors duration-300 cursor-default"
            >
              <div className="font-mono text-2xl text-accent mb-4 tracking-tight opacity-60 group-hover:opacity-100 transition-opacity">
                {service.icon}
              </div>
              <h3 className="font-mono text-sm font-bold tracking-wider mb-3 group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {service.description}
              </p>
              {/* Hidden synth easter egg in Sound Design card */}
              {service.hasEasterEgg && <HiddenSynth />}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

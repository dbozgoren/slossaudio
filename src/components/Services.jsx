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

// Hidden synth with play button and knob
function HiddenSynth() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [freq, setFreq] = useState(220)
  const [waveform, setWaveform] = useState('sawtooth')
  const knobRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const startSound = useCallback(() => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()
    
    if (oscillatorRef.current) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = waveform
    osc.frequency.value = freq
    gain.gain.value = 0.15
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    
    oscillatorRef.current = osc
    gainRef.current = gain
    setIsPlaying(true)
  }, [freq, waveform])

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
    setIsPlaying(false)
  }, [])

  const togglePlay = () => {
    if (isPlaying) stopSound()
    else startSound()
  }

  // Update frequency in real-time
  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = freq
    }
  }, [freq])

  // Handle waveform change
  useEffect(() => {
    if (isPlaying) {
      stopSound()
      setTimeout(startSound, 50)
    }
  }, [waveform])

  // Knob drag handling
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging || !knobRef.current) return
      const rect = knobRef.current.getBoundingClientRect()
      const centerY = rect.top + rect.height / 2
      const deltaY = centerY - e.clientY
      const newFreq = Math.max(80, Math.min(800, freq + deltaY * 3))
      setFreq(newFreq)
    }
    const handleMouseUp = () => setDragging(false)
    
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, freq])

  const rotation = ((freq - 80) / 720) * 270 - 135

  return (
    <div className="mt-4 pt-4 border-t border-border/30 opacity-50 hover:opacity-100 transition-opacity duration-300">
      <div className="flex items-center gap-3">
        {/* Play/Stop button */}
        <motion.button
          onClick={togglePlay}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-colors
            ${isPlaying ? 'bg-accent text-bg' : 'bg-text/20 text-text/60 hover:bg-text/30'}`}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? '■' : '▶'}
        </motion.button>

        {/* Frequency knob */}
        <div className="flex flex-col items-center">
          <div
            ref={knobRef}
            className={`w-8 h-8 rounded-full border-2 cursor-grab active:cursor-grabbing flex items-center justify-center
              ${dragging ? 'border-accent' : 'border-text/30 hover:border-text/50'}`}
            onMouseDown={() => setDragging(true)}
            style={{ touchAction: 'none' }}
          >
            <div 
              className="w-0.5 h-3 bg-accent rounded-full origin-bottom"
              style={{ transform: `rotate(${rotation}deg) translateY(-2px)` }}
            />
          </div>
          <span className="text-[9px] font-mono text-text/40 mt-1">{Math.round(freq)}Hz</span>
        </div>

        {/* Waveform selector */}
        <div className="flex gap-1">
          {[
            { type: 'sine', icon: '∿' },
            { type: 'sawtooth', icon: '⩘' },
            { type: 'square', icon: '⊓' },
          ].map(w => (
            <button
              key={w.type}
              onClick={() => setWaveform(w.type)}
              className={`w-6 h-6 text-xs rounded transition-colors
                ${waveform === w.type ? 'bg-accent/20 text-accent' : 'text-text/40 hover:text-text/60'}`}
            >
              {w.icon}
            </button>
          ))}
        </div>
      </div>
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

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Konami: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']

export default function EasterEggs() {
  const [konamiIndex, setKonamiIndex] = useState(0)
  const [showOscilloscope, setShowOscilloscope] = useState(false)

  // Console easter egg - runs once on mount
  useEffect(() => {
    const styles = [
      'color: #ff6b2b',
      'font-size: 12px',
      'font-family: monospace',
      'font-weight: bold',
    ].join(';')

    console.log(`
%c╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿   ║
║                                                              ║
║   brian@slossaudio:~$ echo "Need great sound?"               ║
║   > Let's talk: brian@slossaudio.com                         ║
║                                                              ║
║   ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `, styles)
  }, [])

  // Konami code listener
  const handleKeyDown = useCallback((e) => {
    if (e.code === KONAMI[konamiIndex]) {
      const nextIndex = konamiIndex + 1
      if (nextIndex === KONAMI.length) {
        // Konami complete!
        setKonamiIndex(0)
        triggerOscilloscope()
      } else {
        setKonamiIndex(nextIndex)
      }
    } else {
      setKonamiIndex(0)
    }
  }, [konamiIndex])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const triggerOscilloscope = () => {
    setShowOscilloscope(true)
    
    // Play a synth arpeggio using Web Audio API
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99] // C E G C E G
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.type = 'sine'
        osc.frequency.value = freq
        
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08)
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.08 + 0.02)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.08 + 0.3)
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.start(ctx.currentTime + i * 0.08)
        osc.stop(ctx.currentTime + i * 0.08 + 0.4)
      })
    } catch (e) {
      // Audio not supported, that's fine
    }

    setTimeout(() => setShowOscilloscope(false), 2000)
  }

  return (
    <AnimatePresence>
      {showOscilloscope && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.98) 100%)',
          }}
        >
          {/* Oscilloscope grid */}
          <div className="relative w-[80vw] max-w-3xl h-64 border border-accent/30 rounded-lg overflow-hidden">
            {/* Grid lines */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #ff6b2b 1px, transparent 1px),
                  linear-gradient(to bottom, #ff6b2b 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />
            
            {/* Waveform */}
            <motion.svg
              viewBox="0 0 800 200"
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.path
                d="M0,100 Q50,20 100,100 T200,100 T300,100 T400,100 T500,100 T600,100 T700,100 T800,100"
                fill="none"
                stroke="#ff6b2b"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  filter: 'drop-shadow(0 0 8px #ff6b2b)',
                }}
              />
            </motion.svg>

            {/* Label */}
            <div className="absolute bottom-4 left-4 font-mono text-xs text-accent/60">
              KONAMI_ACTIVATED.wav
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-xs text-accent/60">
              44.1kHz / 24bit
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

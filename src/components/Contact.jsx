import { motion } from 'framer-motion'
import { useState, useRef, useCallback } from 'react'

// Audio context singleton
let audioCtx = null
const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

// Hidden Otamatone that looks like a decorative character
function HiddenOtamatone() {
  const [isPressed, setIsPressed] = useState(false)
  const [mouthOpen, setMouthOpen] = useState(0)
  const [pitch, setPitch] = useState(0.5)
  const stemRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainRef = useRef(null)

  const startSound = useCallback((initialPitch = 0.5) => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()
    
    if (oscillatorRef.current) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.value = 200 + initialPitch * 500
    gain.gain.value = 0.2
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    
    oscillatorRef.current = osc
    gainRef.current = gain
    setIsPressed(true)
  }, [])

  const stopSound = useCallback(() => {
    if (gainRef.current) {
      gainRef.current.gain.exponentialRampToValueAtTime(0.001, getAudioContext().currentTime + 0.15)
    }
    setTimeout(() => {
      if (oscillatorRef.current) {
        try { oscillatorRef.current.stop() } catch(e) {}
        oscillatorRef.current = null
        gainRef.current = null
      }
    }, 150)
    setIsPressed(false)
  }, [])

  const updatePitch = useCallback((clientY) => {
    if (!stemRef.current) return
    const rect = stemRef.current.getBoundingClientRect()
    const relativeY = (clientY - rect.top) / rect.height
    const clampedY = Math.max(0, Math.min(1, relativeY))
    const newPitch = 1 - clampedY
    setPitch(newPitch)
    
    const freq = 200 + newPitch * 500
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = freq
    }
  }, [])

  // Face hover - plays sound and controls volume via mouth position
  const handleFaceEnter = () => {
    startSound(pitch)
  }

  const handleFaceMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relativeY = (e.clientY - rect.top) / rect.height
    const mouth = Math.max(0, Math.min(1, relativeY))
    setMouthOpen(mouth)
    
    // Mouth position controls volume
    if (gainRef.current) {
      gainRef.current.gain.value = 0.05 + mouth * 0.25
    }
  }

  const handleFaceLeave = () => {
    setMouthOpen(0)
    stopSound()
  }

  // Stem controls pitch
  const handleStemDown = (clientY) => {
    if (!oscillatorRef.current) {
      startSound(pitch)
    }
    updatePitch(clientY)
  }

  return (
    <div className="flex items-center justify-center gap-1 opacity-40 hover:opacity-100 transition-opacity duration-500">
      {/* Stem - drag for pitch */}
      <div 
        ref={stemRef}
        className={`w-2 h-16 rounded-full cursor-pointer relative transition-colors
          ${isPressed ? 'bg-accent' : 'bg-text/30 hover:bg-text/50'}`}
        onMouseDown={(e) => handleStemDown(e.clientY)}
        onMouseUp={stopSound}
        onMouseLeave={() => { if (!isPressed) return; stopSound() }}
        onMouseMove={(e) => isPressed && updatePitch(e.clientY)}
        onTouchStart={(e) => handleStemDown(e.touches[0].clientY)}
        onTouchMove={(e) => isPressed && updatePitch(e.touches[0].clientY)}
        onTouchEnd={stopSound}
        style={{ touchAction: 'none' }}
      >
        {/* Position indicator */}
        <motion.div 
          className="absolute left-1/2 -translate-x-1/2 w-3 h-1 bg-bg rounded-full"
          animate={{ top: `${(1 - pitch) * 85}%` }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>

      {/* Head/face - hover to play, move for volume */}
      <div 
        className={`w-12 h-12 rounded-full flex items-center justify-center relative cursor-pointer transition-colors
          ${isPressed ? 'bg-accent' : 'bg-text/70 hover:bg-text/80'}`}
        onMouseEnter={handleFaceEnter}
        onMouseMove={handleFaceMove}
        onMouseLeave={handleFaceLeave}
      >
        {/* Eyes */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 bg-bg rounded-full" />
        <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-bg rounded-full" />
        
        {/* Mouth */}
        <motion.div 
          className="absolute bottom-2.5 bg-bg rounded-full"
          animate={{ 
            width: 8 + mouthOpen * 4,
            height: 3 + mouthOpen * 8,
            borderRadius: mouthOpen > 0.3 ? '50%' : '9999px'
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />

        {/* Blush when playing */}
        {isPressed && (
          <>
            <div className="absolute top-5 left-1 w-2 h-1 bg-accent/40 rounded-full" />
            <div className="absolute top-5 right-1 w-2 h-1 bg-accent/40 rounded-full" />
          </>
        )}
      </div>
    </div>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 bg-surface">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-accent mb-4 uppercase">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-light mb-6">
            Let&apos;s make some{' '}
            <span className="text-accent font-medium italic">noise.</span>
          </h2>
          <p className="text-text-muted leading-relaxed mb-8 max-w-lg mx-auto">
            Got a project that needs great audio? Looking for a sound designer
            who brings both precision and personality? Let&apos;s talk.
          </p>

          {/* Hidden Otamatone easter egg */}
          <div className="mb-8">
            <HiddenOtamatone />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="mailto:brian@slossaudio.com"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 font-mono text-sm bg-accent text-bg px-8 py-4 rounded-lg hover:bg-accent-dim transition-colors duration-300 glow-accent no-underline font-bold"
          >
            brian@slossaudio.com
          </motion.a>

          <motion.a
            href="https://www.imdb.com/name/nm9069950/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 font-mono text-sm border border-border text-text-muted px-8 py-4 rounded-lg hover:border-accent hover:text-accent transition-colors duration-300 no-underline"
          >
            IMDB Profile
          </motion.a>
        </motion.div>

        {/* Subtle hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-mono text-xs text-text-dim mt-16"
        >
          * Field recordings of Pacific Northwest rain included upon request.
        </motion.p>
      </div>
    </section>
  )
}

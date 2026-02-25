import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

// Audio context singleton
let audioCtx = null
const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

// ============ MINI KEYBOARD ============
function MiniKeyboard() {
  const [activeKey, setActiveKey] = useState(null)
  const oscillatorRef = useRef(null)
  const gainRef = useRef(null)

  const keys = [
    { note: 'C', freq: 261.63, black: false },
    { note: 'C#', freq: 277.18, black: true },
    { note: 'D', freq: 293.66, black: false },
    { note: 'D#', freq: 311.13, black: true },
    { note: 'E', freq: 329.63, black: false },
    { note: 'F', freq: 349.23, black: false },
    { note: 'F#', freq: 369.99, black: true },
    { note: 'G', freq: 392.00, black: false },
    { note: 'G#', freq: 415.30, black: true },
    { note: 'A', freq: 440.00, black: false },
    { note: 'A#', freq: 466.16, black: true },
    { note: 'B', freq: 493.88, black: false },
    { note: 'C2', freq: 523.25, black: false },
  ]

  const playNote = (freq) => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()
    
    // Stop previous note
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
    }

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.value = 0.3
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    
    oscillatorRef.current = osc
    gainRef.current = gain
  }

  const stopNote = () => {
    if (gainRef.current) {
      gainRef.current.gain.exponentialRampToValueAtTime(0.001, getAudioContext().currentTime + 0.1)
    }
    setTimeout(() => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop()
        oscillatorRef.current = null
      }
    }, 100)
    setActiveKey(null)
  }

  const whiteKeys = keys.filter(k => !k.black)
  const blackKeys = keys.filter(k => k.black)

  return (
    <div className="bg-bg-secondary rounded-xl p-6 border border-text/10">
      <div className="text-xs text-accent font-mono mb-3 uppercase tracking-wider">Mini Keys</div>
      <div className="relative h-32 select-none">
        {/* White keys */}
        <div className="flex gap-1 h-full">
          {whiteKeys.map((key, i) => (
            <motion.div
              key={key.note}
              className={`flex-1 rounded-b-lg cursor-pointer flex items-end justify-center pb-2 text-xs font-mono
                ${activeKey === key.note ? 'bg-accent text-bg' : 'bg-text/90 text-bg hover:bg-text'}`}
              onMouseDown={() => { setActiveKey(key.note); playNote(key.freq) }}
              onMouseUp={stopNote}
              onMouseLeave={() => activeKey === key.note && stopNote()}
              onTouchStart={() => { setActiveKey(key.note); playNote(key.freq) }}
              onTouchEnd={stopNote}
              whileTap={{ scale: 0.98 }}
            >
              {key.note}
            </motion.div>
          ))}
        </div>
        {/* Black keys */}
        <div className="absolute top-0 left-0 right-0 h-20 flex pointer-events-none">
          {whiteKeys.slice(0, -1).map((key, i) => {
            const blackKey = blackKeys.find(b => b.note === key.note + '#')
            if (!blackKey) return <div key={i} className="flex-1" />
            return (
              <div key={i} className="flex-1 flex justify-end">
                <motion.div
                  className={`w-6 h-full rounded-b cursor-pointer pointer-events-auto -mr-3 z-10
                    ${activeKey === blackKey.note ? 'bg-accent' : 'bg-bg hover:bg-bg-secondary'}`}
                  style={{ marginRight: '-0.75rem' }}
                  onMouseDown={() => { setActiveKey(blackKey.note); playNote(blackKey.freq) }}
                  onMouseUp={stopNote}
                  onMouseLeave={() => activeKey === blackKey.note && stopNote()}
                  onTouchStart={() => { setActiveKey(blackKey.note); playNote(blackKey.freq) }}
                  onTouchEnd={stopNote}
                  whileTap={{ scale: 0.95 }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============ ANALOG SYNTH ============
function AnalogSynth() {
  const [freq, setFreq] = useState(220)
  const [waveform, setWaveform] = useState('sawtooth')
  const [volume, setVolume] = useState(0.3)
  const [isPlaying, setIsPlaying] = useState(false)
  const oscillatorRef = useRef(null)
  const gainRef = useRef(null)

  const startSound = useCallback(() => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()
    
    if (oscillatorRef.current) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = waveform
    osc.frequency.value = freq
    gain.gain.value = volume
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    
    oscillatorRef.current = osc
    gainRef.current = gain
    setIsPlaying(true)
  }, [freq, waveform, volume])

  const stopSound = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current = null
      gainRef.current = null
    }
    setIsPlaying(false)
  }, [])

  // Update params in real-time
  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = freq
    }
  }, [freq])

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume
    }
  }, [volume])

  useEffect(() => {
    if (oscillatorRef.current && isPlaying) {
      stopSound()
      setTimeout(startSound, 50)
    }
  }, [waveform])

  const Knob = ({ value, onChange, min, max, label, displayValue }) => {
    const knobRef = useRef(null)
    const [dragging, setDragging] = useState(false)

    const handleMouseDown = (e) => {
      setDragging(true)
      e.preventDefault()
    }

    useEffect(() => {
      const handleMouseMove = (e) => {
        if (!dragging) return
        const rect = knobRef.current.getBoundingClientRect()
        const centerY = rect.top + rect.height / 2
        const deltaY = centerY - e.clientY
        const range = max - min
        const newValue = Math.max(min, Math.min(max, value + deltaY * (range / 200)))
        onChange(newValue)
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
    }, [dragging, value, min, max, onChange])

    const rotation = ((value - min) / (max - min)) * 270 - 135

    return (
      <div className="flex flex-col items-center gap-2">
        <div
          ref={knobRef}
          className={`w-14 h-14 rounded-full bg-bg border-2 cursor-grab active:cursor-grabbing
            ${dragging ? 'border-accent' : 'border-text/30 hover:border-text/50'}`}
          onMouseDown={handleMouseDown}
          style={{ touchAction: 'none' }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="w-1 h-5 bg-accent rounded-full origin-bottom"
              style={{ transform: `rotate(${rotation}deg) translateY(-8px)` }}
            />
          </div>
        </div>
        <div className="text-xs font-mono text-text/60">{label}</div>
        <div className="text-xs font-mono text-accent">{displayValue}</div>
      </div>
    )
  }

  return (
    <div className="bg-bg-secondary rounded-xl p-6 border border-text/10">
      <div className="text-xs text-accent font-mono mb-4 uppercase tracking-wider">Analog Synth</div>
      
      <div className="flex justify-around mb-6">
        <Knob 
          value={freq} 
          onChange={setFreq} 
          min={80} 
          max={880} 
          label="FREQ"
          displayValue={`${Math.round(freq)}Hz`}
        />
        <Knob 
          value={volume} 
          onChange={setVolume} 
          min={0} 
          max={0.5} 
          label="VOL"
          displayValue={`${Math.round(volume * 100)}%`}
        />
      </div>

      <div className="flex gap-2 mb-4">
        {['sine', 'sawtooth', 'square', 'triangle'].map(w => (
          <button
            key={w}
            onClick={() => setWaveform(w)}
            className={`flex-1 py-1 px-2 text-xs font-mono rounded transition-colors
              ${waveform === w ? 'bg-accent text-bg' : 'bg-bg text-text/60 hover:text-text'}`}
          >
            {w === 'sine' && '∿'}
            {w === 'sawtooth' && '⩘'}
            {w === 'square' && '⊓'}
            {w === 'triangle' && '△'}
          </button>
        ))}
      </div>

      <motion.button
        onClick={isPlaying ? stopSound : startSound}
        className={`w-full py-3 rounded-lg font-mono text-sm transition-colors
          ${isPlaying ? 'bg-accent text-bg' : 'bg-bg border border-text/30 hover:border-accent'}`}
        whileTap={{ scale: 0.98 }}
      >
        {isPlaying ? '■ STOP' : '▶ PLAY'}
      </motion.button>
    </div>
  )
}

// ============ OTAMATONE ============
function Otamatone() {
  const [isPressed, setIsPressed] = useState(false)
  const [mouthOpen, setMouthOpen] = useState(0)
  const [pitch, setPitch] = useState(0.5)
  const containerRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainRef = useRef(null)

  const updatePitch = useCallback((clientY) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const relativeY = (clientY - rect.top) / rect.height
    const clampedY = Math.max(0, Math.min(1, relativeY))
    setPitch(1 - clampedY)
    
    // Map to frequency (200-800Hz)
    const freq = 200 + (1 - clampedY) * 600
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = freq
    }
  }, [])

  const startSound = useCallback((clientY) => {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()
    
    if (oscillatorRef.current) return

    updatePitch(clientY)

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.value = 200 + pitch * 600
    gain.gain.value = 0.25
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    
    oscillatorRef.current = osc
    gainRef.current = gain
    setIsPressed(true)
  }, [pitch, updatePitch])

  const stopSound = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current = null
      gainRef.current = null
    }
    setIsPressed(false)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (isPressed) {
      updatePitch(e.clientY)
    }
  }, [isPressed, updatePitch])

  const handleMouthMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relativeY = (e.clientY - rect.top) / rect.height
    setMouthOpen(Math.max(0, Math.min(1, relativeY)))
    
    // Modulate volume based on mouth
    if (gainRef.current) {
      gainRef.current.gain.value = 0.1 + relativeY * 0.3
    }
  }

  return (
    <div className="bg-bg-secondary rounded-xl p-6 border border-text/10">
      <div className="text-xs text-accent font-mono mb-4 uppercase tracking-wider">Otamatone</div>
      
      <div className="flex gap-4 items-center">
        {/* Neck/stem */}
        <div 
          ref={containerRef}
          className={`w-8 h-40 rounded-full cursor-pointer relative
            ${isPressed ? 'bg-accent' : 'bg-text/20 hover:bg-text/30'}`}
          onMouseDown={(e) => startSound(e.clientY)}
          onMouseUp={stopSound}
          onMouseLeave={stopSound}
          onMouseMove={handleMouseMove}
          onTouchStart={(e) => startSound(e.touches[0].clientY)}
          onTouchMove={(e) => { if (isPressed) updatePitch(e.touches[0].clientY) }}
          onTouchEnd={stopSound}
          style={{ touchAction: 'none' }}
        >
          {/* Position indicator */}
          <motion.div 
            className="absolute left-1/2 -translate-x-1/2 w-6 h-2 bg-bg rounded-full"
            animate={{ top: `${(1 - pitch) * 90}%` }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </div>

        {/* Face/head */}
        <div 
          className="w-24 h-24 rounded-full bg-text/90 flex items-center justify-center cursor-pointer relative"
          onMouseMove={handleMouthMove}
          onMouseLeave={() => setMouthOpen(0)}
        >
          {/* Eyes */}
          <div className="absolute top-6 left-5 w-3 h-3 bg-bg rounded-full" />
          <div className="absolute top-6 right-5 w-3 h-3 bg-bg rounded-full" />
          
          {/* Mouth */}
          <motion.div 
            className="absolute bottom-6 w-8 bg-bg rounded-full"
            animate={{ 
              height: 4 + mouthOpen * 16,
              borderRadius: mouthOpen > 0.3 ? '50%' : '9999px'
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          />
          
          {/* Blush */}
          {isPressed && (
            <>
              <div className="absolute top-10 left-2 w-4 h-2 bg-accent/40 rounded-full" />
              <div className="absolute top-10 right-2 w-4 h-2 bg-accent/40 rounded-full" />
            </>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-text/40 font-mono text-center">
        drag stem • hover mouth
      </div>
    </div>
  )
}

// ============ MAIN PLAYGROUND ============
export default function Playground() {
  return (
    <section id="playground" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-accent font-mono text-sm mb-2">Play</p>
          <h2 className="text-3xl md:text-4xl font-bold">Make some noise.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <MiniKeyboard />
          <AnalogSynth />
          <Otamatone />
        </div>
      </div>
    </section>
  )
}

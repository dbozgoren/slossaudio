import { motion } from 'framer-motion'
import { useState, useRef } from 'react'

// Audio context singleton
let audioCtx = null
const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

// Hidden piano that looks like a decorative graphic
function HiddenPiano() {
  const [activeKey, setActiveKey] = useState(null)
  const [hasPlayed, setHasPlayed] = useState(false)
  const oscillatorRef = useRef(null)
  const gainRef = useRef(null)

  const whiteKeys = [
    { note: 'C', freq: 261.63 },
    { note: 'D', freq: 293.66 },
    { note: 'E', freq: 329.63 },
    { note: 'F', freq: 349.23 },
    { note: 'G', freq: 392.00 },
    { note: 'A', freq: 440.00 },
    { note: 'B', freq: 493.88 },
    { note: 'C2', freq: 523.25 },
  ]

  const blackKeys = [
    { note: 'C#', freq: 277.18, position: 0 },
    { note: 'D#', freq: 311.13, position: 1 },
    // no black key after E
    { note: 'F#', freq: 369.99, position: 3 },
    { note: 'G#', freq: 415.30, position: 4 },
    { note: 'A#', freq: 466.16, position: 5 },
    // no black key after B
  ]

  const playNote = (freq) => {
    setHasPlayed(true)
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()
    
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop() } catch(e) {}
    }

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.value = 0.2
    
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
        try { oscillatorRef.current.stop() } catch(e) {}
        oscillatorRef.current = null
      }
    }, 100)
    setActiveKey(null)
  }

  return (
    <div className="mt-8">
      {/* Looks like a decorative piano graphic */}
      <div className="flex justify-center opacity-40 hover:opacity-100 transition-opacity duration-500">
        <div className="relative">
          {/* White keys */}
          <div className="flex gap-[2px]">
            {whiteKeys.map((key) => (
              <motion.div
                key={key.note}
                className={`w-5 h-10 rounded-b cursor-pointer transition-colors duration-75 border-x border-b border-text/10
                  ${activeKey === key.note 
                    ? 'bg-accent' 
                    : 'bg-text/80 hover:bg-text/90'}`}
                onMouseDown={() => { setActiveKey(key.note); playNote(key.freq) }}
                onMouseUp={stopNote}
                onMouseLeave={() => activeKey === key.note && stopNote()}
                onTouchStart={() => { setActiveKey(key.note); playNote(key.freq) }}
                onTouchEnd={stopNote}
                whileTap={{ scaleY: 0.97 }}
                style={{ originY: 0 }}
              />
            ))}
          </div>
          {/* Black keys */}
          <div className="absolute top-0 left-0 flex">
            {whiteKeys.slice(0, -1).map((_, i) => {
              const blackKey = blackKeys.find(b => b.position === i)
              if (!blackKey) return <div key={i} className="w-5 mr-[2px]" />
              return (
                <div key={i} className="w-5 mr-[2px] flex justify-end">
                  <motion.div
                    className={`w-3 h-6 rounded-b cursor-pointer -mr-[7px] z-10 transition-colors duration-75
                      ${activeKey === blackKey.note 
                        ? 'bg-accent' 
                        : 'bg-bg hover:bg-bg-secondary'}`}
                    onMouseDown={(e) => { e.stopPropagation(); setActiveKey(blackKey.note); playNote(blackKey.freq) }}
                    onMouseUp={stopNote}
                    onMouseLeave={() => activeKey === blackKey.note && stopNote()}
                    onTouchStart={() => { setActiveKey(blackKey.note); playNote(blackKey.freq) }}
                    onTouchEnd={stopNote}
                    whileTap={{ scaleY: 0.95 }}
                    style={{ originY: 0 }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {hasPlayed && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center font-mono text-[10px] text-accent/60 mt-2"
        >
          ♪
        </motion.p>
      )}
    </div>
  )
}

function FadeInSection({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeInSection>
          <p className="font-mono text-xs tracking-[0.3em] text-accent mb-4 uppercase">
            About
          </p>
        </FadeInSection>

        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          <div className="md:col-span-3">
            <FadeInSection delay={0.1}>
              <h2 className="text-3xl sm:text-4xl font-light leading-snug mb-8">
                I make things sound{' '}
                <span className="text-accent font-medium italic">alive.</span>
              </h2>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <p className="text-text-muted leading-relaxed mb-6">
                I&apos;m Brian Sloss, a sound designer and audio engineer based in Seattle.
                I own and operate Sloss Audio, crafting sonic experiences that range from
                blockbuster immersion to indie intimacy. With 47+ credits on IMDB and
                a background at Formosa Interactive Seattle, I bring both studio polish
                and creative curiosity to every project.
              </p>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <p className="text-text-muted leading-relaxed">
                When I&apos;m not designing sounds, you&apos;ll find me at the piano
                or recording rain on Pacific Northwest trails. I believe the best
                sound design is felt before it&apos;s heard &mdash; and maybe makes
                you smile while it does.
              </p>
            </FadeInSection>

            {/* Hidden piano easter egg - looks like decorative keys */}
            <FadeInSection delay={0.4}>
              <HiddenPiano />
            </FadeInSection>
          </div>

          <div className="md:col-span-2">
            <FadeInSection delay={0.3}>
              <div className="border border-border rounded-lg p-6 bg-surface">
                <p className="font-mono text-xs text-text-dim mb-4 tracking-wider uppercase">
                  Quick Stats
                </p>
                <div className="space-y-4">
                  {[
                    { label: 'IMDB Credits', value: '47+' },
                    { label: 'Based in', value: 'Seattle, WA' },
                    { label: 'Studio', value: 'Sloss Audio' },
                    { label: 'Sample Rate', value: '96kHz' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex justify-between items-baseline border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <span className="font-mono text-xs text-text-muted">
                        {stat.label}
                      </span>
                      <span className="font-mono text-sm text-accent font-bold">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.4}>
              <div className="mt-6 border border-border rounded-lg p-6 bg-surface">
                <p className="font-mono text-xs text-text-dim mb-3 tracking-wider uppercase">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Field Recording',
                    'Sound Design',
                    'Soundtrack Design',
                    'Audio Engineering',
                    'Piano',
                    'Foley',
                    'Mixing',
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="font-mono text-[11px] px-3 py-1.5 border border-border rounded-full text-text-muted hover:text-accent hover:border-accent transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  )
}

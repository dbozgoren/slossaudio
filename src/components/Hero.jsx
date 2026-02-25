import { motion } from 'framer-motion'
import Waveform from './Waveform'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden scanlines">
      {/* Waveform background */}
      <Waveform />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-accent mb-6 uppercase">
            Sound Design & Audio Engineering
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-mono font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-none mb-6"
        >
          BRIAN
          <br />
          <span className="text-accent glow-text">SLOSS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-mono text-xs tracking-[0.2em] text-text-muted"
        >
          SEATTLE, WA &mdash; 47+ IMDB CREDITS
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-widest text-text-dim uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-text-dim to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}

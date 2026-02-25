import { motion } from 'framer-motion'

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
          <p className="text-text-muted leading-relaxed mb-12 max-w-lg mx-auto">
            Got a project that needs great audio? Looking for a sound designer
            who brings both precision and personality? Let&apos;s talk.
          </p>
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

        {/* Playful touch */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-mono text-xs text-text-dim mt-16"
        >
          * My cat may or may not approve your project.
          <br />
          Results not guaranteed. Otamatone noises are free.
        </motion.p>
      </div>
    </section>
  )
}

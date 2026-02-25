import { motion } from 'framer-motion'

export default function Credits() {
  return (
    <section id="credits" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-accent mb-4 uppercase">
            Credits
          </p>
          <h2 className="text-3xl sm:text-4xl font-light mb-16">
            The <span className="text-accent font-medium italic">work.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Big number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center md:text-left"
          >
            <div className="inline-block relative">
              <span className="font-mono text-8xl sm:text-9xl font-bold text-accent glow-text leading-none">
                47+
              </span>
              <p className="font-mono text-xs tracking-[0.2em] text-text-muted mt-4 uppercase">
                IMDB Credits & Counting
              </p>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-text-muted leading-relaxed mb-6">
              From AAA game titles to indie films, my work spans interactive entertainment
              and linear media. Previously at Formosa Interactive Seattle, I&apos;ve
              contributed sound design and audio engineering across dozens of shipped
              projects.
            </p>

            <div className="border border-border rounded-lg p-6 bg-surface mb-6">
              <p className="font-mono text-xs text-text-dim mb-3 tracking-wider uppercase">
                Experience
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm">Sloss Audio</span>
                  <span className="font-mono text-xs text-accent">Owner</span>
                </div>
                <div className="border-t border-border" />
                <div className="flex justify-between items-baseline">
                  <span className="text-sm">Formosa Interactive</span>
                  <span className="font-mono text-xs text-text-muted">Seattle</span>
                </div>
              </div>
            </div>

            <motion.a
              href="https://www.imdb.com/name/nm9069950/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 font-mono text-sm border border-accent text-accent px-6 py-3 rounded-lg hover:bg-accent hover:text-bg transition-colors duration-300 no-underline"
            >
              View Full Credits on IMDB
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

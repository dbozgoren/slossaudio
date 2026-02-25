import { motion } from 'framer-motion'

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

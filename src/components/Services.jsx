import { motion } from 'framer-motion'

const services = [
  {
    title: 'Sound Design',
    description:
      'Crafting immersive audio landscapes for games, film, and interactive media. From subtle ambiences to explosive impacts.',
    icon: '~',
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

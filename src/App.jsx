import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Credits from './components/Credits'
import Contact from './components/Contact'
import Footer from './components/Footer'
import VUMeter from './components/VUMeter'
import EasterEggs from './components/EasterEggs'

function App() {
  return (
    <div className="min-h-screen bg-bg text-text overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Credits />
        <Contact />
      </main>
      <Footer />
      <VUMeter />
      <EasterEggs />
    </div>
  )
}

export default App

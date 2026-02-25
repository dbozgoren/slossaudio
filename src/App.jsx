import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Credits from './components/Credits'
import Contact from './components/Contact'
import Footer from './components/Footer'

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
    </div>
  )
}

export default App

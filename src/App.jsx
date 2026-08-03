import { ProfilePhotoProvider } from './hooks/useProfilePhoto'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Process from './components/Process'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'

export default function App() {
  return (
    <ProfilePhotoProvider>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Process />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </ProfilePhotoProvider>
  )
}

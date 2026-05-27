import { useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import FloatingWhatsApp from '../components/layout/FloatingWhatsApp'
import Hero from '../components/home/Hero'
import TrustBar from '../components/home/TrustBar'
import Services from '../components/home/Services'
import EmergencyCTA from '../components/home/EmergencyCTA'
import About from '../components/home/About'
import WhyChooseUs from '../components/home/WhyChooseUs'
import HowItWorks from '../components/home/HowItWorks'
import BookingForm from '../components/home/BookingForm'
import WhatsAppCTA from '../components/home/WhatsAppCTA'
import Gallery from '../components/home/Gallery'
import Testimonials from '../components/home/Testimonials'
import FAQ from '../components/home/FAQ'
import Contact from '../components/home/Contact'

export default function Home() {
  useEffect(() => {
    document.title = 'Jb Pest Control Brakpan | Professional Pest Control | Available 24/7'
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <EmergencyCTA />
        <About />
        <WhyChooseUs />
        <HowItWorks />
        <BookingForm />
        <WhatsAppCTA />
        <Gallery />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

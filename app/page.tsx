'use client'

import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { SearchSection } from '@/components/SearchSection'
import { AdBanner } from '@/components/AdBanner'
import { CoachesSection } from '@/components/CoachesSection'
import { ClubsSection } from '@/components/ClubsSection'
import { AcademiesSection } from '@/components/AcademiesSection'
import { ShopSection } from '@/components/ShopSection'
import { HowItWorks } from '@/components/HowItWorks'
import { MobileAppsSection } from '@/components/MobileAppsSection'
import { Testimonials } from '@/components/Testimonials'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <SearchSection />
      <CoachesSection />
      
      {/* Ad Banner 1 - Mercedes-Benz */}
      <AdBanner 
        brand="Mercedes-Benz"
        tagline="El futuro del rendimiento deportivo"
        imageUrl="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80"
        logoUrl="Mercedes-Benz"
        ctaText="Descubre más"
        ctaUrl="https://www.mercedes-benz.com"
        variant="dark"
      />
      
      <ClubsSection />
      <AcademiesSection />
      <ShopSection />
      <HowItWorks />
      
      {/* Ad Banner 2 - Nike */}
      <AdBanner 
        brand="Nike"
        tagline="Just Do It. En la pista y fuera de ella"
        imageUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80"
        logoUrl="NIKE"
        ctaText="Ver colección"
        ctaUrl="https://www.nike.com"
        variant="light"
      />
      
      <Testimonials />
      <MobileAppsSection />
      <Footer />
    </main>
  )
}

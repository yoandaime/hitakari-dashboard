import { useEffect } from "react"
import { useLocation } from "react-router-dom"

import { Navbar } from "@/components/faq/Navbar"
import { CURRENT_USER } from "@/data/current-user"
import { HeroSection } from "@/components/landing/HeroSection"
import { DiscoverSection } from "@/components/landing/DiscoverSection"
import { BannerCarousel } from "@/components/landing/BannerCarousel"
import { WhyChooseSection } from "@/components/landing/WhyChooseSection"
import { FamousProductsSection } from "@/components/landing/FamousProductsSection"
import { CustomerStoriesSection } from "@/components/landing/CustomerStoriesSection"
import { Footer } from "@/components/layout/Footer"

const NAV_LINKS = ["Home", "About us", "Products", "FAQ"]

export default function LandingPage() {
  const { state } = useLocation()

  // Arriving from another page via a section link (e.g. "About us" in the header).
  useEffect(() => {
    if (!state?.scrollTo) return
    document.getElementById(state.scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [state])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar links={NAV_LINKS} activeLabel="Home" user={CURRENT_USER} />
      <main>
        <HeroSection />
        <DiscoverSection />
        <BannerCarousel />
        <WhyChooseSection />
        <FamousProductsSection />
        <CustomerStoriesSection />
      </main>
      <Footer />
    </div>
  )
}

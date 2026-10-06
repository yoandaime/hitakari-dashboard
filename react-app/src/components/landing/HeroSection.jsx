import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"

import heroBg from "@/assets/landing/hero-bg.svg"
import heroMascot from "@/assets/landing/hero-mascot.png"

export function HeroSection() {
  const navigate = useNavigate()

  function handleExplore() {
    document.getElementById("why-choose")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section className="relative overflow-hidden border-b border-neutral-200 lg:h-[517px]">
      <img
        src={heroBg}
        alt=""
        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
      />
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center gap-10 px-6 py-12 lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:flex-row lg:gap-[190px] lg:px-[90px] lg:py-0">
        <div className="flex min-w-px flex-1 flex-col items-start">
          <h1 className="w-full text-[60px] leading-[60px] font-batik font-bold tracking-[-1.5px] text-blue-950">
            Discover &amp; Deploy AI Tools in One Marketplace
          </h1>
          <p className="w-full pt-6 text-2xl leading-[30px] text-blue-950">
            Find the AI models you need, test them instantly, and integrate through simple APIs.
          </p>
          <div className="flex items-start gap-4 pt-8">
            <Button
              onClick={handleExplore}
              className="h-12 rounded-full border border-transparent bg-red-600 px-6 text-base leading-6 font-medium text-white shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.28),inset_2px_0px_0px_0px_rgba(255,255,255,0.28),inset_-2px_0px_0px_0px_rgba(255,255,255,0.28)] hover:bg-red-700">
              Explore now
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/product-catalog")}
              className="h-12 w-[200px] min-w-[200px] rounded-full border-neutral-300 bg-white px-6 text-base leading-6 font-medium text-black hover:bg-neutral-50"
            >
              Portal
            </Button>
          </div>
        </div>
        <div className="flex shrink-0 items-start justify-center">
          <img
            src={heroMascot}
            alt="Hitakari Telkomsel AI"
            className="size-[400px] max-w-full object-contain"
          />
        </div>
      </div>
    </section>
  )
}

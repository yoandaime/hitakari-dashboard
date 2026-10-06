import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import banner1 from "@/assets/landing/banner-1.png"
import banner2 from "@/assets/landing/banner-2.png"
import banner3 from "@/assets/landing/banner-3.png"

const BANNERS = [
  { src: banner1, alt: "Smarter IT incident resolution" },
  { src: banner2, alt: "Hitakari AI banner" },
  { src: banner3, alt: "Hitakari AI banner" },
]

const GAP = 30
// Slide width: 1470px max, otherwise viewport minus 80px gutter on each side.
const SLIDE_W = "min(1470px, calc(100vw - 160px))"
// Arrow offset from the viewport edge: slide gutter + 16px inside the active slide.
const ARROW_INSET = `calc((100vw - ${SLIDE_W}) / 2 + 16px)`

const ARROW_CLASS =
  "absolute top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-blue-950 opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-white disabled:hidden"

export function BannerCarousel() {
  const [index, setIndex] = useState(BANNERS.length - 1)

  const lastIndex = BANNERS.length - 1

  return (
    <section className="overflow-hidden bg-white pb-12">
      <div className="group relative">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{
          gap: GAP,
          transform: `translateX(calc((100vw - ${SLIDE_W}) / 2 - ${index} * (${SLIDE_W} + ${GAP}px)))`,
        }}
      >
        {BANNERS.map((banner) => (
          <div
            key={banner.src}
            className="aspect-[1470/429] shrink-0 overflow-hidden rounded-[48px] shadow-[0px_2px_4px_-2px_rgba(10,13,18,0.06)]"
            style={{ width: SLIDE_W }}
          >
            <img src={banner.src} alt={banner.alt} className="size-full object-cover" />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        disabled={index === 0}
        onClick={() => setIndex((i) => Math.max(0, i - 1))}
        className={ARROW_CLASS}
        style={{ left: ARROW_INSET }}
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        disabled={index === lastIndex}
        onClick={() => setIndex((i) => Math.min(lastIndex, i + 1))}
        className={ARROW_CLASS}
        style={{ right: ARROW_INSET }}
      >
        <ChevronRight className="size-6" />
      </button>
      </div>

      <div className="flex items-start justify-center gap-2 pt-4">
        {BANNERS.map((banner, i) => (
          <button
            key={banner.src}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className="px-1"
          >
            <span
              className={`block h-2.5 rounded-full transition-all ${
                i === index ? "w-[30px] bg-red-600" : "size-2.5 bg-slate-300"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  )
}

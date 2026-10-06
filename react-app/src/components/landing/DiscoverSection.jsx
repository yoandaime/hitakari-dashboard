import waveUnion from "@/assets/landing/wave-union.svg"
import searchA from "@/assets/landing/icon-search-1.svg"
import searchB from "@/assets/landing/icon-search-2.svg"
import compareA from "@/assets/landing/icon-compare-1.svg"
import compareB from "@/assets/landing/icon-compare-2.svg"
import apiA from "@/assets/landing/icon-api-1.svg"
import apiB from "@/assets/landing/icon-api-2.svg"
import apiC from "@/assets/landing/icon-api-3.svg"
import apiD from "@/assets/landing/icon-api-4.svg"
import arrangeA from "@/assets/landing/icon-arrange-1.svg"
import arrangeB from "@/assets/landing/icon-arrange-2.svg"
import connectA from "@/assets/landing/icon-connect-1.svg"
import connectB from "@/assets/landing/icon-connect-2.svg"

function Layer({ src, className }) {
  return <img alt="" src={src} className={`absolute block max-w-none ${className}`} />
}

function RotatedLayer({ src, inset, w, h }) {
  return (
    <div className={`absolute flex items-center justify-center ${inset}`} style={{ containerType: "size" }}>
      <div
        className="flex-none -rotate-45"
        style={{ height: `hypot(${h}cqw, ${h}cqh)`, width: `hypot(${w}cqw, -${w}cqh)` }}
      >
        <img alt="" src={src} className="absolute block size-full max-w-none" />
      </div>
    </div>
  )
}

const ICONS = {
  search: (
    <div className="relative size-10 shrink-0 overflow-clip">
      <Layer src={searchA} className="inset-[13.88%_8.44%_8.44%_13.87%] size-auto" />
      <Layer src={searchB} className="inset-[0_0.12%_0.12%_0] size-auto" />
    </div>
  ),
  compare: (
    <div className="relative h-[45.164px] w-[37px] shrink-0 overflow-clip">
      <Layer src={compareA} className="inset-[13.63%_50.09%_13.69%_5.55%] size-auto" />
      <Layer src={compareB} className="inset-[1.59%_2.13%_1.65%_1.94%] size-auto" />
    </div>
  ),
  api: (
    <div className="relative h-[31.364px] w-[39px] shrink-0 overflow-clip">
      <RotatedLayer src={apiA} inset="inset-[-36.17%_-26.07%_-36.33%_-12.66%]" w={50.1434} h={49.8566} />
      <RotatedLayer src={apiB} inset="inset-[-45.91%_-38.29%_-45.87%_-15.95%]" w={50.2201} h={49.7799} />
      <RotatedLayer src={apiC} inset="inset-[39.26%_70.05%_41.49%_14.47%]" w={50} h={50} />
      <Layer src={apiD} className="inset-[34.56%_17.95%_36.8%_40.6%] size-auto" />
    </div>
  ),
  arrange: (
    <div className="relative h-[36.847px] w-[34px] shrink-0 overflow-clip">
      <Layer src={arrangeA} className="inset-[-0.01%_0.22%_0.15%_0] size-auto" />
      <Layer src={arrangeB} className="inset-[0.97%_0.22%_1.7%_0] size-auto" />
    </div>
  ),
  connect: (
    <div className="relative size-10 shrink-0 overflow-clip">
      <Layer src={connectA} className="inset-[12.18%_7.83%_12.24%_16.59%] size-auto" />
      <Layer src={connectB} className="inset-[1.26%_1.32%_1.34%_1.26%] size-auto" />
    </div>
  ),
}

const FEATURES = [
  {
    icon: "search",
    title: "Browse a wide range of AI products",
    body: "Discover AI tools for text, image, audio, data, automation, and more — all organized to help you quickly find what fits your needs.",
  },
  {
    icon: "compare",
    title: "Compare pricing and features transparently",
    body: "View each model’s speed, limits, accuracy, and cost side-by-side so you can make clear, confident decisions.",
  },
  {
    icon: "api",
    title: "Purchase API access instantly",
    body: "Discover AI tools for text, image, audio, data, automation, and more — all organized to help you quickly find what fits your needs.",
  },
  {
    icon: "arrange",
    title: "Manage API keys and usage in your necessity",
    body: "View each model’s speed, limits, accuracy, and cost side-by-side so you can make clear, confident decisions.",
  },
  {
    icon: "connect",
    title: "Connect to your app using simple, developer-friendly endpoints",
    body: "Implement API calls with copy-ready code snippets and clear documentation designed to get you running in minutes.",
  },
]

function Feature({ icon, title, body }) {
  return (
    <div className="flex w-full max-w-[500px] flex-col gap-3">
      <div className="flex items-center gap-3.5">
        <div className="flex size-[52px] shrink-0 items-center justify-center rounded border border-white bg-red-600 p-1.5">
          {ICONS[icon]}
        </div>
        <p className="flex-1 text-xl font-semibold text-neutral-900">{title}</p>
      </div>
      <p className="text-base text-neutral-600">{body}</p>
    </div>
  )
}

export function DiscoverSection() {
  const lastIndex = FEATURES.length - 1
  return (
    <section id="about-us" className="relative scroll-mt-15 overflow-hidden bg-white px-6 py-16 lg:h-[900px] lg:py-0">
      <img
        src={waveUnion}
        alt=""
        className="pointer-events-none absolute top-[-78px] left-1/2 hidden h-[1231.858px] w-[2327.604px] max-w-none -translate-x-1/2 lg:block"
      />
      <div className="pointer-events-none absolute top-0 left-0 hidden h-[1094px] w-full bg-gradient-to-b from-white from-[14.3%] to-white/0 to-[37.6%] lg:block" />

      <div className="relative mx-auto flex w-full max-w-[1040px] flex-col items-center gap-[70px] lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-[44px] leading-normal font-batik font-bold text-blue-950">
            Discover the Future:
            <br />
            <span className="text-red-600">Your One-Stop AI Marketplace!</span>
          </h2>
          <p className="max-w-[600px] text-base text-black">
            Our AI Marketplace helps you explore, test, and purchase AI models in one place.
            Whether you&apos;re building apps, automating workflows, or scaling your business, you
            can easily find and integrate the right AI tools.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-12">
          <div className="grid w-full grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
            {FEATURES.slice(0, lastIndex).map((feature) => (
              <Feature key={feature.title} {...feature} />
            ))}
          </div>
          <Feature {...FEATURES[lastIndex]} />
        </div>
      </div>
    </section>
  )
}

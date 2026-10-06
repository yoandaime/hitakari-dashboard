import simplyDesign from "@/assets/landing/why-simply-design.svg"
import seamless from "@/assets/landing/why-seamless.svg"
import performance from "@/assets/landing/why-performance.svg"
import secure from "@/assets/landing/why-secure.svg"

const REASONS = [
  {
    title: "Simply Design",
    body: "All AI products can be used instantly through a simple, easy-to-understand interface. Perfect for professionals, business users, and even everyday users who want to benefit from AI without needing any technical expertise.",
    image: simplyDesign,
    imageClass: "top-[29px] left-[32px] h-[119.8px] w-[120px]",
  },
  {
    title: "Seamless Integration",
    body: "Easily integrates with existing tech stacks and works with popular platforms and tools, eliminating the need for system overhauls.",
    image: seamless,
    imageClass: "top-[46px] left-[33px] h-[95.9px] w-[160px]",
  },
  {
    title: "Superior Performance",
    body: "Barongs.AI succeed to deliver high concurrency and large requests with low latency and high throughput, best performance than others.",
    image: performance,
    imageClass: "top-[22.5px] left-[36px] h-[123.6px] w-[141px]",
  },
  {
    title: "Secure & Standardized",
    body: "All AI products on Barongs.AI go through a thorough curation and standardization process, ensuring users don’t have to worry about data security or model quality.",
    image: secure,
    imageClass: "top-[37px] left-[31px] h-[107px] w-[150px]",
  },
]

export function WhyChooseSection() {
  return (
    <section id="why-choose" className="scroll-mt-15 flex flex-col items-center gap-10 bg-white px-6 pt-[50px] pb-[70px] lg:px-20">
      <h2 className="text-center text-[44px] leading-normal font-batik font-bold text-blue-950">
        Why Choose <span className="text-red-600">Hitakari?</span>
      </h2>

      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
        {REASONS.map((reason) => (
          <article
            key={reason.title}
            className="flex h-[350px] flex-col overflow-clip rounded-3xl bg-[radial-gradient(ellipse_at_80%_28%,rgba(250,204,224,0.55)_0%,rgba(254,246,250,0)_55%)] bg-pink-50"
          >
            <div className="relative h-[150px] w-full shrink-0">
              <img
                src={reason.image}
                alt=""
                className={`absolute max-w-none object-contain ${reason.imageClass}`}
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 px-6 py-5">
              <h3 className="font-batik text-[28px] leading-normal font-normal text-blue-950">{reason.title}</h3>
              <p className="text-sm text-black">{reason.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

import waveUnion from "@/assets/landing/wave-union-stories.svg"
import star from "@/assets/landing/star.svg"
import starSmall from "@/assets/landing/star-small.svg"
import chevronDown from "@/assets/landing/chevron-down.svg"

const STORIES = [
  {
    initials: "AS",
    name: "Alex Sunadi",
    product: "Claude Haiku 5.0",
    quote:
      "Kami pakai Agentic Al Telkomsel untuk bantu otomasi respon pelanggan. Hasilnya luar biasa-response rate kami meningkat, dan pelanggan lebih puas.",
    width: 500,
  },
  {
    initials: "AS",
    name: "Anto Susilo",
    product: "NexaMind 5.0",
    quote:
      "\"Biasanya kalau cari info harus browsing lama. Dengan Al ini, semua langsung muncul dengan jelas. Jadi hemat waktu banget!\"",
    width: 500,
  },
  {
    initials: "IG",
    name: "Ibu Gina",
    product: "EchoPulse 5.0",
    quote:
      "\"Anak saya pakai buat ngerjain tugas kuliah, dan hasilnya bagus. Sekarang saya ikut pakai juga buat cari informasi. Ternyata berguna banget!\"",
    width: 500,
  },
  {
    initials: "GM",
    name: "Gatot Mangkuto",
    product: "Cortexa 5.0",
    quote:
      "\"Sebagai mahasiswa, Agentic Al sangat membantu buat riset dan nyusun laporan. Nyari info jadi cepat dan relevan. Super recommended!\"",
    width: 500,
  },
  {
    initials: "AS",
    name: "Anto Susilo",
    product: "VeraSynth 5.0",
    quote:
      "\"Biasanya kalau cari info harus browsing lama. Dengan Al ini, semua langsung muncul dengan jelas. Jadi hemat waktu banget!\"",
    width: 356,
  },
  {
    initials: "AS",
    name: "Alex Sunadi",
    product: "LumaBot 5.0",
    quote:
      "Kami pakai Agentic Al Telkomsel untuk bantu otomasi respon pelanggan. Hasilnya luar biasa-response rate kami meningkat, dan pelanggan lebih puas.",
    width: 491,
  },
  {
    initials: "SK",
    name: "Sinta Karunia",
    product: "OptiCore 5.0",
    quote:
      "Sejak pakai Agentic Al dari Telkomsel, pekerjaan analisis data saya jadi jauh lebih cepat. Banyak proses yang biasanya makan waktu berjam-jam, sekarang selesai dalam hitungan menit. Benar-benar bantu banget!",
    width: 491,
  },
]

function FilterButton({ children, leading }) {
  return (
    <button
      type="button"
      className="flex h-7 items-center gap-px rounded-lg border border-neutral-200 bg-white py-0.5 pr-2 pl-3"
    >
      <span className="flex items-center text-xs text-neutral-800">
        {leading}
        {children}
      </span>
      <img src={chevronDown} alt="" className="size-5" />
    </button>
  )
}

function StoryCard({ story }) {
  return (
    <article
      className="flex shrink-0 flex-col gap-3 self-stretch overflow-clip rounded-xl border border-neutral-300 bg-white px-6 py-[18px] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.1),0px_4px_6px_-2px_rgba(10,13,18,0.05)]"
      style={{ width: story.width, maxWidth: "calc(100vw - 48px)" }}
    >
      <div className="flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-lg text-red-600">
          {story.initials}
        </div>
        <div className="flex min-w-px flex-1 flex-col">
          <p className="text-lg font-semibold text-black">{story.name}</p>
          <div className="flex items-center gap-[5px]">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((i) => (
                <img key={i} src={star} alt="" className="size-5" />
              ))}
            </div>
            <span className="text-sm font-medium text-neutral-900">5.0</span>
          </div>
        </div>
      </div>
      <p className="text-base leading-6 font-semibold text-black">{story.product}</p>
      <p className="text-sm text-black">{story.quote}</p>
    </article>
  )
}

export function CustomerStoriesSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-[78px] pb-[80px]">
      <img
        src={waveUnion}
        alt=""
        className="pointer-events-none absolute top-[41px] left-1/2 h-[1231.858px] w-[2327.604px] max-w-none -translate-x-1/2"
      />
      <div className="pointer-events-none absolute top-0 left-0 h-[302px] w-full bg-gradient-to-b from-white from-[14.3%] to-white/0 to-[37.6%]" />

      <div className="relative flex flex-col items-center gap-3">
        <h2 className="text-[44px] leading-normal font-batik font-bold text-blue-950">
          Customer <span className="text-red-600">Stories</span>
        </h2>
        <div className="flex items-center gap-3.5">
          <FilterButton>Classification</FilterButton>
          <FilterButton leading={<img src={starSmall} alt="" className="size-4" />}>5.0</FilterButton>
        </div>
      </div>

      <div className="relative mt-[46px] overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max items-stretch gap-6 px-6 lg:pl-[max(24px,calc((100vw-1440px)/2+162px))]">
          {STORIES.map((story, i) => (
            <StoryCard key={`${story.name}-${i}`} story={story} />
          ))}
        </div>
      </div>

      <nav className="relative mt-6 flex items-center justify-center gap-3" aria-label="Pagination">
        <button type="button" disabled className="size-8 text-sm text-blue-950 opacity-30">
          Prev
        </button>
        <button
          type="button"
          aria-current="page"
          className="h-8 min-w-8 rounded-sm border-[0.556px] border-red-600 px-2 text-sm text-red-600"
        >
          1
        </button>
        <button type="button" disabled className="size-8 text-sm text-blue-950 opacity-30">
          Next
        </button>
      </nav>
    </section>
  )
}

import famousBg from "@/assets/landing/famous-bg.png"
import famous1 from "@/assets/landing/famous-1.png"
import famous2 from "@/assets/landing/famous-2.png"
import famous3 from "@/assets/landing/famous-3.png"
import famous4 from "@/assets/landing/famous-4.png"
import arrowRight from "@/assets/landing/arrow-right.svg"

const PRODUCTS = [
  {
    title: "OCR for Image Recognition and Processing",
    tagline: "Converts ID images into secure, searchable data.",
    body: "This technology uses AI to seamlessly capture and process ID documents from selfies or uploads. It instantly recognizes, extracts, and translates ID content, saving it into a RAG system with a vector database for error-free data management.",
    image: famous1,
  },
  {
    title: "Spam Call Assistant",
    tagline: "AI analyzes incoming calls.",
    body: "This technology uses AI to seamlessly capture and process ID documents from selfies or uploads. It instantly recognizes, extracts, and translates ID content, saving it into a RAG system with a vector database for error-free data management.",
    image: famous2,
  },
  {
    title: "AVA as Orchestration Knowledge Retrieval",
    tagline: "AVA enables instant knowledge from processed files.",
    body: "AVA orchestrates the upload and processing of files via LLM and embedding, enabling instant knowledge retrieval and insights.",
    image: famous3,
  },
  {
    title: "AI Consumer Complaint Handling",
    tagline: "AI analyzes issues for speed and accuracy.",
    body: "Streamlines consumer complaints by connecting calls to AI-assisted agents. The AI instantly analyzes issues for faster, more precise resolution.",
    image: famous4,
  },
]

export function FamousProductsSection() {
  return (
    <section className="relative overflow-hidden bg-red-600">
      <img
        src={famousBg}
        alt=""
        className="pointer-events-none absolute top-[-300px] left-[-190px] h-[673px] w-[481px] max-w-none"
      />

      <div className="relative flex flex-col gap-10 px-4 py-14">
        <div className="flex flex-col items-center gap-3 text-center text-white">
          <h2 className="text-[44px] leading-[44px] font-batik font-bold tracking-[-1.1px]">
            Most Famous AI Product in Marketplace
          </h2>
          <p className="text-[28px] leading-[42px]">
            Revolutionizing the way you interact with technology.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-[1601px] grid-cols-1 gap-6 px-10 lg:grid-cols-2">
          {PRODUCTS.map((product) => (
            <article
              key={product.title}
              className="flex min-h-[300px] items-center gap-8 rounded-xl border-[0.556px] border-neutral-100 bg-white p-[18px] shadow-[0px_2px_2px_rgba(10,13,18,0.06),0px_4px_4px_rgba(10,13,18,0.1)]"
            >
              <img
                src={product.image}
                alt=""
                className="hidden h-[262.5px] w-[296.5px] shrink-0 object-contain sm:block"
              />
              <div className="flex min-w-px flex-1 flex-col items-start gap-3">
                <h3 className="text-xl leading-5 font-semibold tracking-[-0.5px] text-red-600">
                  {product.title}
                </h3>
                <p className="text-xs leading-4 font-semibold text-blue-950">{product.tagline}</p>
                <p className="text-xs leading-[19.5px] text-blue-950">{product.body}</p>
                <a href="#" className="flex items-center gap-2 text-base leading-6 text-red-600">
                  See Products
                  <img src={arrowRight} alt="" className="size-[14px]" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

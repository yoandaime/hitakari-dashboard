import footerBg from "@/assets/landing/footer-bg.png"
import footerLogo from "@/assets/landing/footer-logo.png"
import contributors from "@/assets/landing/footer-contributors.png"
import social1 from "@/assets/landing/social-1.svg"
import social2 from "@/assets/landing/social-2.svg"
import social3 from "@/assets/landing/social-3.svg"
import social4 from "@/assets/landing/social-4.svg"
import social5 from "@/assets/landing/social-5.svg"

const SOCIALS = [
  { label: "Facebook", icon: social1 },
  { label: "Instagram", icon: social2 },
  { label: "X", icon: social3 },
  { label: "LinkedIn", icon: social4 },
  { label: "YouTube", icon: social5 },
]

const COLUMNS = [
  { title: "Explore", links: ["Home", "About Us", "Our Solution", "Product", "FAQ"] },
  {
    title: "Category",
    links: ["Models", "Tools", "Data Sources", "Agent Strategies", "Extension", "Rest API"],
  },
  { title: "Tags", links: ["Business", "Finance", "News", "Search", "Image", "Video"] },
]

export function Footer() {
  return (
    <footer className="flex flex-col">
      <div className="relative overflow-hidden bg-slate-100">
        <img
          src={footerBg}
          alt=""
          className="pointer-events-none absolute top-0 left-0 hidden h-full w-[780px] max-w-none object-cover md:block"
        />

        <div className="relative mx-auto flex w-full max-w-[1152px] flex-col gap-10 p-10 md:min-h-[417px] md:flex-row">
          <div className="flex w-full max-w-[320px] shrink-0 flex-col">
            <div className="flex items-center gap-1">
              <img src={footerLogo} alt="Hitakari Telkomsel AI" className="h-[61px] w-[149px] object-cover" />
              <span className="pt-1 text-[21px] leading-[31.5px] text-black">Marketplace</span>
            </div>

            <div className="flex flex-col pt-3">
              <p className="text-sm leading-[22.75px] font-semibold text-blue-950">Address</p>
              <p className="pt-1 text-sm leading-[22.75px] text-blue-950">
                Telkomsel Smart Office, Jl. Gatot Subroto Kav. 52, RT/RW 1/5, Kuningan Bar., Kec.
                Mampang Prapt., Jakarta Selatan
              </p>
            </div>

            <div className="flex flex-col pt-3">
              <p className="text-sm leading-[22.75px] font-semibold text-blue-950">Contact</p>
              <a href="tel:18001023457" className="pt-1 text-sm leading-[22.75px] text-blue-950 underline">
                1800 102 3457
              </a>
              <a
                href="mailto:Hitakari@telkomsel.co.id"
                className="pt-1 text-sm leading-[22.75px] text-blue-950 underline"
              >
                Hitakari@telkomsel.co.id
              </a>
            </div>

            <div className="flex items-center gap-3 pt-5">
              {SOCIALS.map(({ label, icon }) => (
                <a key={label} href="#" aria-label={label} onClick={(e) => e.preventDefault()}>
                  <img src={icon} alt="" className="size-6" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid min-w-px flex-1 grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col">
              <p className="pb-3 text-sm leading-5 font-semibold whitespace-nowrap text-blue-950">
                Thanks to Contributor
              </p>
              <img src={contributors} alt="Contributors" className="h-[46px] max-w-[260px] object-contain object-left" />
            </div>

            {COLUMNS.map(({ title, links }) => (
              <div key={title} className="flex flex-col">
                <p className="text-sm leading-5 font-semibold text-blue-950">{title}</p>
                <ul className="flex flex-col pt-3">
                  {links.map((link, i) => (
                    <li key={link} className={i === 0 ? "" : "pt-1"}>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="text-sm leading-5 whitespace-nowrap text-blue-950 hover:text-red-600"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t-[0.556px] border-neutral-200 bg-blue-950">
        <div className="mx-auto flex w-full max-w-[1152px] flex-wrap items-center justify-between gap-4 px-10 py-4 text-xs leading-4 text-white">
          <p>© 2026 Telkomsel AI Marketplace. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

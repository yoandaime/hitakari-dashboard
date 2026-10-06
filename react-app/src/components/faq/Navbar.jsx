import { useState } from "react"
import { Bell, ChevronDown, LayoutDashboard, RotateCcw } from "lucide-react"
import { useNavigate } from "react-router-dom"

import hitakariLogo from "@/assets/faq/hitakari-logo-header.png"
import { getAvatarUrl } from "@/lib/avatar"
import { ResetDemoDataDialog } from "@/components/layout/ResetDemoDataDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LINK_ROUTES = {
  Home: "/landing-page",
  Products: "/product-catalog",
  FAQ: "/faq",
}

// Links that scroll to a section of the landing page instead of opening a route.
const SECTION_LINKS = {
  "About us": "about-us",
}

const DEFAULT_LINKS = ["Home", "About us", "Products", "FAQ"]

export function Navbar({ links = DEFAULT_LINKS, activeLabel = "FAQ", user }) {
  const navigate = useNavigate()
  const [resetOpen, setResetOpen] = useState(false)
  const NAV_LINKS = links.map((label) => ({ label, active: label === activeLabel }))

  return (
    <header className="sticky top-0 z-40 flex h-15 items-center justify-between border-b-[0.556px] border-neutral-200 bg-white px-[88px]">
      <a href="#" className="flex shrink-0 items-center gap-1">
        <img
          src={hitakariLogo}
          alt="Hitakari"
          className="h-[49px] w-[120px] shrink-0 object-cover"
        />
        <span className="flex h-9 w-[116px] items-start pt-1 font-sans text-[18px] font-medium leading-[31.5px] text-black">
          Marketplace
        </span>
      </a>

      <nav className="flex flex-1 items-center justify-center gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={LINK_ROUTES[link.label] ?? "#"}
            onClick={(e) => {
              e.preventDefault()
              const sectionId = SECTION_LINKS[link.label]
              if (sectionId) {
                const el = document.getElementById(sectionId)
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
                else navigate("/landing-page", { state: { scrollTo: sectionId } })
                return
              }
              const route = LINK_ROUTES[link.label]
              if (route) navigate(route)
            }}
            className={
              link.active
                ? "font-batik text-base leading-6 text-red-600"
                : "font-batik text-base leading-6 text-black hover:text-blue-950"
            }
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-[18px]">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex cursor-pointer items-center gap-2 rounded-[10px] bg-white p-1 outline-none hover:bg-neutral-50 data-popup-open:bg-neutral-50"
          >
            {user ? (
              <>
                <img
                  src={getAvatarUrl()}
                  alt={user.name}
                  className="size-[30px] shrink-0 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-black">{user.name}</span>
              </>
            ) : (
              <>
                <img
                  src={getAvatarUrl()}
                  alt="Piero Hincapie"
                  className="size-[30px] shrink-0 rounded-full object-cover"
                />
                <span className="flex flex-col items-start justify-center">
                  <span className="text-sm font-medium text-black">Piero Hincapie</span>
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-purple-700" />
                    <span className="text-[11px] text-purple-700">Super Admin</span>
                  </span>
                </span>
              </>
            )}
            <ChevronDown className="size-5 text-neutral-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-56">
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => navigate("/budgeting-page")}
            >
              <LayoutDashboard className="size-4" />
              Dashboard Management
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setResetOpen(true)}>
              <RotateCcw className="size-4" />
              Reset Demo Data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          className="relative flex size-6 items-center justify-center text-neutral-700"
        >
          <Bell className="size-6" />
          <span className="absolute top-0 right-0 size-1.5 rounded-full bg-red-600" />
        </button>
      </div>
      <ResetDemoDataDialog open={resetOpen} onOpenChange={setResetOpen} />
    </header>
  )
}

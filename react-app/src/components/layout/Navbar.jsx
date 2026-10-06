import { Bell, ChevronDown } from "lucide-react"

import hitakariLogo from "@/assets/faq/hitakari-logo.png"
import { getAvatarUrl } from "@/lib/avatar"

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <a href="#" className="flex shrink-0 items-center">
        <img src={hitakariLogo} alt="Hitakari Marketplace" className="h-8 w-auto" />
      </a>

      <div className="flex shrink-0 items-center gap-5">
        <button type="button" className="flex items-center gap-2 rounded-[10px] bg-white p-1">
          <img
            src={getAvatarUrl()}
            alt="Piero Hincapie"
            className="size-[30px] shrink-0 rounded-full object-cover"
          />
          <span className="flex flex-col items-start">
            <span className="text-xs font-medium text-black">Piero Hincapie</span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-fuchsia-500" />
              <span className="text-[11px] text-fuchsia-700">Super Admin</span>
            </span>
          </span>
          <ChevronDown className="size-4 text-neutral-500" />
        </button>

        <button
          type="button"
          className="relative flex size-6 items-center justify-center text-neutral-700"
        >
          <Bell className="size-5" />
          <span className="absolute top-0 right-0 size-1.5 rounded-full bg-red-600" />
        </button>
      </div>
    </header>
  )
}

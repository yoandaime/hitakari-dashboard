import {
  AppWindow,
  Blocks,
  Bot,
  Brain,
  ChartNoAxesCombined,
  Database,
  RotateCwSquare,
  Search,
  Workflow,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import heroBg from "@/assets/portal/hero-bg.svg"

const CATEGORY_ICONS = {
  Agent: Bot,
  Apps: AppWindow,
  Model: Brain,
  "Data Source": Database,
  Analytics: ChartNoAxesCombined,
  Integration: Workflow,
  Automation: RotateCwSquare,
  Extension: Blocks,
}

export function CatalogHero({ search, onSearchChange, categories, activeCategory, onCategoryChange }) {
  return (
    <section className="relative flex flex-col items-center gap-5 overflow-clip bg-gray-50 px-[72px] py-11">
      <img
        src={heroBg}
        alt=""
        className="pointer-events-none absolute -top-[370px] -left-[170px] h-[675px] w-[481px] max-w-none"
      />

      <div className="relative flex flex-col items-center gap-2.5 text-center">
        <h1 className="font-batik text-[44px] leading-normal font-bold whitespace-nowrap text-blue-950">
          Discover Cool AI Stuff. Build <span className="text-red-600">Smarter. Faster</span>
        </h1>
        <p className="text-base text-black">
          Explore AI Models, Smart Tools, Data Streams, Agent Strategies, and Bundled Solutions, all in
          one in Telkomsel AI Marketplace
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-[616px]">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            aria-label="Search products"
            className="h-10 rounded-lg border-0 bg-white px-3 py-2 text-sm shadow-[0_1px_1.5px_rgb(10_13_18/0.1),0_1px_1px_rgb(10_13_18/0.06)] placeholder:text-neutral-400 dark:bg-white"
          />
          <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-black" />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => onCategoryChange(null)}
            className={cn(
              "h-8 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-normal text-white shadow-xs hover:bg-red-700",
              activeCategory !== null && "border-neutral-300 bg-white text-neutral-950 hover:bg-neutral-100"
            )}
          >
            ALL
          </Button>
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category]
            const active = activeCategory === category
            return (
              <Button
                key={category}
                variant="outline"
                onClick={() => onCategoryChange(active ? null : category)}
                aria-pressed={active}
                className={cn(
                  "h-8 gap-1.5 rounded-lg border-neutral-300 bg-white px-3 py-1.5 text-sm font-normal text-neutral-950 shadow-xs",
                  active && "border-red-600 bg-red-600 text-white hover:bg-red-700 hover:text-white"
                )}
              >
                {Icon && <Icon className="size-4" />}
                {category}
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

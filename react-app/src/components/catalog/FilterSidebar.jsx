import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"

function FilterSection({ section, selected, onToggle }) {
  const [open, setOpen] = useState(section.key === "domains" || section.key === "objectives")
  const Chevron = open ? ChevronDown : ChevronRight

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[30px] w-full cursor-pointer items-center justify-between py-1"
      >
        <span className="text-xs font-semibold text-black">{section.title}</span>
        <Chevron className="size-5 text-black" />
      </button>

      {open && (
        <div className="flex flex-col">
          {section.options.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={selected.includes(option)}
                onCheckedChange={() => onToggle(section.key, option)}
                className="border-[0.66px] border-neutral-400 bg-white data-checked:border-red-600 data-checked:bg-red-600"
              />
              <span className="py-1 text-xs text-neutral-800">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export function FilterSidebar({ sections, selected, onToggle }) {
  return (
    <aside className="flex w-[214px] shrink-0 flex-col gap-4 pt-6 pr-[30px] pl-6">
      {sections.map((section) => (
        <FilterSection
          key={section.key}
          section={section}
          selected={selected[section.key] ?? []}
          onToggle={onToggle}
        />
      ))}
    </aside>
  )
}

import { Funnel, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableHead } from "@/components/ui/table"
import { cn } from "@/lib/utils"

// Table building blocks shared by the Subscription Request and My Subscription pages.

export function SearchInput({ value, onChange }) {
  return (
    <div className="flex min-h-8 w-[260px] items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 shadow-xs">
      <Search className="size-4 shrink-0 text-neutral-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
        className="w-full text-sm text-black outline-none placeholder:text-neutral-500"
      />
    </div>
  )
}

export function HeaderCell({ className, children }) {
  return (
    <TableHead
      className={cn(
        "relative h-11 border-b border-neutral-200 px-1.5 text-xs font-medium text-black/85",
        className
      )}
    >
      {children}
    </TableHead>
  )
}

export function FilterHeader({ label, options, selected, onChange, className }) {
  function toggle(option, checked) {
    onChange(checked ? [...selected, option] : selected.filter((o) => o !== option))
  }

  return (
    <HeaderCell className={className}>
      <div className="flex items-center justify-center gap-0.5">
        <span className="whitespace-nowrap">{label}</span>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Filter ${label}`}
            className="flex h-[22px] w-5 items-center justify-center rounded-sm outline-none hover:bg-neutral-100"
          >
            <Funnel
              className={cn(
                "size-3 fill-current",
                selected.length > 0 ? "text-red-600" : "text-neutral-400"
              )}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {options.map((option) => (
              <DropdownMenuCheckboxItem
                key={option}
                checked={selected.includes(option)}
                onCheckedChange={(checked) => toggle(option, checked)}
              >
                {option}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </HeaderCell>
  )
}

export function BodyCell({ className, ...props }) {
  return (
    <TableCell
      className={cn("px-1.5 py-2 text-xs font-normal text-neutral-800", className)}
      {...props}
    />
  )
}

export function Pagination({ page, totalPages, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-center">
      <Button
        type="button"
        variant="ghost"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="min-h-8 px-3 text-sm text-neutral-700"
      >
        Prev
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          type="button"
          variant={p === page ? "outline" : "ghost"}
          onClick={() => onChange(p)}
          className={cn(
            "min-h-8 w-[34px] px-3 text-sm",
            p === page ? "border-neutral-300 text-neutral-950 shadow-xs" : "text-neutral-700"
          )}
        >
          {p}
        </Button>
      ))}
      <Button
        type="button"
        variant="ghost"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="min-h-8 px-3 text-sm text-neutral-700"
      >
        Next
      </Button>
    </div>
  )
}

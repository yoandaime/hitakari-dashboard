import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatCurrency, formatPercent } from "@/lib/format"

export function StatBar({ items, className }) {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-stretch overflow-hidden rounded-lg border border-neutral-200 bg-white",
        className
      )}
    >
      {items.map((item, i) => (
        <div
          key={item.label ?? i}
          style={item.width ? { width: item.width, flex: `0 0 ${item.width}` } : undefined}
          className={cn(
            "flex min-w-0 flex-col gap-1.5 p-3.5",
            item.width ? "shrink-0" : "flex-1",
            i > 0 && "border-l border-neutral-200"
          )}
        >
          {item.content ?? (
            <>
              <div className="flex items-center gap-1.5">
                {item.icon && (
                  <span className="flex size-4 shrink-0 items-center justify-center text-black">
                    {item.icon}
                  </span>
                )}
                <span className="text-xs font-medium text-black">{item.label}</span>
              </div>
              <span className="flex items-center gap-1.5">
                <span className={cn("font-medium text-neutral-900", item.valueClassName ?? "text-base")}>
                  {item.value}
                </span>
                {item.suffix && <span className="text-xs text-neutral-600">{item.suffix}</span>}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export function InlineBar({ percent, className, trackClassName }) {
  return (
    <div className={cn("flex w-full items-center gap-1.5", className)}>
      <div
        className={cn(
          "h-[7px] min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200",
          trackClassName
        )}
      >
        <div
          className="h-full rounded-full bg-indigo-500"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <span className="text-xs text-black">{percent}%</span>
    </div>
  )
}

export function SpendCell({ spend, total }) {
  const pct = formatPercent(spend, total)
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-baseline gap-0.5 text-xs">
        <span className="font-medium text-black">{formatCurrency(spend)}</span>
        <span className="text-neutral-600">/</span>
        <span className="text-neutral-600">{formatCurrency(total)}</span>
      </span>
      <InlineBar percent={pct} />
    </div>
  )
}

export function TypeBadge({ type }) {
  return (
    <Badge
      variant="outline"
      className="h-auto rounded-lg border-neutral-200 px-2 py-0.5 font-semibold text-black"
    >
      {type}
    </Badge>
  )
}

export function StatusBadge({ status }) {
  const active = status === "Active"
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto rounded-lg px-2 py-0.5 font-medium",
        active ? "border-blue-100 bg-blue-50 text-blue-800" : "border-red-100 bg-red-50 text-red-800"
      )}
    >
      {status}
    </Badge>
  )
}

export function Pagination({ page, totalPages, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-40"
      >
        Previous
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={cn(
            "size-8 rounded-lg text-sm font-medium",
            p === page
              ? "border border-neutral-300 bg-white text-black shadow-xs"
              : "text-neutral-700 hover:bg-neutral-100"
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}

import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const itemClass = "flex size-8 items-center justify-center rounded-md text-sm"

export function CatalogPagination({ page, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={cn(itemClass, "text-black disabled:cursor-not-allowed disabled:text-neutral-300")}
      >
        <ChevronLeft className="size-3" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          aria-current={p === page ? "page" : undefined}
          onClick={() => onPageChange(p)}
          className={cn(
            itemClass,
            p === page ? "bg-red-600 font-semibold text-white" : "text-black/90 hover:bg-neutral-100"
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={cn(itemClass, "text-black disabled:cursor-not-allowed disabled:text-neutral-300")}
      >
        <ChevronRight className="size-3" />
      </button>
    </nav>
  )
}

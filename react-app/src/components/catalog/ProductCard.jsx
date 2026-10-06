import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import bookmarkIcon from "@/assets/portal/bookmark.svg"
import bookmarkActiveIcon from "@/assets/portal/bookmark-active.svg"
import starIcon from "@/assets/portal/star.svg"
import subscribersIcon from "@/assets/portal/subscribers.svg"

export function ProductCard({ product, onToggleBookmark, onOpen, className }) {
  const { name, provider, rating, subscribers, description, tags, labels, logo, bookmarked } = product

  return (
    <Card
      role="link"
      tabIndex={0}
      aria-label={`View ${name} details`}
      onClick={() => onOpen?.(product)}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          onOpen?.(product)
        }
      }}
      className={cn(
        "cursor-pointer gap-4 rounded-xl border border-neutral-100 bg-white p-[18px] ring-0 shadow-[0_4px_4px_rgb(10_13_18/0.1),0_2px_2px_rgb(10_13_18/0.06)] transition-shadow hover:shadow-[0_8px_12px_rgb(10_13_18/0.12),0_2px_4px_rgb(10_13_18/0.06)] focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-none",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <img src={logo} alt={`${name} logo`} className="size-[70px] shrink-0" />
        <button
          type="button"
          aria-label={bookmarked ? `Remove ${name} from bookmarks` : `Bookmark ${name}`}
          aria-pressed={bookmarked}
          onClick={(e) => {
            e.stopPropagation()
            onToggleBookmark?.(product.id)
          }}
          className="size-[30px] shrink-0 cursor-pointer"
        >
          <img src={bookmarked ? bookmarkActiveIcon : bookmarkIcon} alt="" className="size-full" />
        </button>
      </div>

      <div className="flex flex-col">
        <p className="text-base font-semibold text-black">{name}</p>
        <p className="text-[11px] text-neutral-400">{provider}</p>
        <div className="flex items-center gap-1">
          <img src={starIcon} alt="" className="size-[14px]" />
          <span className="text-[11px] text-black">{rating.toFixed(1)}</span>
        </div>
      </div>

      <p className="line-clamp-2 h-9 text-xs leading-[18px] text-neutral-600">{description}</p>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <span className="flex items-center gap-0.5">
            <img src={subscribersIcon} alt="" className="size-[18px]" />
            {subscribers}
          </span>
          <span className="size-1 rounded-full bg-neutral-600" />
          <span className="flex items-center gap-1.5">
            {tags.map((tag, i) => (
              <span key={`${tag}-${i}`}>{tag}</span>
            ))}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {labels.map((label) => (
            <Badge
              key={label}
              variant="secondary"
              className="h-auto rounded-[10px] bg-slate-100 px-2 py-0.5 text-[11px] font-normal text-blue-950"
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  )
}

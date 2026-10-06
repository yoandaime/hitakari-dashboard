import { cn } from "@/lib/utils"

export function MaterialSymbol({ name, filled = false, className, style, ...props }) {
  return (
    <span
      className={cn("material-symbols-rounded", className)}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 20`,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  )
}

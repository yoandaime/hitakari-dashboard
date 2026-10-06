import { Download, FileText } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

export function DetailRow({ label, align = "center", children }) {
  return (
    <div className={cn("flex gap-6 py-[5px]", align === "start" ? "items-start" : "items-center")}>
      <span className="w-[150px] shrink-0 text-xs leading-4 text-neutral-600">{label}</span>
      <div className="min-w-px flex-1 text-xs text-neutral-950">{children}</div>
    </div>
  )
}

export function FileLink({ file }) {
  if (!file) return <span className="text-neutral-500">-</span>
  return (
    <div className="flex items-center gap-1">
      <FileText className="size-5 shrink-0 text-blue-600" />
      <span className="flex items-center gap-[5px]">
        <span className="font-medium text-blue-600">{file.name}</span>
        <span className="text-[11px] text-neutral-500">{file.size}</span>
      </span>
      <button
        type="button"
        aria-label={`Download ${file.name}`}
        onClick={() => toast.info("This feature is under development")}
        className="flex size-[13px] shrink-0 items-center justify-center text-neutral-600 hover:text-neutral-950"
      >
        <Download className="size-[13px]" />
      </button>
    </div>
  )
}

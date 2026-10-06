import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency, formatDateHeading, formatDateTime } from "@/lib/format"

export function HistoryDialog({ open, onOpenChange, entries = [] }) {
  const groups = []
  for (const entry of entries) {
    const heading = formatDateHeading(entry.date)
    let group = groups.find((g) => g.heading === heading)
    if (!group) {
      group = { heading, items: [] }
      groups.push(group)
    }
    group.items.push(entry)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 p-6 sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">History</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[70vh] flex-col gap-3.5 overflow-y-auto">
          {groups.length === 0 && (
            <p className="py-6 text-center text-sm text-neutral-500">
              No budget changes recorded yet.
            </p>
          )}
          {groups.map((group) => (
            <div key={group.heading} className="flex flex-col gap-3.5">
              <div className="text-sm text-black">{group.heading}</div>
              <div className="flex flex-col gap-[18px]">
                {group.items.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col gap-3 rounded-[10px] border border-neutral-200 p-[18px]"
                  >
                    <div className="flex flex-col gap-1 text-sm text-black">
                      <span>Changed budget of {entry.label}</span>
                      <span className="font-semibold">
                        {formatCurrency(entry.from)} → {formatCurrency(entry.to)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-black">
                        {formatDateTime(entry.date)}
                      </span>
                      <span className="text-xs text-neutral-600">by {entry.by}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InlineBar } from "@/components/budgeting/BudgetBits"
import { formatCurrency, formatPercent } from "@/lib/format"

export function EditKeyBudgetDialog({
  open,
  onOpenChange,
  title,
  model,
  keyId,
  spend,
  total,
  entityLabel,
  available,
  reserved,
  reservations = [],
  onSave,
}) {
  const [newBudget, setNewBudget] = useState("")
  const [reason, setReason] = useState("")
  const [showReserved, setShowReserved] = useState(false)

  useEffect(() => {
    if (open) {
      setNewBudget("")
      setReason("")
      setShowReserved(false)
    }
  }, [open])

  const pct = formatPercent(spend, total)
  const afterReserved = Math.max(available - reserved, 0)

  function handleSave() {
    const value = Number.parseFloat(newBudget)
    if (!newBudget || Number.isNaN(value) || value <= 0) {
      toast.error("Enter a valid budget amount.")
      return
    }
    onSave?.(value, reason)
    onOpenChange(false)
    toast.success("Budget updated successfully.")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 p-6 sm:max-w-[480px]">
        <DialogHeader className="gap-1.5">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            {model && <span className="text-sm text-neutral-600">{model}</span>}
            {model && <span className="size-1 rounded-full bg-neutral-300" />}
            <Badge variant="outline" className="h-auto rounded-lg px-2 py-0.5 font-semibold text-black">
              {keyId}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-col gap-4 rounded-xl border border-neutral-200 p-4">
          <div className="flex flex-col gap-1 px-1.5">
            <div className="flex items-start justify-between text-xs text-black">
              <span>Spend/Total Budget</span>
              <span className="flex items-baseline gap-0.5">
                <span className="font-medium text-black">{formatCurrency(spend)}</span>
                <span className="text-neutral-600">/</span>
                <span className="text-neutral-600">{formatCurrency(total)}</span>
              </span>
            </div>
            <InlineBar percent={pct} />
          </div>

          <div className="flex w-full flex-col gap-1.5 rounded-xl border border-neutral-100 bg-neutral-50 p-2">
            <div className="flex items-center justify-between text-xs text-black">
              <span className="font-medium">Available budget in {entityLabel}</span>
              <span>{formatCurrency(available)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-black">
              <span className="font-medium">Budget reserved in {entityLabel}</span>
              <span>-{formatCurrency(reserved)}</span>
            </div>

            {reservations.length > 0 && (
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setShowReserved((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-700"
                >
                  {showReserved ? "Close reserved details" : "Show reserved details"}
                  {showReserved ? (
                    <ChevronUp className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                </button>
                {showReserved && (
                  <div className="flex flex-col gap-1.5 rounded-r-lg border-l-2 border-neutral-500 bg-neutral-100 px-3 py-1.5">
                    {reservations.map((r) => (
                      <div key={r.label} className="flex items-center justify-between text-xs">
                        <span className="text-black">{r.label}&rsquo;s</span>
                        <span className="text-black">-{formatCurrency(r.value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="h-px w-full bg-neutral-200" />

            <div className="flex items-center justify-between text-xs font-medium text-black">
              <span>
                Available budget in {entityLabel} <span className="whitespace-nowrap">(after reserved)</span>
              </span>
              <span className="text-sm">{formatCurrency(afterReserved)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="new-key-budget" className="text-sm font-medium text-black">
            New budget
          </label>
          <div className="flex min-h-9 items-center gap-2 rounded-lg border border-neutral-200 px-3 py-[7.5px] shadow-xs">
            <span className="text-sm text-neutral-500">$</span>
            <input
              id="new-key-budget"
              type="number"
              min="0"
              step="0.01"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder="e.g. 50,445.00"
              className="w-full text-sm text-black outline-none placeholder:text-neutral-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="key-reason" className="text-sm font-medium text-black">
            Reason
          </label>
          <textarea
            id="key-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Type your message here."
            rows={4}
            className="w-full resize-none rounded-lg border border-neutral-200 p-2 text-sm text-black shadow-xs outline-none placeholder:text-neutral-500"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="outline" onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

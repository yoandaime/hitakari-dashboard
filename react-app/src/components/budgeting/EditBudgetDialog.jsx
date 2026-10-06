import { useEffect, useState } from "react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { InlineBar } from "@/components/budgeting/BudgetBits"
import { formatCurrency, formatPercent } from "@/lib/format"

export function EditBudgetDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  contextRows,
  reservedLabel,
  reservedValue,
  budgetLabel,
  allocated,
  total,
  onSave,
}) {
  const [newBudget, setNewBudget] = useState("")
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (open) {
      setNewBudget("")
      setReason("")
    }
  }, [open])

  const pct = formatPercent(allocated, total)

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
          {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        </DialogHeader>

        {contextRows && (
          <div className="flex w-full flex-col gap-1.5 rounded-xl bg-neutral-50 p-3">
            {contextRows.map((row) => (
              <div key={row.label}>
                {row.dividerBefore && <div className="my-1 h-px w-full bg-neutral-200" />}
                <div className="flex items-center justify-between text-xs text-black">
                  <span>{row.label}</span>
                  <span className="text-sm font-medium">{formatCurrency(row.value)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-xl bg-neutral-50 p-3">
          {reservedLabel && (
            <div className="flex items-start justify-between text-xs text-black">
              <span>{reservedLabel}</span>
              <span className="text-sm">{formatCurrency(reservedValue)}</span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between text-xs text-black">
              <span>{budgetLabel}</span>
              <span className="flex items-baseline gap-1 text-sm">
                <span className="text-black">{formatCurrency(allocated)}</span>
                <span className="text-neutral-600">of {formatCurrency(total)}</span>
              </span>
            </div>
            <InlineBar percent={pct} />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="new-budget" className="text-sm font-medium text-black">
            New budget
          </label>
          <div className="flex min-h-9 items-center gap-2 rounded-lg border border-neutral-200 px-3 py-[7.5px] shadow-xs">
            <span className="text-sm text-neutral-500">$</span>
            <input
              id="new-budget"
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
          <label htmlFor="reason" className="text-sm font-medium text-black">
            Reason
          </label>
          <textarea
            id="reason"
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

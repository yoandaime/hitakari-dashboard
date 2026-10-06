import { useState } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"

import { BudgetAvailability } from "@/components/product-detail/BudgetAvailability"
import { PRIMARY_BUTTON_CLASS } from "@/components/product-detail/button-styles"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RESET_OPTIONS } from "@/data/subscription-request-data"
import { formatCurrency, formatLongDateTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import { DetailRow, FileLink } from "./RequestDetailParts"

// Admin / owner step: everything before is read-only, only a reason is added.
// The owner approves the product access itself, so budget details are left out for that stage.
export function ReviewApprovalDialog({ request, stage, open, onOpenChange, onApprove }) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState(false)

  if (!request) return null

  const showBudget = stage !== "owner"
  const superior = request.approvals?.superior
  const approvedBudget = superior?.budget ?? request.budgetRequest
  const resetLabel = RESET_OPTIONS.find((o) => o.value === superior?.reset)?.label ?? "No Reset"

  function handleSubmit(e) {
    e.preventDefault()
    if (!reason.trim()) {
      setError(true)
      toast.error("Please fill in all required fields")
      return
    }
    onApprove(request, stage, { reason: reason.trim() })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/60"
        className={cn(
          "max-h-[calc(100vh-4rem)] gap-0 overflow-y-auto rounded-xl bg-white p-0 shadow-md",
          showBudget ? "sm:max-w-[678px]" : "sm:max-w-[612px]"
        )}
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 p-6">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl leading-6 font-semibold text-neutral-950">
              Would you like to approve this request?
            </DialogTitle>
            <DialogClose
              type="button"
              aria-label="Close"
              className="flex size-6 shrink-0 items-center justify-center text-neutral-950 hover:text-neutral-600"
            >
              <X className="size-6" />
            </DialogClose>
          </div>

          <div className="flex flex-col">
            <DetailRow label="Requestor">
              <div className="flex flex-col">
                <span className="font-medium text-neutral-800">{request.name}</span>
                <span className="text-[11px] text-neutral-600">{request.email}</span>
              </div>
            </DetailRow>
            <DetailRow label="Request Type">{request.requestType}</DetailRow>
            <DetailRow label="Product">{request.product}</DetailRow>
            <DetailRow label="Request Date">
              {formatLongDateTime(new Date(request.requestedAt))}
            </DetailRow>
            <DetailRow label="BR Number">{request.brNumber}</DetailRow>
            <DetailRow label="BR Document">
              <FileLink file={request.brDocument} />
            </DetailRow>
            <DetailRow label="ROI">
              {request.roi}% <span className="text-neutral-600">per {request.roiPeriod}</span>
            </DetailRow>
            <DetailRow label="ROI Document">
              <FileLink file={request.roiDocument} />
            </DetailRow>
            {showBudget && (
              <>
                <DetailRow label="Budget Request">{formatCurrency(request.budgetRequest)}</DetailRow>
                <DetailRow label="Approved Budget">{formatCurrency(approvedBudget)}</DetailRow>
                <DetailRow label="Budget Source">
                  {request.budgetSource}{" "}
                  <span className="text-neutral-600">({request.department})</span>
                </DetailRow>
                <DetailRow label="Budget Reset">{resetLabel}</DetailRow>
                <DetailRow label="Budget Information" align="start">
                  <BudgetAvailability
                    extraReservation={{ name: request.name, amount: approvedBudget }}
                  />
                </DetailRow>
              </>
            )}
            <DetailRow label="Objective / reason" align="start">
              <p className="rounded-lg bg-neutral-50 p-2 text-neutral-700">{request.objective}</p>
            </DetailRow>
            <DetailRow
              label={
                <>
                  Approval Reason<span className="text-red-500">*</span>
                </>
              }
              align="start"
            >
              <Textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value)
                  setError(false)
                }}
                aria-invalid={error || undefined}
                placeholder="Type your message here."
                className="min-h-[110px] border-neutral-200 bg-white p-2 text-sm leading-5 shadow-xs placeholder:text-neutral-500"
              />
            </DetailRow>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 min-h-9 border-neutral-300 bg-white px-4 text-sm text-neutral-950 shadow-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn("h-9 rounded-lg border-0 px-4 text-sm", PRIMARY_BUTTON_CLASS)}
            >
              Approve
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

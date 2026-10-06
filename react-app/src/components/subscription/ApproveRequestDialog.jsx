import { useState } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"

import { BudgetAvailability } from "@/components/product-detail/BudgetAvailability"
import { PRIMARY_BUTTON_CLASS } from "@/components/product-detail/button-styles"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { formatCurrency, formatLongDateTime } from "@/lib/format"
import { RESET_OPTIONS } from "@/data/subscription-request-data"
import { DetailRow, FileLink } from "./RequestDetailParts"

function RequestDetails({ request }) {
  return (
    <div className="flex w-[510px] shrink-0 flex-col">
      <DetailRow label="Requestor">
        <div className="flex flex-col">
          <span className="font-medium text-neutral-800">{request.name}</span>
          <span className="text-[11px] text-neutral-600">{request.email}</span>
        </div>
      </DetailRow>
      <DetailRow label="Request Type">{request.requestType}</DetailRow>
      <DetailRow label="Product">{request.product}</DetailRow>
      <DetailRow label="Request Date">{formatLongDateTime(new Date(request.requestedAt))}</DetailRow>

      <Separator className="my-2 bg-neutral-200" />

      <DetailRow label="Budget Request">{formatCurrency(request.budgetRequest)}</DetailRow>
      <DetailRow label="Budget Source">
        {request.budgetSource} <span className="text-neutral-600">({request.department})</span>
      </DetailRow>

      <Separator className="my-2 bg-neutral-200" />

      <DetailRow label="BR Document">
        <FileLink file={request.brDocument} />
      </DetailRow>
      <DetailRow label="BR Number">{request.brNumber}</DetailRow>

      <Separator className="my-2 bg-neutral-200" />

      <DetailRow label="ROI">
        {request.roi}% <span className="text-neutral-600">per {request.roiPeriod}</span>
      </DetailRow>
      <DetailRow label="ROI Document">
        <FileLink file={request.roiDocument} />
      </DetailRow>

      <Separator className="my-2 bg-neutral-200" />

      <DetailRow label="Objective / reason" align="start">
        <p className="rounded-lg bg-neutral-50 p-2 text-neutral-700">{request.objective}</p>
      </DetailRow>
    </div>
  )
}

function Field({ label, htmlFor, hint, children }) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={htmlFor} className="text-sm leading-5 font-medium text-neutral-950">
        <span>
          {label}
          <span className="text-red-600">*</span>
        </span>
      </Label>
      {children}
      {hint && <p className="text-xs leading-4 text-black/45">{hint}</p>}
    </div>
  )
}

export function ApproveRequestDialog({ request, open, onOpenChange, onApprove }) {
  // The two dialogs share one form state, so closing the confirm step keeps what was typed.
  const [step, setStep] = useState("form")
  const [budget, setBudget] = useState(request ? request.budgetRequest.toFixed(2) : "")
  const [reset, setReset] = useState("monthly")
  const [reason, setReason] = useState("")
  const [errors, setErrors] = useState({})

  function close() {
    onOpenChange(false)
    setStep("form")
  }

  function handleContinue(e) {
    e.preventDefault()
    const nextErrors = {
      budget: !(parseFloat(budget) > 0),
      reason: !reason.trim(),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      toast.error("Please fill in all required fields")
      return
    }
    setStep("confirm")
  }

  function handleConfirm() {
    onApprove(request, { budget: parseFloat(budget), reset, reason: reason.trim() })
    close()
  }

  if (!request) return null

  const budgetValue = parseFloat(budget) || 0
  const resetLabel = RESET_OPTIONS.find((o) => o.value === reset).label

  return (
    <>
      <Dialog open={open && step === "form"} onOpenChange={(next) => !next && close()}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/60"
          className="max-h-[calc(100vh-4rem)] gap-0 overflow-y-auto rounded-xl bg-white p-0 shadow-md sm:max-w-[1074px]"
        >
          <form onSubmit={handleContinue} noValidate className="flex flex-col gap-6 p-6">
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

            <div className="flex items-start gap-6">
              <RequestDetails request={request} />

              <div className="flex min-w-px flex-1 flex-col gap-6 self-stretch rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm leading-5 font-medium text-neutral-900">
                    Set budget for product
                  </p>
                  <BudgetAvailability />
                </div>

                <Field
                  label="Budget to Approve"
                  htmlFor="budget-to-approve"
                  hint="This will be the final budget for this subscription"
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-neutral-500">
                      $
                    </span>
                    <Input
                      id="budget-to-approve"
                      inputMode="decimal"
                      value={budget}
                      onChange={(e) => {
                        setBudget(e.target.value)
                        setErrors((prev) => ({ ...prev, budget: false }))
                      }}
                      aria-invalid={errors.budget || undefined}
                      className="min-h-9 border-neutral-200 bg-white py-[7.5px] pr-3 pl-7 text-sm shadow-xs"
                    />
                  </div>
                </Field>

                <Field label="Reset Budget" htmlFor="reset-budget">
                  <Select value={reset} onValueChange={setReset} items={RESET_OPTIONS}>
                    <SelectTrigger
                      id="reset-budget"
                      className="min-h-9 w-full border-neutral-200 bg-white px-3 shadow-xs"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      {RESET_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Approval Reason" htmlFor="approval-reason">
                  <Textarea
                    id="approval-reason"
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value)
                      setErrors((prev) => ({ ...prev, reason: false }))
                    }}
                    aria-invalid={errors.reason || undefined}
                    placeholder="Type your message here."
                    className="min-h-[89px] border-neutral-200 bg-white p-2 text-sm leading-5 shadow-xs placeholder:text-neutral-500"
                  />
                </Field>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={close}
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

      <Dialog open={open && step === "confirm"} onOpenChange={(next) => !next && close()}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/60"
          className="gap-6 rounded-xl bg-white p-6 shadow-md sm:max-w-[600px]"
        >
          <DialogTitle className="text-center text-xl leading-6 font-semibold text-neutral-950">
            Confirm Approval
          </DialogTitle>
          <p className="text-center text-sm leading-5 text-neutral-950">
            You&apos;re about to approve this request with a budget of{" "}
            <span className="font-bold">{formatCurrency(budgetValue)}</span>, ({resetLabel})
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("form")}
              className="h-9 min-h-9 border-neutral-300 bg-white px-4 text-sm text-neutral-950 shadow-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className={cn("h-9 rounded-lg border-0 px-4 text-sm", PRIMARY_BUTTON_CLASS)}
            >
              Confirm &amp; Approve
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

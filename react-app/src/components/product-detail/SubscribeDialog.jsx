import { useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { CURRENT_USER } from "@/data/current-user"
import { addSubscriptionRequest } from "@/lib/subscription-requests"
import { BUDGET } from "@/data/department-budget"
import { BudgetAvailability } from "./BudgetAvailability"
import { PRIMARY_BUTTON_CLASS } from "./button-styles"

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_FILES = ".pdf,.docx"

const BUDGET_OPTIONS = [
  {
    value: "personal",
    title: "Personal Use",
    description: "Budget shared across your Department Teams",
  },
  {
    value: "business",
    title: "Business Use",
    description: "Budget shared across Product Teams",
  },
]

const RADIO_CLASS =
  "border-neutral-300 bg-white data-checked:border-red-600 data-checked:bg-white data-checked:text-red-600 dark:bg-white dark:data-checked:bg-white [&_[data-slot=radio-group-indicator]_span]:bg-red-600"

const INITIAL_FORM = {
  brNumber: "",
  roiPeriod: "month",
  roi: "",
  budgetType: "personal",
  requestBudget: "",
  reason: "",
}

function toFileInfo(file) {
  return { name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` }
}

function FieldLabel({ htmlFor, required, className, children }) {
  return (
    <Label htmlFor={htmlFor} className={cn("text-sm leading-5 font-medium text-neutral-950", className)}>
      <span>
        {children}
        {required && <span className="text-red-500">*</span>}
      </span>
    </Label>
  )
}

function UploadZone({ id, file, invalid, onChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function accept(selected) {
    if (!selected) return
    const extension = selected.name.split(".").pop().toLowerCase()
    if (!["pdf", "docx"].includes(extension)) {
      toast.error("Only PDF or DOCX files are supported")
      return
    }
    if (selected.size > MAX_FILE_SIZE) {
      toast.error("File is larger than 10MB")
      return
    }
    onChange(selected)
  }

  return (
    <label
      htmlFor={id}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        accept(e.dataTransfer.files?.[0])
      }}
      className={cn(
        "flex h-9 min-h-9 w-full cursor-pointer items-center gap-3 overflow-clip rounded-[10px] border border-dashed border-neutral-300 bg-neutral-50 p-2",
        invalid && "border-red-500",
        dragging && "border-red-600 bg-red-50"
      )}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_FILES}
        className="sr-only"
        onChange={(e) => accept(e.target.files?.[0])}
      />
      <Upload className="size-[18px] shrink-0 text-neutral-900" />
      <span className="flex min-w-px flex-1 items-start gap-2 text-xs leading-4 whitespace-nowrap">
        <span className="truncate font-medium text-neutral-900">
          {file ? file.name : "Upload or drag & drop"}
        </span>
        <span className="shrink-0 text-neutral-600">
          {file ? toFileInfo(file).size : "PDF, DOCX — max 10MB"}
        </span>
      </span>
    </label>
  )
}

export function SubscribeDialog({ open, onOpenChange, product }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [brFile, setBrFile] = useState(null)
  const [roiFile, setRoiFile] = useState(null)
  const [errors, setErrors] = useState({})

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: false }))
  }

  function handleOpenChange(next) {
    onOpenChange(next)
    if (!next) {
      setForm(INITIAL_FORM)
      setBrFile(null)
      setRoiFile(null)
      setErrors({})
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {
      brNumber: !form.brNumber.trim(),
      brFile: !brFile,
      roi: !form.roi.trim(),
      requestBudget: !form.requestBudget.trim(),
      reason: !form.reason.trim(),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      toast.error("Please fill in all required fields")
      return
    }
    addSubscriptionRequest({
      name: CURRENT_USER.name,
      email: CURRENT_USER.email,
      product: product.name,
      productType: product.type,
      budgetRequest: parseFloat(form.requestBudget.replace(/[^0-9.]/g, "")) || 0,
      budgetSource: BUDGET_OPTIONS.find((o) => o.value === form.budgetType).title,
      department: BUDGET.department,
      brNumber: form.brNumber.trim(),
      brDocument: toFileInfo(brFile),
      roiPeriod: form.roiPeriod,
      roi: parseFloat(form.roi) || 0,
      roiDocument: roiFile ? toFileInfo(roiFile) : null,
      objective: form.reason.trim(),
    })
    toast.success("Your access request has been submitted")
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/60"
        className="max-h-[calc(100vh-6rem)] gap-0 overflow-y-auto rounded-xl bg-white p-0 shadow-md sm:max-w-[781px]"
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 p-6">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl leading-6 font-semibold text-neutral-950">
              Submit your access request
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
            <div className="flex min-w-px flex-1 flex-col gap-1">
              <FieldLabel htmlFor="br-number" required>
                BR Number
              </FieldLabel>
              <Input
                id="br-number"
                value={form.brNumber}
                onChange={(e) => update("brNumber", e.target.value)}
                aria-invalid={errors.brNumber || undefined}
                placeholder="e.g. BR0000000163224"
                className="min-h-9 rounded-[10px] border-neutral-200 bg-white px-3 py-[7.5px] text-sm shadow-xs placeholder:text-neutral-500"
              />
            </div>
            <div className="flex min-w-px flex-1 flex-col gap-1">
              <FieldLabel htmlFor="br-document" required>
                BR Document
              </FieldLabel>
              <UploadZone
                id="br-document"
                file={brFile}
                invalid={errors.brFile}
                onChange={(file) => {
                  setBrFile(file)
                  setErrors((prev) => ({ ...prev, brFile: false }))
                }}
              />
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex min-w-px flex-1 flex-col gap-1">
              <div className="flex h-6 items-center gap-3">
                <FieldLabel required>ROI</FieldLabel>
                <div className="flex items-center gap-2">
                  <span className="text-xs leading-4 text-neutral-950">Period:</span>
                  <RadioGroup
                    value={form.roiPeriod}
                    onValueChange={(value) => update("roiPeriod", value)}
                    className="flex w-auto flex-row items-center gap-3.5"
                  >
                    {[
                      { value: "month", label: "Month" },
                      { value: "year", label: "Year" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex h-6 cursor-pointer items-center gap-2 text-sm leading-5 text-neutral-700"
                      >
                        <RadioGroupItem value={option.value} className={RADIO_CLASS} />
                        {option.label}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              <div className="relative">
                <Input
                  inputMode="decimal"
                  value={form.roi}
                  onChange={(e) => update("roi", e.target.value)}
                  aria-invalid={errors.roi || undefined}
                  aria-label="ROI"
                  placeholder="e.g 78"
                  className="min-h-9 rounded-[10px] border-neutral-200 bg-white py-[7.5px] pr-8 pl-3 text-sm shadow-xs placeholder:text-neutral-500"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-neutral-500">
                  %
                </span>
              </div>
              <p className="py-px text-sm leading-[22px] text-black/45">
                Enter your ROI as a percentage for the period you selected above
              </p>
            </div>
            <div className="flex min-w-px flex-1 flex-col gap-1">
              <div className="flex h-6 items-center">
                <FieldLabel htmlFor="roi-document">ROI Document</FieldLabel>
              </div>
              <UploadZone id="roi-document" file={roiFile} onChange={setRoiFile} />
              <p className="text-sm leading-[22px] text-black/45">
                Upload proof of your ROI calculation to speed up review
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <FieldLabel required>Select budget to use</FieldLabel>
              <p className="text-xs leading-4 text-neutral-600">
                Please choose which budget to use for this subscription.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <RadioGroup
                value={form.budgetType}
                onValueChange={(value) => update("budgetType", value)}
                className="flex w-full flex-row items-stretch gap-3.5"
              >
                {BUDGET_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex min-w-px flex-1 cursor-pointer items-start gap-3 rounded-[10px] border border-neutral-200 bg-white px-3 py-3"
                  >
                    <span className="flex items-center pt-[2.5px]">
                      <RadioGroupItem value={option.value} className={RADIO_CLASS} />
                    </span>
                    <span className="flex min-w-px flex-1 flex-col gap-1.5">
                      <span className="text-sm leading-5 font-medium text-neutral-700">
                        {option.title}
                      </span>
                      <span className="text-xs leading-4 text-neutral-500">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </RadioGroup>

              <div className="flex min-h-9 items-center rounded-lg border border-neutral-200 bg-white px-3 py-[7.5px] text-sm leading-5 text-neutral-600 shadow-xs">
                {BUDGET.department}
              </div>

              <BudgetAvailability title="Budget availability" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="request-budget" required>
              Request Budget
            </FieldLabel>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-neutral-500">
                $
              </span>
              <Input
                id="request-budget"
                inputMode="decimal"
                value={form.requestBudget}
                onChange={(e) => update("requestBudget", e.target.value)}
                aria-invalid={errors.requestBudget || undefined}
                placeholder="e.g. 100"
                className="min-h-9 border-neutral-200 bg-white py-[7.5px] pr-3 pl-7 text-sm shadow-xs placeholder:text-neutral-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="approval-reason" required>
              Approval Reason
            </FieldLabel>
            <Textarea
              id="approval-reason"
              value={form.reason}
              onChange={(e) => update("reason", e.target.value)}
              aria-invalid={errors.reason || undefined}
              placeholder="Type your reason for subscribing to this product"
              className="min-h-[89px] border-neutral-200 bg-white p-2 text-sm leading-5 shadow-xs placeholder:text-neutral-500"
            />
          </div>

          <div className="flex items-center justify-end gap-4">
            <DialogClose
              type="button"
              render={
                <Button
                  variant="outline"
                  className="h-9 min-h-9 border-neutral-300 bg-white px-4 text-sm text-neutral-950 shadow-xs"
                />
              }
            >
              Cancel
            </DialogClose>
            <Button
              type="submit"
              className={cn("h-9 rounded-lg border-0 px-3 text-sm", PRIMARY_BUTTON_CLASS)}
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

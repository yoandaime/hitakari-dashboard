import { Check, Clock9, Minus, OctagonX, X } from "lucide-react"

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { STAGES, WAITING_LABEL_BY_STAGE } from "@/data/subscription-request-data"
import { formatLongDateTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import { DetailRow } from "./RequestDetailParts"

const STAGE_LABELS = {
  superior: "Superior Approval",
  admin: "Admin Approval",
  owner: "Owner Approval",
}

const STATE_VIEW = {
  approved: { label: "Approved", icon: Check, dot: "bg-emerald-700 text-white" },
  rejected: { label: "Rejected", icon: OctagonX, dot: "bg-red-600 text-white" },
  waiting: { label: null, icon: Clock9, dot: "bg-amber-400 text-amber-900" },
  idle: { label: "Not reached", icon: Minus, dot: "bg-neutral-200 text-neutral-500" },
}

// A stage after a rejection is never reached, a stage before the current one is just not started.
function getStageView(request, stage) {
  const state = request.statuses[stage]
  if (state) return state
  return "idle"
}

function TraceStep({ request, stage, last }) {
  const state = getStageView(request, stage)
  const view = STATE_VIEW[state]
  const Icon = view.icon
  const decision = request.decisions?.[stage]
  const reason = request.approvals?.[stage]?.reason
  const isSelf = decision?.by === request.name

  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {!last && <span className="absolute top-6 bottom-0 left-3 w-px -translate-x-1/2 bg-neutral-200" />}
      <span
        className={cn("z-10 flex size-6 shrink-0 items-center justify-center rounded-full", view.dot)}
      >
        <Icon className="size-3.5" />
      </span>
      <div className="flex min-w-px flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm leading-5 font-medium text-neutral-950">
            {STAGE_LABELS[stage]}
          </span>
          <span className="text-xs leading-4 font-medium text-neutral-700">
            {view.label ?? WAITING_LABEL_BY_STAGE[stage]}
          </span>
        </div>
        {decision && (
          <span className="text-xs leading-4 text-neutral-600">
            {isSelf ? `${decision.by} (you, self-decision)` : decision.by} ·{" "}
            {formatLongDateTime(new Date(decision.at))}
          </span>
        )}
        {reason && <p className="text-xs leading-4 text-neutral-950">“{reason}”</p>}
      </div>
    </li>
  )
}

export function TraceDialog({ request, open, onOpenChange }) {
  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/60"
        className="max-h-[calc(100vh-4rem)] gap-0 overflow-y-auto rounded-xl bg-white p-0 shadow-md sm:max-w-[520px]"
      >
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl leading-6 font-semibold text-neutral-950">
              Subscription Trace
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
            <DetailRow label="Product">{request.product}</DetailRow>
            <DetailRow label="Subscription ID">{request.subscriptionId}</DetailRow>
            <DetailRow label="Request Date">
              {formatLongDateTime(new Date(request.requestedAt))}
            </DetailRow>
          </div>

          <ol className="flex flex-col">
            {STAGES.map((stage, i) => (
              <TraceStep
                key={stage}
                request={request}
                stage={stage}
                last={i === STAGES.length - 1}
              />
            ))}
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  )
}

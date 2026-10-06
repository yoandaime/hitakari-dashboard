import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { BUDGET, BUDGET_VALUES } from "@/data/department-budget"
import { formatCurrency } from "@/lib/format"

// `extraReservation` ({ name, amount }) adds the request being reviewed to the reserved list.
export function BudgetAvailability({ title, extraReservation }) {
  const [showReserved, setShowReserved] = useState(true)

  const reservations = extraReservation
    ? [
        { name: `${extraReservation.name}’s`, amount: `-${formatCurrency(extraReservation.amount)}` },
        ...BUDGET.reservations,
      ]
    : BUDGET.reservations
  const reserved = extraReservation
    ? `-${formatCurrency(BUDGET_VALUES.reserved + extraReservation.amount)}`
    : BUDGET.reserved
  const availableAfterReserved = extraReservation
    ? formatCurrency(BUDGET_VALUES.available - BUDGET_VALUES.reserved - extraReservation.amount)
    : BUDGET.availableAfterReserved

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4">
      {title && <p className="text-sm leading-5 font-medium text-neutral-950">{title}</p>}
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between whitespace-nowrap">
          <p className="text-xs leading-4 text-neutral-950">Allocated/Total Department Budget</p>
          <p className="flex gap-0.5 text-sm leading-5">
            <span className="font-medium text-neutral-950">{BUDGET.allocated}</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-600">{BUDGET.total}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            role="progressbar"
            aria-valuenow={BUDGET.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="flex-1 overflow-clip rounded-full bg-gray-200"
          >
            <div
              className="h-[7px] rounded-full bg-indigo-500"
              style={{ width: `${BUDGET.percent}%` }}
            />
          </div>
          <span className="text-xs leading-4 text-neutral-950">{BUDGET.percent}%</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-100 bg-neutral-50 p-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs leading-4 text-neutral-950">
            <span className="font-medium">Available budget in department</span>
            <span>{BUDGET.available}</span>
          </div>
          <div className="flex items-center justify-between text-xs leading-4 text-neutral-950">
            <span className="font-medium">Total budget reserved</span>
            <span>{reserved}</span>
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setShowReserved((prev) => !prev)}
              className="flex w-fit items-center gap-1.5 text-xs leading-4 font-medium text-blue-700"
            >
              {showReserved ? "Close reserved details" : "Show reserved details"}
              {showReserved ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </button>
            {showReserved && (
              <div className="flex flex-col gap-1.5 rounded-r-lg border-l-2 border-neutral-500 bg-neutral-100 px-3 py-1.5 text-xs leading-4">
                {reservations.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-black">{item.name}</span>
                    <span className="text-neutral-950">{item.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Separator className="bg-neutral-200" />
        </div>
        <div className="flex items-center justify-between font-medium text-neutral-950">
          <span className="text-xs leading-4">Available budget in department (after reserved)</span>
          <span className="text-sm leading-5">{availableAfterReserved}</span>
        </div>
      </div>
    </div>
  )
}

import { cloneElement, useMemo, useState } from "react"
import { MoreVertical } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BodyCell, FilterHeader, HeaderCell, Pagination, SearchInput } from "@/components/subscription/TableParts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ApproveRequestDialog } from "@/components/subscription/ApproveRequestDialog"
import { ReviewApprovalDialog } from "@/components/subscription/ReviewApprovalDialog"
import {
  APPROVAL_TABS,
  PRODUCT_TYPES,
  REQUEST_TYPES,
  STATUSES,
  isDeveloped,
} from "@/data/subscription-request-data"
import { formatDateTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import {
  approveAtStage,
  getStageStatusLabel,
  rejectAtStage,
  useSubscriptionRequests,
} from "@/lib/subscription-requests"

const PAGE_SIZE = 10

const PRODUCT_TYPE_STYLES = {
  Model: "border-violet-50 bg-violet-50 text-violet-900",
  REST: "border-sky-50 bg-sky-50 text-sky-900",
}

const STATUS_STYLES = {
  Approved: "bg-emerald-700 text-white",
  "Waiting Admin": "bg-amber-400 text-amber-900",
  "Waiting Owner": "bg-amber-400 text-amber-900",
  "Waiting Superior": "bg-amber-400 text-amber-900",
  Rejected: "bg-red-600 text-white",
}

function TabsTop({ tabs, value, onChange }) {
  return (
    <div role="tablist" className="flex items-end gap-8">
      {tabs.map((tab) => {
        const active = tab.key === value
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={cn(
              "relative py-3 text-sm transition-colors",
              active ? "text-red-600" : "text-black/85 hover:text-red-600"
            )}
          >
            {tab.label}
            {active && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-600" />}
          </button>
        )
      })}
    </div>
  )
}

function ActionCell({ request, disabled, onApprove, onReject }) {
  const { status } = request
  return (
    <BodyCell className="px-2">
      <div className="flex items-center justify-end gap-1.5">
        {status.startsWith("Waiting") && (
          <>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="px-2 shadow-xs"
              disabled={disabled}
              onClick={() => onReject(request)}
            >
              Reject
            </Button>
            <Button
              type="button"
              size="xs"
              className="bg-red-600 px-2 text-white hover:bg-red-700"
              disabled={disabled}
              onClick={() => onApprove(request)}
            >
              Approve
            </Button>
          </>
        )}
        {status === "Approved" && (
          <span className="px-2 text-xs font-medium text-neutral-700">Approved</span>
        )}
        {status === "Rejected" && (
          <span className="px-2 text-xs font-medium text-red-600">Rejected</span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="More actions"
            disabled={disabled}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-neutral-900 outline-none hover:bg-neutral-100 disabled:pointer-events-none"
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast.info("This feature is under development")}>
              View details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </BodyCell>
  )
}

export default function SubscriptionRequest() {
  const allRequests = useSubscriptionRequests()
  const [tab, setTab] = useState(APPROVAL_TABS[0].key)
  const [approveTarget, setApproveTarget] = useState(null)
  const [search, setSearch] = useState("")
  const [requestTypeFilter, setRequestTypeFilter] = useState([])
  const [productTypeFilter, setProductTypeFilter] = useState([])
  const [statusFilter, setStatusFilter] = useState([])
  const [page, setPage] = useState(1)

  // A request lives in several tabs; each tab shows it with that stage's own status.
  const stageRequests = useMemo(
    () =>
      allRequests
        .filter((r) => r.statuses[tab])
        .map((r) => ({ ...r, stage: tab, status: getStageStatusLabel(r, tab) })),
    [allRequests, tab]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return stageRequests.filter((r) => {
      if (requestTypeFilter.length && !requestTypeFilter.includes(r.requestType)) return false
      if (productTypeFilter.length && !productTypeFilter.includes(r.productType)) return false
      if (statusFilter.length && !statusFilter.includes(r.status)) return false
      if (!q) return true
      return [r.name, r.email, r.product, r.subscriptionId].some((v) =>
        v.toLowerCase().includes(q)
      )
    })
  }, [stageRequests, search, requestTypeFilter, productTypeFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const pageRows = filtered.slice(start, start + PAGE_SIZE)

  function withPageReset(setter) {
    return (value) => {
      setter(value)
      setPage(1)
    }
  }

  function handleReject(request) {
    rejectAtStage(request.id, request.stage)
    toast.success(`Request from ${request.name} rejected.`)
  }

  function handleApproved(request, stage, approval) {
    approveAtStage(request.id, stage, approval)
    toast.success(`Request from ${request.name} approved.`)
  }

  return (
    <div className="-m-6 flex flex-col">
      <div className="flex flex-col gap-3 bg-white px-6 pt-4.5 shadow-[0_1px_1.5px_rgba(10,13,18,0.1),0_1px_1px_rgba(10,13,18,0.06)]">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-sm font-semibold text-neutral-950">Subscription Request</h1>
          <p className="text-xs text-neutral-600">
            View and manage new subscriptions and additional key requests here
          </p>
        </div>
        <TabsTop tabs={APPROVAL_TABS} value={tab} onChange={withPageReset(setTab)} />
      </div>

      <div className="flex flex-col gap-3 p-6">
        <SearchInput value={search} onChange={withPageReset(setSearch)} />

        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <TooltipProvider>
          <Table className="table-fixed">
            <colgroup>
              <col className="w-10" />
              <col className="w-[176px]" />
              <col className="w-[148px]" />
              <col className="w-[126px]" />
              <col className="w-[130px]" />
              <col className="w-[113px]" />
              <col className="w-[116px]" />
              <col className="w-[135px]" />
              <col className="w-[176px]" />
            </colgroup>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <HeaderCell className="text-center">
                  No
                </HeaderCell>
                <HeaderCell>Name</HeaderCell>
                <HeaderCell>Product requested</HeaderCell>
                <HeaderCell>Subscription ID</HeaderCell>
                <FilterHeader
                  label="Request Type"
                  options={REQUEST_TYPES}
                  selected={requestTypeFilter}
                  onChange={withPageReset(setRequestTypeFilter)}
                />
                <FilterHeader
                  label="Product Type"
                  options={PRODUCT_TYPES}
                  selected={productTypeFilter}
                  onChange={withPageReset(setProductTypeFilter)}
                />
                <FilterHeader
                  label="Status"
                  options={STATUSES}
                  selected={statusFilter}
                  onChange={withPageReset(setStatusFilter)}
                />
                <HeaderCell className="text-center">Requested Date</HeaderCell>
                <HeaderCell className="text-center">Action</HeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-sm text-neutral-500">
                    No requests found.
                  </TableCell>
                </TableRow>
              )}
              {pageRows.map((r, i) => {
                const disabled = !isDeveloped(r)
                const rowClassName = cn(
                  "h-[60px] border-neutral-200",
                  disabled && "opacity-50 select-none hover:bg-transparent"
                )
                const row = (
                <TableRow
                  key={r.id}
                  aria-disabled={disabled || undefined}
                  className={disabled ? undefined : rowClassName}
                >
                  <BodyCell className="text-center">{start + i + 1}.</BodyCell>
                  <BodyCell>
                    <div className="flex flex-col justify-center">
                      <span className="text-xs font-medium text-neutral-800">{r.name}</span>
                      <span className="text-[11px] font-normal text-neutral-600">{r.email}</span>
                    </div>
                  </BodyCell>
                  <BodyCell className="overflow-hidden text-ellipsis" title={r.product}>
                    {r.product}
                  </BodyCell>
                  <BodyCell className="overflow-hidden text-ellipsis">{r.subscriptionId}</BodyCell>
                  <BodyCell>
                    <div className="flex justify-center">
                      <Badge variant="outline" className="rounded-full">
                        {r.requestType}
                      </Badge>
                    </div>
                  </BodyCell>
                  <BodyCell>
                    <div className="flex justify-center">
                      <Badge
                        variant="outline"
                        className={cn("rounded-full", PRODUCT_TYPE_STYLES[r.productType])}
                      >
                        {r.productType}
                      </Badge>
                    </div>
                  </BodyCell>
                  <BodyCell>
                    <div className="flex justify-center">
                      <Badge
                        className={cn("rounded-lg leading-4", STATUS_STYLES[r.status])}
                      >
                        {r.status}
                      </Badge>
                    </div>
                  </BodyCell>
                  <BodyCell className="text-center">{formatDateTime(new Date(r.requestedAt))}</BodyCell>
                  <ActionCell
                    request={r}
                    disabled={disabled}
                    onApprove={setApproveTarget}
                    onReject={handleReject}
                  />
                </TableRow>
                )
                if (!disabled) return row
                return (
                  <Tooltip key={r.id}>
                    <TooltipTrigger render={cloneElement(row, { className: rowClassName })} />
                    <TooltipContent>Prototype for this flow is under development</TooltipContent>
                  </Tooltip>
                )
              })}
            </TableBody>
          </Table>
          </TooltipProvider>
        </div>

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </div>

      {approveTarget?.stage === "superior" ? (
        <ApproveRequestDialog
          key={approveTarget.id}
          request={approveTarget}
          open
          onOpenChange={(open) => !open && setApproveTarget(null)}
          onApprove={(request, approval) => handleApproved(request, "superior", approval)}
        />
      ) : (
        <ReviewApprovalDialog
          key={approveTarget?.id}
          request={approveTarget}
          stage={approveTarget?.stage}
          open={approveTarget !== null}
          onOpenChange={(open) => !open && setApproveTarget(null)}
          onApprove={handleApproved}
        />
      )}
    </div>
  )
}

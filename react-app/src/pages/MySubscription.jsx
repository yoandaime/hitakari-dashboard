import { useMemo, useState } from "react"
import { BadgeCheck, Check, Clock9, MoreVertical, OctagonX } from "lucide-react"
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
import {
  BodyCell,
  FilterHeader,
  HeaderCell,
  Pagination,
  SearchInput,
} from "@/components/subscription/TableParts"
import { TraceDialog } from "@/components/subscription/TraceDialog"
import { CURRENT_USER } from "@/data/current-user"
import { formatDateTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import { getOverallStatus, useSubscriptionRequests } from "@/lib/subscription-requests"

const PAGE_SIZE = 10
const PRODUCT_TYPES = ["Model", "REST"]
const STATUS_OPTIONS = ["Waiting", "Approved", "Rejected"]

const PRODUCT_TYPE_STYLES = {
  Model: "border-violet-50 bg-violet-50 text-violet-900",
  REST: "border-sky-50 bg-sky-50 text-sky-900",
}

const STATUS_STYLES = {
  Approved: "bg-emerald-700 text-white",
  Waiting: "bg-amber-400 text-amber-900",
  Rejected: "bg-red-600 text-white",
}

function SummaryCard({ icon: Icon, title, children }) {
  return (
    <div className="flex min-w-px flex-1 flex-col gap-2.5 rounded-lg border border-neutral-200 bg-white p-2.5">
      <div className="flex items-center gap-1.5">
        <Icon className="size-4 shrink-0 text-neutral-950" />
        <span className="text-xs leading-4 font-medium text-neutral-600">{title}</span>
      </div>
      <div className="h-px w-full bg-neutral-200" />
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}

function Count({ value, label, className }) {
  return (
    <div className={cn("flex items-center gap-1 whitespace-nowrap", className)}>
      <span className="text-xl leading-6 font-semibold text-black">{value}</span>
      <span className="text-sm leading-5 text-neutral-950">{label}</span>
    </div>
  )
}

export default function MySubscription() {
  const allRequests = useSubscriptionRequests()
  const [search, setSearch] = useState("")
  const [productTypeFilter, setProductTypeFilter] = useState([])
  const [statusFilter, setStatusFilter] = useState([])
  const [page, setPage] = useState(1)
  const [traceTarget, setTraceTarget] = useState(null)

  const mine = useMemo(
    () =>
      allRequests
        .filter((r) => r.name === CURRENT_USER.name && r.requestType === "New Subscription")
        .map((r) => ({ ...r, overall: getOverallStatus(r) }))
        .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)),
    [allRequests]
  )

  const summary = useMemo(() => {
    const count = (fn) => mine.filter(fn).length
    return {
      total: mine.length,
      models: count((r) => r.productType === "Model"),
      rest: count((r) => r.productType === "REST"),
      approved: count((r) => r.overall === "Approved"),
      waiting: count((r) => r.overall === "Waiting"),
      rejected: count((r) => r.overall === "Rejected"),
    }
  }, [mine])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return mine.filter((r) => {
      if (productTypeFilter.length && !productTypeFilter.includes(r.productType)) return false
      if (statusFilter.length && !statusFilter.includes(r.overall)) return false
      if (!q) return true
      return [r.product, r.subscriptionId, r.objective].some((v) => v.toLowerCase().includes(q))
    })
  }, [mine, search, productTypeFilter, statusFilter])

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-5">
        <SummaryCard icon={BadgeCheck} title="Total Subscription">
          <Count value={summary.total} label="Product" className="flex-1" />
          <div className="flex items-start justify-end gap-2">
            <Badge className="border-violet-50 bg-violet-50 text-violet-900">
              {summary.models} Models
            </Badge>
            <Badge className="border-sky-50 bg-sky-50 text-sky-900">{summary.rest} REST</Badge>
          </div>
        </SummaryCard>
        <SummaryCard icon={Check} title="Approved">
          <Count value={summary.approved} label="Active & accessible" />
        </SummaryCard>
        <SummaryCard icon={Clock9} title="Waiting">
          <Count value={summary.waiting} label="Pending review" />
        </SummaryCard>
        <SummaryCard icon={OctagonX} title="Rejected">
          <Count value={summary.rejected} label="Rejected" />
        </SummaryCard>
      </div>

      <SearchInput value={search} onChange={withPageReset(setSearch)} />

      <div className="overflow-hidden rounded-xl border border-neutral-200">
        <Table className="table-fixed">
          <colgroup>
            <col className="w-10" />
            <col className="w-[160px]" />
            <col className="w-[140px]" />
            <col className="w-[240px]" />
            <col className="w-[200px]" />
            <col className="w-[113px]" />
            <col className="w-[142px]" />
            <col className="w-[106px]" />
          </colgroup>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <HeaderCell className="text-center">No</HeaderCell>
              <HeaderCell>Product</HeaderCell>
              <HeaderCell>Subscription ID</HeaderCell>
              <HeaderCell>Subscribe Reason</HeaderCell>
              <FilterHeader
                label="Tags"
                options={PRODUCT_TYPES}
                selected={productTypeFilter}
                onChange={withPageReset(setProductTypeFilter)}
              />
              <FilterHeader
                label="Status"
                options={STATUS_OPTIONS}
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
                <TableCell colSpan={8} className="py-10 text-center text-sm text-neutral-500">
                  No subscriptions found.
                </TableCell>
              </TableRow>
            )}
            {pageRows.map((r, i) => (
              <TableRow key={r.id} className="h-12 border-neutral-200">
                <BodyCell className="text-center">{start + i + 1}.</BodyCell>
                <BodyCell className="overflow-hidden text-ellipsis" title={r.product}>
                  {r.product}
                </BodyCell>
                <BodyCell className="overflow-hidden text-ellipsis" title={r.subscriptionId}>
                  {r.subscriptionId}
                </BodyCell>
                <BodyCell className="overflow-hidden text-ellipsis" title={r.objective}>
                  {r.objective}
                </BodyCell>
                <BodyCell>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("rounded-full", PRODUCT_TYPE_STYLES[r.productType])}
                    >
                      {r.productType}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="rounded-full border-green-50 bg-green-50 text-green-900"
                    >
                      {r.budgetSource}
                    </Badge>
                  </div>
                </BodyCell>
                <BodyCell>
                  <div className="flex justify-center">
                    <Badge className={cn("rounded-lg leading-4", STATUS_STYLES[r.overall])}>
                      {r.overall}
                    </Badge>
                  </div>
                </BodyCell>
                <BodyCell className="text-center">
                  {formatDateTime(new Date(r.requestedAt))}
                </BodyCell>
                <BodyCell className="px-2">
                  <div className="flex items-center justify-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-2 shadow-xs"
                      onClick={() => setTraceTarget(r)}
                    >
                      Trace
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label="More actions"
                        className="flex size-6 shrink-0 items-center justify-center rounded-md text-neutral-900 outline-none hover:bg-neutral-100"
                      >
                        <MoreVertical className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => toast.info("This feature is under development")}
                        >
                          View details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </BodyCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />

      <TraceDialog
        key={traceTarget?.id}
        request={traceTarget}
        open={traceTarget !== null}
        onOpenChange={(open) => !open && setTraceTarget(null)}
      />
    </div>
  )
}

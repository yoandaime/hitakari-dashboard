import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  ChevronRight,
  Download,
  History as HistoryIcon,
  MoreVertical,
  Pencil,
  Search,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { MaterialSymbol } from "@/components/ui/material-symbol"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InlineBar,
  Pagination,
  SpendCell,
  StatBar,
  StatusBadge,
  TypeBadge,
} from "@/components/budgeting/BudgetBits"
import { EditBudgetDialog } from "@/components/budgeting/EditBudgetDialog"
import { EditKeyBudgetDialog } from "@/components/budgeting/EditKeyBudgetDialog"
import { HistoryDialog } from "@/components/budgeting/HistoryDialog"
import { DIVISIONS as INITIAL_DIVISIONS } from "@/data/budgeting-data"
import { loadDivisions, saveDivisions } from "@/lib/budgeting-storage"
import { formatCurrency, formatPercent } from "@/lib/format"

const PAGE_SIZE = 5

function downloadCsv(filename, rows, columns) {
  const header = columns.map((c) => c.label).join(",")
  const body = rows
    .map((row) => columns.map((c) => `"${String(c.value(row)).replace(/"/g, '""')}"`).join(","))
    .join("\n")
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function usePagedData(rows, page, setPage) {
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const pageRows = rows.slice(start, start + PAGE_SIZE)
  return { pageRows, totalPages, safePage, start }
}

function Breadcrumb({ items, onBack }) {
  return (
    <div className="flex items-center gap-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex size-6 items-center justify-center rounded-sm text-neutral-700 hover:bg-neutral-100"
        >
          <ArrowLeft className="size-4" />
        </button>
      )}
      <div className="flex items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5 text-neutral-400" />}
              {isLast || !item.onClick ? (
                <span className={isLast ? "font-normal text-black" : "text-neutral-500"}>
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="text-neutral-500 hover:text-black"
                >
                  {item.label}
                </button>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function Toolbar({ search, onSearch, onExport }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex w-[260px] items-center gap-1.5 rounded-lg border border-neutral-200 px-2 py-1.5 shadow-xs">
        <Search className="size-4 shrink-0 text-neutral-500" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search..."
          className="w-full text-sm text-black outline-none placeholder:text-neutral-500"
        />
      </div>
      <Button type="button" variant="outline" onClick={onExport} className="gap-1.5">
        <Download className="size-4" />
        Export data
      </Button>
    </div>
  )
}

function AllocatedBudgetCell({ label, allocated, total, onEdit }) {
  const pct = formatPercent(allocated, total)
  return (
    <div className="flex w-full flex-col justify-between gap-2">
      <div className="flex w-full items-start justify-between gap-2">
        <span className="text-xs font-medium text-black">{label}</span>
        <Button type="button" variant="outline" size="xs" onClick={onEdit} className="gap-1">
          <Pencil className="size-3" />
          Edit Budget
        </Button>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <span className="flex items-baseline gap-0.5 text-xs">
          <span className="font-medium text-black">{formatCurrency(allocated)}</span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-600">{formatCurrency(total)}</span>
        </span>
        <InlineBar percent={pct} />
      </div>
    </div>
  )
}

export default function BudgetingPage() {
  const [divisions, setDivisions] = useState(() => loadDivisions(INITIAL_DIVISIONS))

  useEffect(() => {
    saveDivisions(divisions)
  }, [divisions])
  const [view, setView] = useState({ level: "divisions" })

  const [divisionSearch, setDivisionSearch] = useState("")
  const [divisionPage, setDivisionPage] = useState(1)
  const [teamSearch, setTeamSearch] = useState("")
  const [teamPage, setTeamPage] = useState(1)
  const [keySearch, setKeySearch] = useState("")
  const [keyPage, setKeyPage] = useState(1)

  const [editTarget, setEditTarget] = useState(null)
  const [keyEditTarget, setKeyEditTarget] = useState(null)
  const [historyTarget, setHistoryTarget] = useState(null)

  const division = view.divisionId ? divisions.find((d) => d.id === view.divisionId) : null
  const team = division && view.teamId ? division.teams.find((t) => t.id === view.teamId) : null

  function goToDivisions() {
    setView({ level: "divisions" })
  }
  function goToTeams(divisionId) {
    setTeamSearch("")
    setTeamPage(1)
    setView({ level: "teams", divisionId })
  }
  function goToKeys(divisionId, teamId) {
    setKeySearch("")
    setKeyPage(1)
    setView({ level: "keys", divisionId, teamId })
  }

  function updateDivisionBudget(divisionId, newTotal, reason) {
    setDivisions((prev) =>
      prev.map((d) => {
        if (d.id !== divisionId) return d
        const historyEntry = {
          id: `${d.id}-hist-${Date.now()}`,
          label: d.name,
          from: d.totalBudget,
          to: newTotal,
          date: new Date(),
          by: "you@telkomsel.co.id",
          reason,
        }
        return { ...d, totalBudget: newTotal, history: [historyEntry, ...d.history] }
      })
    )
  }

  function updateTeamBudget(divisionId, teamId, newTotal, reason) {
    setDivisions((prev) =>
      prev.map((d) => {
        if (d.id !== divisionId) return d
        return {
          ...d,
          teams: d.teams.map((t) => {
            if (t.id !== teamId) return t
            const historyEntry = {
              id: `${t.id}-hist-${Date.now()}`,
              label: t.name,
              from: t.totalBudget,
              to: newTotal,
              date: new Date(),
              by: "you@telkomsel.co.id",
              reason,
            }
            return { ...t, totalBudget: newTotal, history: [historyEntry, ...t.history] }
          }),
        }
      })
    )
  }

  function updateKeyBudget(divisionId, teamId, keyId, newBudget, reason) {
    setDivisions((prev) =>
      prev.map((d) => {
        if (d.id !== divisionId) return d
        return {
          ...d,
          teams: d.teams.map((t) => {
            if (t.id !== teamId) return t
            return {
              ...t,
              keys: t.keys.map((k) => {
                if (k.id !== keyId) return k
                const historyEntry = {
                  id: `${k.id}-hist-${Date.now()}`,
                  label: `${k.model} · ${k.keyName}`,
                  from: k.budget,
                  to: newBudget,
                  date: new Date(),
                  by: "you@telkomsel.co.id",
                  reason,
                }
                return { ...k, budget: newBudget, history: [historyEntry, ...k.history] }
              }),
            }
          }),
        }
      })
    )
  }

  function toggleKeyStatus(divisionId, teamId, keyId) {
    setDivisions((prev) =>
      prev.map((d) => {
        if (d.id !== divisionId) return d
        return {
          ...d,
          teams: d.teams.map((t) => {
            if (t.id !== teamId) return t
            return {
              ...t,
              keys: t.keys.map((k) =>
                k.id === keyId
                  ? { ...k, status: k.status === "Active" ? "Inactive" : "Active" }
                  : k
              ),
            }
          }),
        }
      })
    )
  }

  function resetKeySpend(divisionId, teamId, keyId) {
    setDivisions((prev) =>
      prev.map((d) => {
        if (d.id !== divisionId) return d
        return {
          ...d,
          teams: d.teams.map((t) => {
            if (t.id !== teamId) return t
            return {
              ...t,
              keys: t.keys.map((k) => (k.id === keyId ? { ...k, spend: 0 } : k)),
            }
          }),
        }
      })
    )
    toast.success("Spend reset to $0.00.")
  }

  function deleteKey(divisionId, teamId, keyId) {
    setDivisions((prev) =>
      prev.map((d) => {
        if (d.id !== divisionId) return d
        return {
          ...d,
          teams: d.teams.map((t) => {
            if (t.id !== teamId) return t
            return { ...t, keys: t.keys.filter((k) => k.id !== keyId) }
          }),
        }
      })
    )
    toast.success("Key deleted.")
  }

  // ── LEVEL 1 — Division Overview ──────────────────────────────
  const filteredDivisions = useMemo(
    () => divisions.filter((d) => d.name.toLowerCase().includes(divisionSearch.toLowerCase())),
    [divisions, divisionSearch]
  )
  const divisionsPaged = usePagedData(filteredDivisions, divisionPage, setDivisionPage)

  const totalAllBudget = divisions.reduce((s, d) => s + d.totalBudget, 0)
  const totalAllAllocated = divisions.reduce((s, d) => s + d.allocated, 0)
  const totalAllSpend = divisions.reduce((s, d) => s + d.spend, 0)

  function renderDivisionOverview() {
    return (
      <div className="-mt-6 flex flex-col gap-5 pt-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-sm font-semibold text-black">Division Overview</h1>
          <p className="text-xs text-neutral-600">Manage budget across all divisions</p>
        </div>

        <StatBar
          items={[
            { label: "Total Divsion", value: divisions.length },
            {
              label: "Total All Division Budget",
              value: formatCurrency(totalAllBudget),
              icon: <MaterialSymbol name="paid" filled className="text-base" />,
            },
            {
              label: "Total All Division Allocated",
              value: formatCurrency(totalAllAllocated),
              icon: <MaterialSymbol name="receipt" filled className="text-base" />,
            },
            {
              label: "Total All Division Spend",
              value: formatCurrency(totalAllSpend),
              icon: <MaterialSymbol name="wallet" filled className="text-base" />,
            },
          ]}
        />

        <Toolbar
          search={divisionSearch}
          onSearch={(v) => {
            setDivisionSearch(v)
            setDivisionPage(1)
          }}
          onExport={() =>
            downloadCsv("division-overview.csv", filteredDivisions, [
              { label: "Division", value: (d) => d.name },
              { label: "Total Budget", value: (d) => d.totalBudget.toFixed(2) },
              { label: "Allocated", value: (d) => d.allocated.toFixed(2) },
              { label: "Spend", value: (d) => d.spend.toFixed(2) },
            ])
          }
        />

        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <Table className="table-fixed">
            <colgroup>
              <col className="w-10" />
              <col className="w-60" />
              <col />
              <col />
              <col className="w-[261px]" />
              <col />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead className="h-11 text-xs font-medium text-black/85">No</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85">Division</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85 text-center">Total Budget</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85 text-center">Allocated</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85">Spend/Allocated</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {divisionsPaged.pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-neutral-500">
                    No divisions found.
                  </TableCell>
                </TableRow>
              )}
              {divisionsPaged.pageRows.map((d, i) => (
                <TableRow key={d.id} className="h-14">
                  <TableCell className="text-xs font-normal">{divisionsPaged.start + i + 1}.</TableCell>
                  <TableCell className="text-black text-xs font-normal">{d.name}</TableCell>
                  <TableCell className="text-center text-xs font-normal">{formatCurrency(d.totalBudget)}</TableCell>
                  <TableCell className="text-center text-xs font-normal">{formatCurrency(d.allocated)}</TableCell>
                  <TableCell className="align-bottom text-xs font-normal">
                    <SpendCell spend={d.spend} total={d.allocated} />
                  </TableCell>
                  <TableCell className="text-center text-xs font-normal">
                    <Button variant="outline" size="sm" className="px-2 shadow-xs" onClick={() => goToTeams(d.id)}>
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination
          page={divisionsPaged.safePage}
          totalPages={divisionsPaged.totalPages}
          onChange={setDivisionPage}
        />
      </div>
    )
  }

  // ── LEVEL 2 — Teams inside Division ──────────────────────────
  const filteredTeams = useMemo(() => {
    if (!division) return []
    return division.teams.filter((t) => t.name.toLowerCase().includes(teamSearch.toLowerCase()))
  }, [division, teamSearch])
  const teamsPaged = usePagedData(filteredTeams, teamPage, setTeamPage)

  function renderTeams() {
    const deptCount = division.teams.filter((t) => t.type === "Department").length
    const prodCount = division.teams.filter((t) => t.type === "Product Name").length

    return (
      <div className="-mt-6 flex flex-col gap-5 pt-3.5">
        <div className="flex items-center justify-between">
          <Breadcrumb
            onBack={goToDivisions}
            items={[
              { label: "Budgeting", onClick: goToDivisions },
              { label: `${division.name} Teams` },
            ]}
          />
          <Button
            type="button"
            variant="outline"
            className="gap-1.5"
            onClick={() =>
              setHistoryTarget({ title: division.name, entries: division.history })
            }
          >
            <HistoryIcon className="size-4" />
            History
          </Button>
        </div>

        <StatBar
          className="min-h-[90px]"
          items={[
            {
              width: "450px",
              content: (
                <AllocatedBudgetCell
                  label="Allocated/Total Division Budget"
                  allocated={division.allocated}
                  total={division.totalBudget}
                  onEdit={() =>
                    setEditTarget({
                      mode: "division",
                      title: "Edit division budget",
                      subtitle: division.name,
                      budgetLabel: "Allocated/Total Division Budget",
                      reservedLabel: "Budget Reserved",
                      reservedValue: division.reserved,
                      allocated: division.allocated,
                      total: division.totalBudget,
                      divisionId: division.id,
                    })
                  }
                />
              ),
            },
            {
              label: "Spend",
              value: formatCurrency(division.spend),
              icon: <MaterialSymbol name="wallet" filled className="text-base" />,
            },
            {
              label: "Reserved",
              value: formatCurrency(division.reserved),
              icon: <MaterialSymbol name="credit_card_clock" filled className="text-base" />,
            },
            {
              label: "Department Teams",
              value: deptCount,
              suffix: "Total",
              icon: <MaterialSymbol name="domain" filled className="text-base" />,
            },
            {
              label: "Product Teams",
              value: prodCount,
              suffix: "Total",
              icon: <MaterialSymbol name="local_mall" filled className="text-base" />,
            },
          ]}
        />

        <Toolbar
          search={teamSearch}
          onSearch={(v) => {
            setTeamSearch(v)
            setTeamPage(1)
          }}
          onExport={() =>
            downloadCsv(`${division.id}-teams.csv`, filteredTeams, [
              { label: "Name", value: (t) => t.name },
              { label: "Type", value: (t) => t.type },
              { label: "Total Budget", value: (t) => t.totalBudget.toFixed(2) },
              { label: "Allocated", value: (t) => t.allocated.toFixed(2) },
              { label: "Spend", value: (t) => t.spend.toFixed(2) },
              { label: "Reserved", value: (t) => t.reserved.toFixed(2) },
            ])
          }
        />

        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <Table className="table-fixed">
            <colgroup>
              <col className="w-10" />
              <col className="w-[206px]" />
              <col className="w-[122px]" />
              <col />
              <col />
              <col className="w-[246px]" />
              <col />
              <col />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead className="h-11 text-xs font-medium text-black/85">No</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85">Name</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85 text-center">Teams Type</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85 text-center">Total Budget</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85 text-center">Allocated</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85">Spend/Allocated</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85 text-center">Reserved</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamsPaged.pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-neutral-500">
                    No teams found.
                  </TableCell>
                </TableRow>
              )}
              {teamsPaged.pageRows.map((t, i) => (
                <TableRow key={t.id} className="h-14">
                  <TableCell className="text-xs font-normal">{teamsPaged.start + i + 1}.</TableCell>
                  <TableCell className="truncate text-black text-xs font-normal">{t.name}</TableCell>
                  <TableCell className="text-center text-xs font-normal">
                    <TypeBadge type={t.type === "Product Name" ? "Product Team" : t.type} />
                  </TableCell>
                  <TableCell className="text-center text-xs font-normal">{formatCurrency(t.totalBudget)}</TableCell>
                  <TableCell className="text-center text-xs font-normal">{formatCurrency(t.allocated)}</TableCell>
                  <TableCell className="align-bottom text-xs font-normal">
                    <SpendCell spend={t.spend} total={t.allocated} />
                  </TableCell>
                  <TableCell className="text-center text-xs font-normal">{formatCurrency(t.reserved)}</TableCell>
                  <TableCell className="text-center text-xs font-normal">
                    <Button variant="outline" size="sm" className="px-2 shadow-xs" onClick={() => goToKeys(division.id, t.id)}>
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination
          page={teamsPaged.safePage}
          totalPages={teamsPaged.totalPages}
          onChange={setTeamPage}
        />
      </div>
    )
  }

  // ── LEVEL 3 — Keys inside Team ────────────────────────────────
  const filteredKeys = useMemo(() => {
    if (!team) return []
    const term = keySearch.toLowerCase()
    return team.keys.filter(
      (k) =>
        k.user.name.toLowerCase().includes(term) ||
        k.model.toLowerCase().includes(term) ||
        k.keyName.toLowerCase().includes(term)
    )
  }, [team, keySearch])
  const keysPaged = usePagedData(filteredKeys, keyPage, setKeyPage)

  function renderKeys() {
    const isDepartment = team.type === "Department"
    const totalUsers = new Set(team.keys.map((k) => k.user.email)).size
    const activeKeys = team.keys.filter((k) => k.status === "Active").length
    const inactiveKeys = team.keys.filter((k) => k.status === "Inactive").length
    const budgetLabel = isDepartment ? "Department" : "Product"
    const keyEntityLabel = isDepartment ? "department" : "product team"
    const availableInDivision = Math.max(division.allocated - division.spend, 0)
    const availableInTeam = Math.max(team.allocated - team.spend, 0)

    return (
      <div className="-mt-6 flex flex-col gap-5 pt-3.5">
        <div className="flex items-center justify-between">
          <Breadcrumb
            onBack={() => goToTeams(division.id)}
            items={[
              { label: "Budgeting", onClick: goToDivisions },
              { label: `${division.name} Teams`, onClick: () => goToTeams(division.id) },
              { label: team.name },
            ]}
          />
          <Button
            type="button"
            variant="outline"
            className="gap-1.5"
            onClick={() => setHistoryTarget({ title: team.name, entries: team.history })}
          >
            <HistoryIcon className="size-4" />
            History
          </Button>
        </div>

        <StatBar
          className="min-h-[90px]"
          items={[
            {
              width: isDepartment ? "371px" : "356px",
              content: (
                <AllocatedBudgetCell
                  label={`Allocated/Total ${budgetLabel} Budget`}
                  allocated={team.allocated}
                  total={team.totalBudget}
                  onEdit={() =>
                    setEditTarget({
                      mode: "team",
                      title: `Edit ${budgetLabel.toLowerCase()} budget`,
                      subtitle: team.name,
                      contextRows: [
                        { label: "Available budget in division", value: availableInDivision },
                        { label: "Budget reserved in division", value: division.reserved },
                        {
                          label: "Available Budget in Division (after reserved)",
                          value: Math.max(availableInDivision - division.reserved, 0),
                          dividerBefore: true,
                        },
                      ],
                      budgetLabel: `Allocated/Total ${budgetLabel} Budget`,
                      reservedLabel: `Budget reserved in ${budgetLabel.toLowerCase()}`,
                      reservedValue: team.reserved,
                      allocated: team.allocated,
                      total: team.totalBudget,
                      divisionId: division.id,
                      teamId: team.id,
                    })
                  }
                />
              ),
            },
            {
              label: "Spend",
              value: formatCurrency(team.spend),
              valueClassName: "text-lg",
              icon: <MaterialSymbol name="wallet" filled className="text-base" />,
            },
            {
              label: "Reserved",
              value: formatCurrency(team.reserved),
              valueClassName: "text-lg",
              icon: <MaterialSymbol name="credit_card_clock" filled className="text-base" />,
            },
            {
              label: "Total User",
              value: totalUsers,
              suffix: "Users",
              valueClassName: "text-lg",
              icon: <MaterialSymbol name="group" filled className="text-base" />,
            },
            {
              label: "Active Key",
              value: activeKeys,
              suffix: "Keys",
              valueClassName: "text-lg",
              icon: <MaterialSymbol name="key" filled className="text-base" />,
            },
            {
              label: "Inactive Key",
              value: inactiveKeys,
              suffix: "Keys",
              valueClassName: "text-lg",
              icon: <MaterialSymbol name="key_off" filled className="text-base" />,
            },
          ]}
        />

        <Toolbar
          search={keySearch}
          onSearch={(v) => {
            setKeySearch(v)
            setKeyPage(1)
          }}
          onExport={() =>
            downloadCsv(`${team.id}-keys.csv`, filteredKeys, [
              { label: "User", value: (k) => k.user.name },
              { label: "Email", value: (k) => k.user.email },
              ...(isDepartment ? [{ label: "Model", value: (k) => k.model }] : []),
              { label: "Key Name", value: (k) => k.keyName },
              { label: "Key ID", value: (k) => k.keyId },
              { label: "Status", value: (k) => k.status },
              { label: "Spend", value: (k) => k.spend.toFixed(2) },
              { label: "Budget", value: (k) => k.budget.toFixed(2) },
            ])
          }
        />

        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <Table className="table-fixed">
            <colgroup>
              <col className="w-10" />
              <col className="w-[210px]" />
              {isDepartment && <col className="w-[142px]" />}
              <col className={isDepartment ? "w-24" : "w-[123px]"} />
              <col className={isDepartment ? "w-[139px]" : "w-[166px]"} />
              <col className="w-28" />
              <col className={isDepartment ? undefined : "w-[263px]"} />
              <col className={isDepartment ? "w-[222px]" : "w-[232px]"} />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead className="h-11 text-xs font-medium text-black/85">No</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85">User</TableHead>
                {isDepartment && <TableHead className="h-11 text-xs font-medium text-black/85">Model Name</TableHead>}
                <TableHead className="h-11 text-xs font-medium text-black/85 text-center">Key Name</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85">Key ID</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85 text-center">Key Status</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85">Spend/Total Budget</TableHead>
                <TableHead className="h-11 text-xs font-medium text-black/85 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keysPaged.pageRows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={isDepartment ? 8 : 7}
                    className="py-10 text-center text-neutral-500"
                  >
                    No keys found.
                  </TableCell>
                </TableRow>
              )}
              {keysPaged.pageRows.map((k, i) => (
                <TableRow key={k.id} className="h-14">
                  <TableCell className="text-xs font-normal">{keysPaged.start + i + 1}.</TableCell>
                  <TableCell className="text-xs font-normal">
                    <div className="flex flex-col">
                      <span className="truncate font-medium text-black">{k.user.name}</span>
                      <span className="truncate text-xs text-neutral-500">{k.user.email}</span>
                    </div>
                  </TableCell>
                  {isDepartment && <TableCell className="truncate text-xs font-normal">{k.model}</TableCell>}
                  <TableCell className="text-center text-xs font-normal">{k.keyName}</TableCell>
                  <TableCell className="text-xs font-normal">
                    <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-600">
                      {k.keyId.slice(0, 14)}…
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-xs font-normal">
                    <StatusBadge status={k.status} />
                  </TableCell>
                  <TableCell className="align-bottom text-xs font-normal">
                    <SpendCell spend={k.spend} total={k.budget} />
                  </TableCell>
                  <TableCell className="text-center text-xs font-normal">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2 shadow-xs"
                        onClick={() => {
                          const otherKeys = team.keys.filter((other) => other.id !== k.id)
                          setKeyEditTarget({
                            title: "Edit key budget",
                            model: isDepartment ? k.model : null,
                            keyId: k.keyId,
                            spend: k.spend,
                            total: k.budget,
                            entityLabel: keyEntityLabel,
                            available: availableInTeam,
                            reserved: otherKeys.reduce((sum, ok) => sum + ok.spend, 0),
                            reservations: otherKeys.map((ok) => ({
                              label: ok.user.name,
                              value: ok.spend,
                            })),
                            divisionId: division.id,
                            teamId: team.id,
                            keyRecordId: k.id,
                          })
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 px-2 shadow-xs"
                        onClick={() =>
                          setHistoryTarget({
                            title: `${k.model} · ${k.keyName}`,
                            entries: k.history,
                          })
                        }
                      >
                        <HistoryIcon className="size-4" />
                        History
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
                            onClick={() => resetKeySpend(division.id, team.id, k.id)}
                          >
                            Reset spend
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleKeyStatus(division.id, team.id, k.id)}
                          >
                            {k.status === "Active" ? "Revoke Key" : "Activate Key"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => deleteKey(division.id, team.id, k.id)}
                          >
                            <Trash2 className="size-4" />
                            Delete key
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination
          page={keysPaged.safePage}
          totalPages={keysPaged.totalPages}
          onChange={setKeyPage}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {view.level === "divisions" && renderDivisionOverview()}
      {view.level === "teams" && division && renderTeams()}
      {view.level === "keys" && division && team && renderKeys()}

      <EditBudgetDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        title={editTarget?.title}
        subtitle={editTarget?.subtitle}
        contextRows={editTarget?.contextRows}
        budgetLabel={editTarget?.budgetLabel}
        reservedLabel={editTarget?.reservedLabel}
        reservedValue={editTarget?.reservedValue ?? 0}
        allocated={editTarget?.allocated ?? 0}
        total={editTarget?.total ?? 0}
        onSave={(newValue, reason) => {
          if (!editTarget) return
          if (editTarget.mode === "division") {
            updateDivisionBudget(editTarget.divisionId, newValue, reason)
          } else if (editTarget.mode === "team") {
            updateTeamBudget(editTarget.divisionId, editTarget.teamId, newValue, reason)
          }
        }}
      />

      <EditKeyBudgetDialog
        open={!!keyEditTarget}
        onOpenChange={(open) => !open && setKeyEditTarget(null)}
        title={keyEditTarget?.title}
        model={keyEditTarget?.model}
        keyId={keyEditTarget?.keyId}
        spend={keyEditTarget?.spend ?? 0}
        total={keyEditTarget?.total ?? 0}
        entityLabel={keyEditTarget?.entityLabel}
        available={keyEditTarget?.available ?? 0}
        reserved={keyEditTarget?.reserved ?? 0}
        reservations={keyEditTarget?.reservations ?? []}
        onSave={(newValue, reason) => {
          if (!keyEditTarget) return
          updateKeyBudget(
            keyEditTarget.divisionId,
            keyEditTarget.teamId,
            keyEditTarget.keyRecordId,
            newValue,
            reason
          )
        }}
      />

      <HistoryDialog
        open={!!historyTarget}
        onOpenChange={(open) => !open && setHistoryTarget(null)}
        entries={historyTarget?.entries ?? []}
      />
    </div>
  )
}

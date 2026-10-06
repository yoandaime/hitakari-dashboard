import { useMemo, useState } from "react"
import { ChevronDown, CircleCheckBig, Funnel, Search, User } from "lucide-react"
import { toast } from "sonner"

import { MaterialSymbol } from "@/components/ui/material-symbol"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ASSIGNABLE_ROLES,
  INITIAL_USERS,
  ROLE_INFO_CARDS,
} from "@/data/role-management-data"
import { getAvatarUrl } from "@/lib/avatar"
import { cn } from "@/lib/utils"

const CARD_ICON_STYLES = {
  fuchsia: "bg-fuchsia-100 text-fuchsia-700",
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-100 text-emerald-700",
  indigo: "bg-indigo-50 text-indigo-700",
}

const BADGE_STYLES = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-800",
  fuchsia: "bg-fuchsia-100 text-fuchsia-700",
}

const DOT_STYLES = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-600",
  fuchsia: "bg-fuchsia-600",
}

const ROLES_BY_KEY = Object.fromEntries(ASSIGNABLE_ROLES.map((r) => [r.key, r]))

function RoleInfoCard({ card }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-[25px] shadow-xs">
      <div className="flex flex-col gap-3 border-b border-neutral-200 pb-[17px]">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-md",
            CARD_ICON_STYLES[card.tone]
          )}
        >
          <User className="size-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-[#0f1724]">{card.title}</h3>
          <p className="text-xs text-neutral-900">{card.subtitle}</p>
        </div>
      </div>
      <ul className="flex flex-col gap-2.5">
        {card.permissions.map((p) => (
          <li key={p.label} className="flex items-start gap-2.5">
            <span className="flex items-center pt-0.5">
              <CircleCheckBig className="size-3.5 text-neutral-700" />
            </span>
            <span
              className={cn(
                "min-w-0 flex-1 text-xs leading-4 text-black",
                p.strong ? "font-medium" : "font-normal"
              )}
            >
              {p.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SearchInput({ value, onChange }) {
  return (
    <div className="flex min-h-8 w-[257px] items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 shadow-xs">
      <Search className="size-4 shrink-0 text-neutral-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
        className="w-full text-sm text-black outline-none placeholder:text-neutral-500"
      />
    </div>
  )
}

function HeaderCell({ className, children }) {
  return (
    <TableHead
      className={cn(
        "h-11 border-b border-neutral-200 bg-white px-1.5 text-xs font-medium text-black/85",
        className
      )}
    >
      {children}
    </TableHead>
  )
}

function RoleBadge({ role }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1.5 rounded-lg px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
        BADGE_STYLES[role.tone]
      )}
    >
      <MaterialSymbol name="account_circle" filled className="text-[14px]" />
      {role.label}
    </span>
  )
}

function RoleAssignmentCell({ user, onAssign }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(user.roles)

  function handleOpenChange(next) {
    if (next) setDraft(user.roles)
    setOpen(next)
  }

  function toggle(key) {
    setDraft((d) => (d.includes(key) ? d.filter((k) => k !== key) : [...d, key]))
  }

  function handleAssign() {
    onAssign(user.id, draft)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className="flex w-full cursor-pointer items-center justify-between gap-2 pr-20 pl-5 text-left outline-none"
        aria-label={`Assign role for ${user.name}`}
      >
        <span className="flex items-center gap-1">
          {user.roles.length === 0 ? (
            <span className="text-xs font-semibold text-neutral-400">Assign Role</span>
          ) : (
            user.roles.map((key) => <RoleBadge key={key} role={ROLES_BY_KEY[key]} />)
          )}
        </span>
        <ChevronDown className="size-5 shrink-0 text-neutral-900" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={4}
        className="w-[320px] gap-0 rounded-xl bg-white p-1 shadow-[0_12px_16px_-4px_rgba(10,13,18,0.1),0_4px_6px_-2px_rgba(10,13,18,0.05)] ring-0 border border-neutral-200"
      >
        <div className="flex flex-col gap-0.5 p-1">
          {ASSIGNABLE_ROLES.map((role) => {
            const selected = draft.includes(role.key)
            return (
              <button
                key={role.key}
                type="button"
                role="checkbox"
                aria-checked={selected}
                onClick={() => toggle(role.key)}
                className={cn(
                  "flex min-h-8 w-full items-center gap-2 rounded-md px-2 py-[5.5px] text-left text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-100",
                  selected && "bg-neutral-100"
                )}
              >
                <span className={cn("size-2.5 shrink-0 rounded-full", DOT_STYLES[role.tone])} />
                {role.label}
              </button>
            )
          })}
        </div>
        <div className="h-px w-full bg-neutral-200" />
        <div className="flex items-start justify-end px-3 py-2">
          <button
            type="button"
            onClick={handleAssign}
            className="min-h-9 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Assign
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function RoleManagement() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) =>
      [u.name, u.email, u.department].some((v) => v.toLowerCase().includes(q))
    )
  }, [users, search])

  function handleAssign(id, roles) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, roles } : u)))
    const user = users.find((u) => u.id === id)
    toast.success(`Roles updated for ${user.name}.`)
  }

  return (
    <div className="-m-6 flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-[#0f1724]">Role Management</h1>
        <p className="text-xs text-neutral-900">
          View registered users and assign them appropriate system roles.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-black">Role Access Rights Information</h2>
        <div className="flex items-stretch gap-6">
          {ROLE_INFO_CARDS.map((card) => (
            <RoleInfoCard key={card.key} card={card} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg">
        <h2 className="text-lg font-medium text-black">Registered Users</h2>
        <SearchInput value={search} onChange={setSearch} />
        <div className="overflow-hidden rounded-xl border border-neutral-200">
          <Table className="table-fixed">
            <colgroup>
              <col className="w-10" />
              <col />
              <col />
              <col />
            </colgroup>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <HeaderCell className="text-center">No</HeaderCell>
                <HeaderCell>Name</HeaderCell>
                <HeaderCell className="px-[60px]">Department</HeaderCell>
                <HeaderCell className="pr-[100px] pl-4">
                  <span className="flex items-center gap-0.5">
                    Role Assignment
                    <Funnel className="size-3 fill-current text-neutral-400" />
                  </span>
                </HeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-sm text-neutral-500">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((u, i) => (
                <TableRow key={u.id} className="h-[60px] border-neutral-200">
                  <TableCell className="px-1.5 text-center text-[13px] font-medium text-neutral-800">
                    {i + 1}.
                  </TableCell>
                  <TableCell className="px-1.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={getAvatarUrl(u.name)}
                        alt=""
                        className="size-6 shrink-0 rounded-full object-cover"
                      />
                      <div className="flex flex-col justify-center">
                        <span className="text-xs font-medium text-neutral-800">{u.name}</span>
                        <span className="text-[11px] font-normal text-neutral-600">{u.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-[60px] text-[13px] font-medium text-neutral-800">
                    {u.department}
                  </TableCell>
                  <TableCell className="p-0">
                    <RoleAssignmentCell user={u} onAssign={handleAssign} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}

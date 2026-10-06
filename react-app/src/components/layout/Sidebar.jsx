import { useState } from "react"
import { Link } from "react-router-dom"
import {
  BellDot,
  Bookmark,
  Brain,
  ChevronDown,
  CircleDollarSign,
  CircleUserRound,
  FileCode,
  FilePlus2,
  LogIn,
  Package,
  PanelLeft,
  RotateCcw,
  Star,
  Tag,
} from "lucide-react"

import hitakariLogo from "@/assets/faq/hitakari-logo.png"
import hitakariLogoVertical from "@/assets/RGB - Hitakari Telkomsel Ai - Full Colour (Vertical).png"
import { ResetDemoDataDialog } from "@/components/layout/ResetDemoDataDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAvatarUrl } from "@/lib/avatar"
import { CURRENT_USER } from "@/data/current-user"
import { cn } from "@/lib/utils"

const NAV_SECTIONS = [
  {
    heading: "Product Management",
    items: [
      { key: "product-registration", label: "Product Registration", icon: FilePlus2 },
      { key: "budgeting", label: "Budgeting", icon: CircleDollarSign },
      { key: "top-list-management", label: "Top List Management", icon: Star },
      { key: "ads-management", label: "Ads Management", icon: Tag },
    ],
  },
  {
    heading: "Subscription Management",
    items: [
      {
        key: "subscription-request",
        label: "Subscription Request",
        icon: LogIn,
      },
      { key: "my-subscription", label: "My Subscription", icon: Package },
    ],
  },
  {
    heading: "Usage Monitoring",
    groups: [
      {
        key: "model",
        label: "Model",
        icon: Brain,
        children: [
          { key: "model-usage-overview", label: "Usage Overview" },
          { key: "model-cost-budget", label: "Cost & Budget" },
        ],
      },
      {
        key: "rest",
        label: "REST",
        icon: FileCode,
        children: [
          { key: "rest-usage-overview", label: "Usage Overview" },
          { key: "rest-cost-budget", label: "Cost & Budget" },
        ],
      },
    ],
  },
  {
    items: [
      { key: "role-management", label: "Role Management", icon: CircleUserRound },
      { key: "bookmark", label: "Bookmark", icon: Bookmark },
    ],
  },
]

function NavItem({ item, activePage, onNavigate, collapsed }) {
  const Icon = item.icon
  const active = item.key === activePage
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.key)}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex h-6 w-full items-center gap-2 rounded-md px-3 text-xs font-normal transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-red-50 text-red-600"
          : "text-neutral-900 hover:bg-neutral-100 hover:text-black"
      )}
    >
      <Icon className={cn("size-4 shrink-0", !active && "text-neutral-700")} />
      {!collapsed && <span className="flex-1 truncate text-left">{item.label}</span>}
    </button>
  )
}

function NavGroup({ group, activePage, onNavigate, collapsed, onExpandSidebar }) {
  const isActiveGroup = group.children.some((c) => c.key === activePage)
  const [open, setOpen] = useState(isActiveGroup)
  const Icon = group.icon

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onExpandSidebar}
        title={group.label}
        className="flex h-6 w-full items-center justify-center rounded-md px-0 text-xs font-normal text-neutral-900 transition-colors hover:bg-neutral-100 hover:text-black"
      >
        <Icon className="size-4 shrink-0 text-neutral-700" />
      </button>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-6 w-full items-center gap-2 rounded-md px-3 text-xs font-normal transition-colors",
          "text-neutral-900 hover:bg-neutral-100 hover:text-black"
        )}
      >
        <Icon className="size-4 shrink-0 text-neutral-700" />
        <span className="flex-1 truncate text-left">{group.label}</span>
        <ChevronDown
          className={cn(
            "size-3 shrink-0 text-neutral-700 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-0.5">
          {group.children.map((child) => {
            const active = child.key === activePage
            return (
              <div key={child.key} className="relative flex h-6 items-center pl-5">
                <span className="absolute left-[10px] top-[-6px] h-8 w-px bg-neutral-200" />
                <button
                  type="button"
                  onClick={() => onNavigate(child.key)}
                  className={cn(
                    "h-full flex-1 rounded-md px-2 text-left text-xs font-normal transition-colors",
                    active
                      ? "bg-red-50 text-red-600"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-black"
                  )}
                >
                  {child.label}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ activePage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden border-r border-neutral-200 transition-[width,background-color] duration-300 ease-in-out",
        collapsed ? "w-[60px] bg-[#FCFCFC]" : "w-[220px] bg-white"
      )}
    >
      <div className="flex flex-1 flex-col gap-3.5 overflow-hidden pt-3.5">
        {collapsed ? (
          <div className="flex shrink-0 items-center justify-center px-2.5">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              title="Expand sidebar"
              className="group relative flex size-[34px] shrink-0 items-center justify-center rounded-lg hover:bg-neutral-100"
            >
              <img
                src={hitakariLogoVertical}
                alt="Hitakari Marketplace"
                className="size-[34px] object-contain transition-opacity duration-150 group-hover:opacity-0"
              />
              <PanelLeft className="absolute size-3.5 text-neutral-700 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
            </button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center justify-between px-2.5">
            <Link to="/landing-page" className="flex shrink-0 items-center">
              <img src={hitakariLogo} alt="Hitakari Marketplace" className="h-[34px] w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
              className="flex size-6 shrink-0 items-center justify-center rounded text-neutral-700 hover:bg-neutral-100"
            >
              <PanelLeft className="size-3.5" />
            </button>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto overflow-x-hidden px-2.5">
          {NAV_SECTIONS.map((section, i) => (
            <div key={section.heading ?? `section-${i}`} className="flex flex-col gap-0.5">
              {section.heading && !collapsed && (
                <div className="flex items-center px-3 py-1 text-xs font-semibold whitespace-nowrap text-neutral-500">
                  {section.heading}
                </div>
              )}
              {section.items?.map((item) => (
                <NavItem
                  key={item.key}
                  item={item}
                  activePage={activePage}
                  onNavigate={onNavigate}
                  collapsed={collapsed}
                />
              ))}
              {section.groups?.map((group) => (
                <NavGroup
                  key={group.key}
                  group={group}
                  activePage={activePage}
                  onNavigate={onNavigate}
                  collapsed={collapsed}
                  onExpandSidebar={() => setCollapsed(false)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "flex shrink-0 items-center border-t border-neutral-200 px-2.5 py-1",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            title={collapsed ? CURRENT_USER.name : undefined}
            className="flex cursor-pointer items-center gap-1.5 rounded-[10px] p-1 outline-none hover:bg-neutral-100 data-popup-open:bg-neutral-100"
          >
            <img
              src={getAvatarUrl()}
              alt={CURRENT_USER.name}
              className="size-[18px] shrink-0 rounded-full object-cover"
            />
            {!collapsed && (
              <>
                <span className="text-xs whitespace-nowrap text-black">{CURRENT_USER.name}</span>
                <ChevronDown className="size-3 shrink-0 text-neutral-500" />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setResetOpen(true)}>
              <RotateCcw className="size-4" />
              Reset Demo Data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {!collapsed && (
          <button
            type="button"
            className="relative flex size-4 shrink-0 items-center justify-center text-neutral-700"
          >
            <BellDot className="size-4" />
          </button>
        )}
      </div>
      <ResetDemoDataDialog open={resetOpen} onOpenChange={setResetOpen} />
    </aside>
  )
}

import { Sidebar } from "@/components/layout/Sidebar"

export function AppShell({ activePage, onNavigate, children }) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <main className="min-w-0 flex-1 bg-white p-6">{children}</main>
    </div>
  )
}

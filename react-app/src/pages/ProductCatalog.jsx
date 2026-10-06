import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { CatalogHero } from "@/components/catalog/CatalogHero"
import { CatalogPagination } from "@/components/catalog/CatalogPagination"
import { FilterSidebar } from "@/components/catalog/FilterSidebar"
import { ProductCard } from "@/components/catalog/ProductCard"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/faq/Navbar"
import { CURRENT_USER } from "@/data/current-user"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  CATEGORIES,
  FILTER_SECTIONS,
  PAGE_SIZE,
  PRODUCTS,
  SORT_OPTIONS,
} from "@/data/product-catalog-data"

import topListIcon from "@/assets/portal/top-list-icon.svg"
import allServicesIcon from "@/assets/portal/all-services-icon.svg"

const NAV_LINKS = ["Home", "About us", "Products", "FAQ"]

const SORTERS = {
  subscribed: (a, b) => b.subscribers - a.subscribers,
  rating: (a, b) => b.rating - a.rating,
  name: (a, b) => a.name.localeCompare(b.name),
}

function SectionTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex size-6 items-center justify-center">
        <img src={icon} alt="" />
      </span>
      {children}
    </div>
  )
}

export default function ProductCatalog() {
  const navigate = useNavigate()
  const [products, setProducts] = useState(PRODUCTS)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState(null)
  const [selected, setSelected] = useState({})
  const [sort, setSort] = useState("subscribed")
  const [page, setPage] = useState(1)

  function toggleFilter(sectionKey, option) {
    setSelected((prev) => {
      const current = prev[sectionKey] ?? []
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option]
      return { ...prev, [sectionKey]: next }
    })
    setPage(1)
  }

  function openProduct(product) {
    if (product.type === "Model") {
      navigate(`/detail-product-model/${product.id}`)
      return
    }
    if (product.type === "Apps") {
      navigate(`/detail-product-rest/${product.id}`)
      return
    }
    toast.info("Detail product for this type is under development")
  }

  function toggleBookmark(id) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)))
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((p) => {
      if (category && p.type !== category) return false
      if (query && !`${p.name} ${p.provider} ${p.description}`.toLowerCase().includes(query)) return false
      if (selected.domains?.length && !selected.domains.some((d) => p.domains.includes(d))) return false
      if (selected.objectives?.length && !selected.objectives.some((o) => p.objectives.includes(o)))
        return false
      return true
    })
  }, [products, search, category, selected])

  const topList = filtered.filter((p) => p.top).slice(0, 3)
  const sortedServices = useMemo(
    () => filtered.filter((p) => !p.top).sort(SORTERS[sort]),
    [filtered, sort]
  )
  const totalPages = Math.max(1, Math.ceil(sortedServices.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const allServices = sortedServices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar links={NAV_LINKS} activeLabel="Products" user={CURRENT_USER} />

      <CatalogHero
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        categories={CATEGORIES}
        activeCategory={category}
        onCategoryChange={(value) => {
          setCategory(value)
          setPage(1)
        }}
      />

      <div className="flex items-start">
        <FilterSidebar sections={FILTER_SECTIONS} selected={selected} onToggle={toggleFilter} />

        <main className="flex min-w-0 flex-1 flex-col gap-5 pt-6 pr-6">
          {topList.length > 0 && (
            <section className="flex flex-col gap-4">
              <SectionTitle icon={topListIcon}>
                <h2 className="text-lg font-bold text-black">Top List</h2>
              </SectionTitle>
              <div className="grid grid-cols-3 gap-5">
                {topList.map((p) => (
                  <ProductCard key={p.id} product={p} onToggleBookmark={toggleBookmark} onOpen={openProduct} />
                ))}
              </div>
            </section>
          )}

          <section className="flex flex-col gap-5">
            <div className="flex items-center gap-1.5">
              <span className="flex size-6 items-center justify-center">
                <img src={allServicesIcon} alt="" />
              </span>
              <div className="flex items-center gap-6">
                <h2 className="text-lg font-bold text-black">All Services</h2>
                <Select
                  value={sort}
                  onValueChange={(value) => {
                    setSort(value)
                    setPage(1)
                  }}
                  items={SORT_OPTIONS}
                >
                  <SelectTrigger
                    aria-label="Sort services"
                    className="h-8 w-[162px] rounded-lg border-[0.66px] border-neutral-400 bg-white px-3 py-1.5 text-[13px] font-medium text-neutral-700"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {allServices.length > 0 ? (
              <div className="grid grid-cols-3 gap-5">
                {allServices.map((p) => (
                  <ProductCard key={p.id} product={p} onToggleBookmark={toggleBookmark} onOpen={openProduct} />
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-neutral-500">No products match your filters.</p>
            )}
          </section>

          <CatalogPagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
          <div className="h-[60px]" />
        </main>
      </div>

      <Footer />
    </div>
  )
}

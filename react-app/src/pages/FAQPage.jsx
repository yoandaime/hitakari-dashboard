import { useEffect, useMemo, useState } from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import {
  ChevronDown,
  CreditCard,
  Info,
  Link as LinkIcon,
  LayoutList,
  PackagePlus,
  Search,
  UserRound,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"

import { Navbar } from "@/components/faq/Navbar"
import { CURRENT_USER } from "@/data/current-user"
import { Footer } from "@/components/layout/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { AccordionContent } from "@/components/ui/accordion"

import faqData from "@/data/faq-metadata.json"
import bgFaq from "@/assets/bg-faq.png"

const NAV_LINKS = ["Home", "About us", "Products", "FAQ"]

const CATEGORY_ICONS = {
  Umum: Info,
  "Role & Akses": UserRound,
  "Product Registration": PackagePlus,
  "Content Management": LayoutList,
  Subscription: CreditCard,
  Budgeting: Wallet,
}

const POPULAR_FAQ_IDS = ["faq-001", "faq-003", "faq-007", "faq-012", "faq-014", "faq-018"]

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function FAQPage() {
  const { faqs } = faqData
  const [search, setSearch] = useState("")
  const [selectedFaq, setSelectedFaq] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = useMemo(() => {
    const seen = []
    for (const faq of faqs) {
      if (!seen.includes(faq.category)) seen.push(faq.category)
    }
    return seen
  }, [faqs])

  const popularFaqs = useMemo(
    () => POPULAR_FAQ_IDS.map((id) => faqs.find((faq) => faq.id === id)).filter(Boolean),
    [faqs]
  )

  const query = search.trim().toLowerCase()
  const groupedFaqs = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        items: faqs.filter(
          (faq) =>
            faq.category === category &&
            (query === "" ||
              faq.question.toLowerCase().includes(query) ||
              faq.answer.toLowerCase().includes(query))
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [categories, faqs, query])

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-category-section]"))
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveCategory(visible[0].target.dataset.categorySection)
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [groupedFaqs])

  function scrollToCategory(category) {
    const el = document.getElementById(slugify(category))
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleCopyLink(id) {
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    navigator.clipboard.writeText(url)
    toast.success("Link copied to clipboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar links={NAV_LINKS} activeLabel="FAQ" user={CURRENT_USER} />

      <section className="relative flex flex-col items-center justify-between overflow-hidden border-b border-neutral-200 px-6 py-12 sm:px-12 lg:px-[50px] lg:py-[70px]">
        <img
          src={bgFaq}
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
        <div className="relative flex w-full max-w-[678px] flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2.5 text-center text-black">
            <h1 className="text-[30px] leading-[30px] font-semibold tracking-[-1px]">
              How can we help you?
            </h1>
            <p className="max-w-[361px] text-sm leading-5 text-black">
              Find answers, tutorials, and comprehensive guides to make the most out of your
              experience.
            </p>
          </div>

          <div className="flex w-[344px] max-w-full items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-2.5 shadow-xs">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-auto flex-1 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
            />
            <Search className="size-4 shrink-0 text-neutral-500" />
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-[30px] py-10">
        <div className="flex flex-col items-center gap-2 text-center text-black">
          <h2 className="text-2xl leading-[28.8px] font-semibold tracking-[-1px]">
            Popular Questions
          </h2>
          <p className="text-base leading-6">Quick answers to the most commonly asked questions.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {popularFaqs.map((faq) => {
            const Icon = CATEGORY_ICONS[faq.category] ?? Info
            return (
              <Card
                key={faq.id}
                className="h-full cursor-pointer rounded-xl p-6 shadow-xs transition-shadow hover:shadow-md"
                onClick={() => setSelectedFaq(faq)}
              >
                <CardContent className="flex h-full flex-col gap-4 p-0">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <Icon className="size-6" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base leading-6 font-medium text-black">
                      {faq.question}
                    </h3>
                    <p className="line-clamp-3 text-base leading-6 text-neutral-600">
                      {faq.answer}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl py-10 lg:py-[60px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
          <div className="relative hidden md:block">
            <nav className="sticky top-20 flex flex-col items-start gap-2">
              <p className="pl-2.5 text-xs font-medium text-neutral-500">Category</p>
              <div className="flex w-full flex-col items-start">
                {categories.map((category) => {
                  const isActive = activeCategory === category
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => scrollToCategory(category)}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative flex w-full items-center border-l border-neutral-300 px-2.5 py-1.5 text-left text-sm leading-normal transition-colors ${
                        isActive
                          ? "font-medium text-black"
                          : "text-neutral-600 hover:text-black"
                      }`}
                    >
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute top-0 -left-0.5 h-full w-[3px] bg-red-600"
                        />
                      )}
                      {category}
                    </button>
                  )
                })}
              </div>
            </nav>
          </div>

          <div className="flex flex-col gap-[30px]">
            <nav className="flex flex-wrap gap-2 md:hidden">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => scrollToCategory(category)}
                  className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-black"
                >
                  {category}
                </button>
              ))}
            </nav>

            {groupedFaqs.length === 0 && (
              <p className="text-center text-neutral-500">No questions match your search.</p>
            )}

            {groupedFaqs.map(({ category, items }) => (
              <div
                key={category}
                id={slugify(category)}
                data-category-section={category}
                className="scroll-mt-24"
              >
                <h2 className="mb-4 text-xl leading-6 font-semibold text-black">{category}</h2>
                <AccordionPrimitive.Root className="flex w-full flex-col gap-[18px]">
                  {items.map((faq) => (
                    <AccordionPrimitive.Item
                      key={faq.id}
                      value={faq.id}
                      id={faq.id}
                      className="scroll-mt-24 rounded-xl border border-neutral-200 p-3.5"
                    >
                      <AccordionPrimitive.Header className="flex w-full items-center gap-2.5">
                        <AccordionPrimitive.Trigger className="group/accordion-trigger flex flex-1 items-center gap-2.5 text-left outline-none">
                          <ChevronDown className="size-6 shrink-0 text-black transition-transform group-aria-expanded/accordion-trigger:rotate-180" />
                          <span className="text-base leading-6 font-medium text-black">
                            {faq.question}
                          </span>
                        </AccordionPrimitive.Trigger>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(faq.id)}
                          className="gap-1.5 rounded-lg border-neutral-300 text-sm font-medium text-neutral-900 shadow-xs"
                        >
                          <LinkIcon className="size-4" />
                          Copy link
                        </Button>
                      </AccordionPrimitive.Header>
                      <AccordionContent className="pt-2 pl-[34px] text-sm text-neutral-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionPrimitive.Item>
                  ))}
                </AccordionPrimitive.Root>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <Dialog open={!!selectedFaq} onOpenChange={(open) => !open && setSelectedFaq(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedFaq?.question}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{selectedFaq?.answer}</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}

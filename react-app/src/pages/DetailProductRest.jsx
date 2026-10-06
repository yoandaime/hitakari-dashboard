import { useEffect, useState } from "react"
import { BadgeCheck, Ban, MonitorPlay, SquareArrowRightEnter, Star } from "lucide-react"
import { Navigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Navbar } from "@/components/faq/Navbar"
import { CURRENT_USER } from "@/data/current-user"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { REST_AVAILABILITY, REST_DETAILS } from "@/data/rest-detail-data"
import { getAccessStatus, useSubscriptionRequests } from "@/lib/subscription-requests"
import { PublisherAvatars } from "@/components/product-detail/PublisherAvatars"
import { SubscribeDialog } from "@/components/product-detail/SubscribeDialog"
import {
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
} from "@/components/product-detail/button-styles"

import logoDefault from "@/assets/portal/logo-default.svg"
import headerPattern from "@/assets/product-detail/header-pattern.svg"

const NAV_LINKS = ["Home", "About us", "Products", "FAQ"]

const GALLERY_PAGE_SIZE = 4
const GALLERY_SCALE = 0.8

// Crop of each gallery screenshot inside its 240x300 card, as laid out in Figma.
const GALLERY_CROPS = [
  "top-0 left-[-104.17px] h-[398.516px] w-[700.739px]",
  "top-[-116.19px] left-[-1px] h-[716px] w-[562px]",
  "top-0 left-0 h-[417.445px] w-[320.762px]",
  "top-0 left-[-188.18px] h-[465.762px] w-[818.004px]",
]

const SECTIONS = [
  { key: "description", title: "Description" },
  { key: "how-to-use", title: "How to Use" },
  { key: "corporation", title: "Corporation" },
  { key: "app-capabilities", title: "App Capabilities" },
  { key: "objective", title: "Objective" },
  { key: "domains", title: "Domains" },
  { key: "target-customer", title: "Target Customer" },
  { key: "additional-content", title: "Additional Content" },
]

const DEMO_BUTTON_ICON_CLASS = "size-4"

function underDevelopment() {
  toast.info("This feature is under development")
}

function SectionHeading({ children }) {
  return <h2 className="text-sm leading-5 font-semibold text-neutral-950">{children}</h2>
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-300 bg-neutral-50 px-2 py-px text-xs leading-5 text-neutral-950">
      {children}
    </span>
  )
}

// Right-hand card in the header. What it shows depends on the product's availability
// (restricted / takedown) or, for an open product, on the user's request for it.
function AccessCard({ detail, status, onSubscribe }) {
  if (status === REST_AVAILABILITY.TAKEDOWN) {
    return (
      <div className="flex w-[340px] shrink-0 flex-col items-center gap-3 rounded-xl border border-red-600 bg-red-50/40 p-4">
        <Ban className="size-6 text-red-600" />
        <div className="flex flex-col items-center gap-1 text-center text-red-600">
          <p className="text-base leading-6 font-medium">This product has been taken down</p>
          <p className="w-[231.826px] text-xs leading-4">
            This product is no longer available and can&apos;t be accessed.
          </p>
        </div>
      </div>
    )
  }

  if (status === REST_AVAILABILITY.RESTRICTED) {
    return (
      <div className="flex w-[340px] shrink-0 flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <div className="flex w-full flex-col gap-1">
          <p className="text-[28px] leading-normal font-semibold text-black">{detail.price}</p>
          <p className="flex items-center gap-1 px-1 py-0.5 text-xs leading-4">
            <span className="text-neutral-600">Capabilities:</span>
            <span className="text-neutral-950">{detail.capabilities}</span>
          </p>
        </div>
        <div className="flex w-full flex-col gap-0.5 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-5">
          <p className="font-medium text-neutral-950">Restricted Access</p>
          <p className="text-neutral-500">{detail.restrictedReason}</p>
        </div>
      </div>
    )
  }

  if (status === "subscribed") {
    return (
      <div className="flex shrink-0 flex-col items-center gap-3 overflow-clip rounded-lg border border-neutral-200 bg-white p-3.5">
        <div className="flex w-full items-center justify-center gap-1 border-b border-neutral-200 pb-2.5">
          <p className="text-xl leading-6 font-semibold text-black">Subscribed</p>
          <BadgeCheck className="size-5" />
        </div>
        <div className="flex items-start gap-2">
          <Button
            variant="outline"
            aria-label="Get demo"
            onClick={underDevelopment}
            className={cn("h-8 rounded-lg border-0 px-2", SECONDARY_BUTTON_CLASS)}
          >
            <MonitorPlay className={DEMO_BUTTON_ICON_CLASS} />
          </Button>
          <Button
            variant="outline"
            onClick={underDevelopment}
            className={cn("h-8 rounded-lg border-0 px-3 text-sm", SECONDARY_BUTTON_CLASS)}
          >
            Unsubscribe
          </Button>
          <Button
            onClick={underDevelopment}
            className={cn("h-8 rounded-lg border-0 px-3 text-sm", PRIMARY_BUTTON_CLASS)}
          >
            Write a review
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-[340px] shrink-0 flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex w-full flex-col gap-1">
        <p className="text-[28px] leading-normal font-semibold text-black">{detail.price}</p>
        <p className="px-1 py-0.5 text-xs leading-4 text-neutral-950">{detail.priceNote}</p>
      </div>
      {status === "waiting" ? (
        <div className="flex w-full items-center gap-2">
          <Button
            variant="outline"
            aria-label="Get demo"
            onClick={underDevelopment}
            className="size-8 shrink-0 border-neutral-300 bg-white px-0 shadow-xs"
          >
            <MonitorPlay className={DEMO_BUTTON_ICON_CLASS} />
          </Button>
          <div className="flex min-h-8 min-w-px flex-1 items-center justify-between rounded-lg bg-secondary px-3 py-2.5">
            <span className="text-sm leading-5 font-medium text-secondary-foreground">
              Waiting Approval
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={underDevelopment}
              className="border-neutral-300 bg-white px-2 shadow-xs"
            >
              Track
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2">
          <Button
            variant="outline"
            onClick={underDevelopment}
            className={cn("h-8 w-full rounded-lg border-0 px-3 text-sm", SECONDARY_BUTTON_CLASS)}
          >
            <MonitorPlay className="size-4" />
            Get demo
          </Button>
          <Button
            onClick={onSubscribe}
            className={cn("h-8 w-full rounded-lg border-0 px-3 text-sm", PRIMARY_BUTTON_CLASS)}
          >
            Subscribe
          </Button>
        </div>
      )}
    </div>
  )
}

function Gallery({ images, name }) {
  const [page, setPage] = useState(0)
  const pages = Math.ceil(images.length / GALLERY_PAGE_SIZE)
  const visible = images.slice(page * GALLERY_PAGE_SIZE, (page + 1) * GALLERY_PAGE_SIZE)

  return (
    <div className="flex w-fit max-w-full flex-col items-center gap-5">
      <div className="flex w-full items-center gap-3">
        {visible.map((src, index) => (
          // Cards keep their 240x300 Figma crop and are scaled down as a whole.
          <div
            key={src}
            style={{ width: 240 * GALLERY_SCALE, height: 300 * GALLERY_SCALE }}
            className="shrink-0"
          >
            <div
              style={{ transform: `scale(${GALLERY_SCALE})` }}
              className="relative h-[300px] w-[240px] origin-top-left overflow-clip rounded-xl shadow-[0_4px_4px_rgb(10_13_18/0.1),0_2px_2px_rgb(10_13_18/0.06)]"
            >
              <img
                src={src}
                alt={`${name} screenshot ${page * GALLERY_PAGE_SIZE + index + 1}`}
                className={cn(
                  "pointer-events-none absolute max-w-none object-cover",
                  page === 0 ? GALLERY_CROPS[index] : "inset-0 size-full"
                )}
              />
            </div>
          </div>
        ))}
      </div>
      {pages > 1 && (
        <div className="flex items-start gap-1.5" role="tablist" aria-label="Gallery pages">
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={page === index}
              aria-label={`Gallery page ${index + 1}`}
              onClick={() => setPage(index)}
              className={cn(
                "h-[3px] cursor-pointer rounded-[1px] bg-black",
                page === index ? "w-6" : "w-4 opacity-30"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ContentSection({ id, title, children }) {
  return (
    <section id={id} className="flex w-full scroll-mt-24 flex-col gap-3">
      <SectionHeading>{title}</SectionHeading>
      {children}
    </section>
  )
}

function Paragraph({ children }) {
  return <p className="min-h-[1lh] text-sm leading-5 text-neutral-800">{children}</p>
}

function Bullets({ items, className }) {
  return (
    <ul className={cn("list-disc pl-[1.125rem] marker:text-xs", className)}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function AdditionalContent({ sections }) {
  return (
    <div className="flex flex-col gap-5 text-neutral-800">
      {sections.map((section) => (
        <div key={section.heading} className="flex flex-col gap-3">
          <p className="text-sm leading-5 font-semibold text-neutral-950">{section.heading}</p>
          {section.items.map((item) => (
            <div key={item.title} className="flex flex-col text-xs leading-5">
              <p className="text-sm leading-5 font-medium text-neutral-950">{item.title}</p>
              {[].concat(item.description ?? []).map((line) => (
                <p key={line}>{line}</p>
              ))}
              {item.bullets && <Bullets items={item.bullets} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function DetailProductRest() {
  const { id } = useParams()
  const detail = REST_DETAILS[id]
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const requests = useSubscriptionRequests()
  const [activeTab, setActiveTab] = useState("overview")
  const [activeSection, setActiveSection] = useState("description")

  // Highlights the Table of Content entry for the section that is currently being read.
  useEffect(() => {
    if (!detail) return
    const targets = SECTIONS.map(({ key }) => document.getElementById(`rest-${key}`)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
          setActiveSection(top.target.id.replace("rest-", ""))
        }
      },
      { rootMargin: "-90px 0px -60% 0px" }
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [detail])

  if (!detail) return <Navigate to="/product-catalog" replace />

  // Restricted and takedown are properties of the product; an open product follows the
  // user's own request (none -> waiting -> subscribed once the owner approves).
  const status =
    detail.availability === REST_AVAILABILITY.OPEN
      ? getAccessStatus(requests, detail.name)
      : detail.availability

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "details", label: "Details + Support" },
    { key: "reviews", label: "Ratings & Reviews" },
    ...(status === "subscribed" || status === REST_AVAILABILITY.TAKEDOWN
      ? [{ key: "documentation", label: "Documentation" }]
      : []),
  ]

  function scrollToSection(key) {
    setActiveSection(key)
    document.getElementById(`rest-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar links={NAV_LINKS} activeLabel="Products" user={CURRENT_USER} />

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden border-b border-neutral-200 bg-white px-[90px] py-[70px]">
          <img
            src={headerPattern}
            alt=""
            aria-hidden
            className="pointer-events-none absolute top-[-4px] left-0 h-[942px] w-[1780px] max-w-none"
          />
          <div className="relative mx-auto flex max-w-[1340px] items-center justify-between gap-6">
            <div className="flex w-[917px] max-w-full items-center gap-3">
              <img src={logoDefault} alt={`${detail.name} logo`} className="size-[100px] shrink-0" />
              <div className="flex min-w-px flex-1 flex-col items-start gap-0.5">
                <h1 className="text-[28px] font-semibold text-black">{detail.name}</h1>
                <span className="inline-flex items-center justify-center rounded-lg bg-secondary px-2 py-0.5 text-xs leading-4 font-medium text-secondary-foreground">
                  {detail.provider}
                </span>
                <div className="flex h-8 items-center gap-4 text-xs text-neutral-950">
                  <span className="flex items-center gap-0.5">
                    <SquareArrowRightEnter className="size-4" />
                    {detail.subscriptions} Subscriptions
                  </span>
                  <span className="flex items-center gap-[3px]">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {detail.rating.toFixed(1)}
                    <span className="text-[11px] text-neutral-500">({detail.reviews} reviews)</span>
                  </span>
                </div>
                <p className="text-xs leading-4 text-black">{detail.summary}</p>
              </div>
            </div>

            <AccessCard detail={detail} status={status} onSubscribe={() => setSubscribeOpen(true)} />
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-[1274px] flex-col gap-6 px-6 pt-10 pb-[60px]">
          <div className="flex items-center gap-3" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => {
                  if (tab.key !== "overview") {
                    underDevelopment()
                    return
                  }
                  setActiveTab(tab.key)
                }}
                className={cn(
                  "px-1 pt-2.5 pb-1.5 text-sm font-medium",
                  activeTab === tab.key
                    ? "border-b-[3px] border-red-600 text-black"
                    : "text-neutral-600 hover:text-black"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-start gap-6">
            <div className="flex min-w-px flex-1 flex-col gap-8">
              <Gallery images={detail.gallery} name={detail.name} />

              <ContentSection id="rest-description" title="Description">
                <Paragraph>{detail.description}</Paragraph>
              </ContentSection>

              <ContentSection id="rest-how-to-use" title="How to Use">
                <div>
                  {detail.howToUse.map((line, index) => (
                    <Paragraph key={index}>{line}</Paragraph>
                  ))}
                </div>
              </ContentSection>

              <ContentSection id="rest-corporation" title="Corporation">
                <Paragraph>{detail.corporation}</Paragraph>
              </ContentSection>

              <ContentSection id="rest-app-capabilities" title="App Capabilities">
                <Paragraph>{detail.appCapabilities}</Paragraph>
              </ContentSection>

              <ContentSection id="rest-objective" title="Objective">
                <Paragraph>{detail.objective}</Paragraph>
              </ContentSection>

              <ContentSection id="rest-domains" title="Domains">
                <Paragraph>{detail.domains}</Paragraph>
              </ContentSection>

              <ContentSection id="rest-target-customer" title="Target Customer">
                <Paragraph>{detail.targetCustomer}</Paragraph>
              </ContentSection>

              <ContentSection id="rest-additional-content" title="Additional Content">
                <AdditionalContent sections={detail.additionalContent} />
              </ContentSection>
            </div>

            <aside className="sticky top-[84px] flex w-[206px] shrink-0 flex-col gap-6">
              <nav aria-label="Table of Content" className="flex flex-col gap-3">
                <SectionHeading>Table of Content</SectionHeading>
                <div className="flex flex-col">
                  {SECTIONS.map((section) => {
                    const active = activeSection === section.key
                    return (
                      <button
                        key={section.key}
                        type="button"
                        aria-current={active || undefined}
                        onClick={() => scrollToSection(section.key)}
                        className={cn(
                          "relative cursor-pointer border-l border-neutral-300 px-2.5 py-1.5 text-left text-xs",
                          active ? "font-medium text-black" : "text-neutral-600 hover:text-black"
                        )}
                      >
                        {section.title}
                        {active && (
                          <span className="absolute top-0 left-[-2px] h-full w-[3px] bg-red-600" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </nav>

              <div className="flex flex-col gap-3">
                <SectionHeading>Classification</SectionHeading>
                <div>
                  <Tag>{detail.classification}</Tag>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <SectionHeading>Allowed Customer</SectionHeading>
                  <p className="text-xs text-neutral-600">{detail.allowedCustomer}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <SectionHeading>Allowed Scopes</SectionHeading>
                  <p className="text-xs text-neutral-600">{detail.allowedScopes}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <SectionHeading>Tags</SectionHeading>
                <div className="flex gap-1.5">
                  {detail.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <SectionHeading>Publisher Team</SectionHeading>
                <PublisherAvatars avatars={detail.publisherAvatars} more={detail.publisherMore} />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
      <SubscribeDialog
        open={subscribeOpen}
        onOpenChange={setSubscribeOpen}
        product={{ name: detail.name, type: "REST" }}
      />
    </div>
  )
}

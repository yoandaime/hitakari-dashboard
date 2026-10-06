import { useState } from "react"
import {
  BadgeCheck,
  Check,
  Copy,
  Info,
  MonitorPlay,
  Star,
  SquareArrowRightEnter,
  X,
} from "lucide-react"
import { Navigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Navbar } from "@/components/faq/Navbar"
import { CURRENT_USER } from "@/data/current-user"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { MODEL_DETAILS } from "@/data/model-detail-data"
import { getAccessStatus, useSubscriptionRequests } from "@/lib/subscription-requests"
import { PublisherAvatars } from "@/components/product-detail/PublisherAvatars"
import { SubscribeDialog } from "@/components/product-detail/SubscribeDialog"
import {
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
} from "@/components/product-detail/button-styles"

import headerPattern from "@/assets/product-detail/header-pattern.svg"
import logoDefault from "@/assets/portal/logo-default.svg"

const NAV_LINKS = ["Home", "About us", "Products", "FAQ"]

const SDK_TYPES = ["Open AI SDK", "Azure SDK"]

const CODE_SNIPPET = [
  [{ text: "import", tone: "keyword" }, { text: " requests" }],
  [],
  [{ text: "# The URL for the API endpoint you want to fetch data from", tone: "comment" }],
  [{ text: "url = " }, { text: "'https://api.example.com/data'", tone: "string" }],
  [],
  [{ text: "# Perform a GET request", tone: "comment" }],
  [{ text: "response = requests.get(url)" }],
  [],
  [{ text: "# Check if the request was successful", tone: "comment" }],
  [{ text: "if response.status_code == 200:" }],
  [{ text: "    # Parse the JSON response" }],
  [{ text: "    data = response.json()" }],
  [{ text: "    print(data)" }],
  [{ text: "else:" }],
  [{ text: "    print(f'Failed to fetch data: HTTP {response.status_code}')" }],
]

const TONE_CLASS = {
  keyword: "text-sky-600",
  comment: "text-neutral-400",
  string: "text-emerald-600",
}

function copyToClipboard(value, label) {
  navigator.clipboard?.writeText(value).then(
    () => toast.success(`${label} copied`),
    () => toast.error("Unable to copy")
  )
}

function SectionTitle({ children }) {
  return <h2 className="text-sm leading-5 font-semibold text-neutral-950">{children}</h2>
}

function SpecRow({ label, children, icon, className }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-neutral-200 p-1",
        className
      )}
    >
      <span className="flex w-[172.5px] items-center gap-1 text-xs text-neutral-600">
        {label}
        {icon}
      </span>
      {children}
    </div>
  )
}

function Mono({ children }) {
  return (
    <span className="font-mono text-xs font-medium tracking-[-0.16px] text-neutral-950">
      {children}
    </span>
  )
}

function CopyButton({ value, label }) {
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      onClick={() => copyToClipboard(value, label)}
      className="block size-3.5 shrink-0 cursor-pointer text-neutral-600 hover:text-neutral-950"
    >
      <Copy className="size-3.5" />
    </button>
  )
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-300 bg-neutral-50 px-2 py-px text-xs leading-5 text-neutral-950">
      {children}
    </span>
  )
}

function CapabilityStatus({ supported }) {
  return supported ? (
    <span className="flex items-center gap-1 text-xs text-emerald-700">
      <Check className="size-[18px]" />
      Supported
    </span>
  ) : (
    <span className="flex items-center gap-1 text-xs text-red-700">
      <X className="size-[18px]" />
      Not supported
    </span>
  )
}

function CapabilityColumn({ title, rows, className }) {
  return (
    <div className={cn("flex min-w-px flex-1 flex-col", className)}>
      <div className="flex h-9 items-center border-b border-neutral-200 bg-neutral-50 px-3 py-2">
        <p className="text-xs leading-4 font-medium text-neutral-950">{title}</p>
      </div>
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={cn(
            "flex items-start justify-between px-3 py-1.5",
            index < rows.length - 1 && "border-b border-neutral-200"
          )}
        >
          <span className="text-xs leading-4 text-neutral-950">{row.label}</span>
          <CapabilityStatus supported={row.supported} />
        </div>
      ))}
    </div>
  )
}

function OverviewMeta({ label, children, withCopy }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-neutral-500">{label}</span>
      <span className="flex items-center text-xs font-medium text-neutral-950">
        {children}
        {withCopy}
      </span>
    </div>
  )
}

function CodeBlock() {
  return (
    <pre className="m-0 font-mono text-[13px] whitespace-pre-wrap text-neutral-600">
      {CODE_SNIPPET.map((line, index) => (
        <div key={index} className="min-h-[1lh]">
          {line.map((token, tokenIndex) => (
            <span key={tokenIndex} className={TONE_CLASS[token.tone]}>
              {token.text}
            </span>
          ))}
        </div>
      ))}
    </pre>
  )
}

const DEMO_BUTTON_ICON_CLASS = "size-4"

// Right-hand card in the header. It changes with the user's request for this product:
// none -> subscribe, waiting -> waiting approval + track, subscribed -> manage.
function AccessCard({ model, status, onSubscribe, onUnderDevelopment }) {
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
            onClick={onUnderDevelopment}
            className={cn("h-8 rounded-lg border-0 px-2", SECONDARY_BUTTON_CLASS)}
          >
            <MonitorPlay className={DEMO_BUTTON_ICON_CLASS} />
          </Button>
          <Button
            variant="outline"
            onClick={onUnderDevelopment}
            className={cn("h-8 rounded-lg border-0 px-3 text-sm", SECONDARY_BUTTON_CLASS)}
          >
            Unsubscribe
          </Button>
          <Button
            onClick={onUnderDevelopment}
            className={cn("h-8 rounded-lg border-0 px-3 text-sm", PRIMARY_BUTTON_CLASS)}
          >
            Write a review
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-[340px] shrink-0 flex-col items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex w-full flex-col gap-1">
        <p className="text-[28px] leading-normal font-semibold text-black">{model.price}</p>
        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between px-1 py-0.5">
            <span className="w-[172.5px] text-xs leading-4 text-neutral-600">Max Token</span>
            <Mono>{model.maxToken}</Mono>
          </div>
          <div className="flex items-center justify-between px-1 py-0.5">
            <span className="w-[172.5px] text-xs leading-4 text-neutral-600">
              Max Completion Token
            </span>
            <Mono>{model.maxCompletionToken}</Mono>
          </div>
          <div className="flex items-center justify-between px-1 py-0.5">
            <span className="flex w-[158.5px] items-center gap-1 text-xs leading-4 text-neutral-600">
              Parameters
              <Info className="size-2.5" />
            </span>
            <Mono>{model.parameters}</Mono>
          </div>
        </div>
      </div>
      {status === "waiting" ? (
        <div className="flex w-full items-center gap-2">
          <Button
            variant="outline"
            aria-label="Get demo"
            onClick={onUnderDevelopment}
            className="size-8 shrink-0 border-neutral-300 bg-white px-0 shadow-xs"
          >
            <MonitorPlay className={DEMO_BUTTON_ICON_CLASS} />
          </Button>
          <div className="flex min-h-8 min-w-px flex-1 items-center justify-between rounded-lg bg-secondary px-3 py-1.5">
            <span className="text-sm leading-5 font-medium text-secondary-foreground">
              Waiting Approval
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={onUnderDevelopment}
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
            onClick={onUnderDevelopment}
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

export default function DetailProductModel() {
  const { id } = useParams()
  const MODEL = MODEL_DETAILS[id]
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const requests = useSubscriptionRequests()
  const accessStatus = getAccessStatus(requests, MODEL?.name)
  const [activeTab, setActiveTab] = useState("overview")
  const [sdkType, setSdkType] = useState(SDK_TYPES[0])

  if (!MODEL) return <Navigate to="/product-catalog" replace />

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
              <img src={logoDefault} alt={`${MODEL.name} logo`} className="size-[100px] shrink-0" />
              <div className="flex min-w-px flex-1 flex-col items-start gap-0.5">
                <h1 className="text-[28px] font-semibold text-black">{MODEL.name}</h1>
                <span className="inline-flex items-center justify-center rounded-lg bg-secondary px-2 py-0.5 text-xs leading-4 font-medium text-secondary-foreground">
                  {MODEL.slug}
                </span>
                <div className="flex h-8 items-center gap-4 text-xs text-neutral-950">
                  <span className="flex items-center gap-0.5">
                    <SquareArrowRightEnter className="size-4" />
                    {MODEL.subscriptions} Subscriptions
                  </span>
                  <span className="flex items-center gap-[3px]">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {MODEL.rating.toFixed(1)}
                    <span className="text-[11px] text-neutral-500">({MODEL.reviews} reviews)</span>
                  </span>
                </div>
                <p className="text-xs leading-4 text-black">{MODEL.summary}</p>
              </div>
            </div>

            <AccessCard
              model={MODEL}
              status={accessStatus}
              onSubscribe={() => setSubscribeOpen(true)}
              onUnderDevelopment={() => toast.info("This feature is under development")}
            />
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-[1274px] flex-col gap-6 px-6 pt-10 pb-[60px]">
          <div className="flex items-center gap-3" role="tablist">
            {[
              { key: "overview", label: "Overview" },
              { key: "reviews", label: "Ratings & Reviews" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => {
                  if (tab.key === "reviews") {
                    toast.info("This feature is under development")
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
              <section className="flex flex-col gap-3">
                <SectionTitle>Product Overview</SectionTitle>
                <p className="text-sm leading-5 text-neutral-800">{MODEL.overview}</p>
                <div className="flex items-center justify-between">
                  <OverviewMeta label="Provider">{MODEL.provider}</OverviewMeta>
                  <div className="h-[23px] w-px bg-neutral-200" />
                  <OverviewMeta
                    label="Public Model Name"
                    withCopy={
                      <button
                        type="button"
                        aria-label="Copy public model name"
                        onClick={() => copyToClipboard(MODEL.publicName, "Public model name")}
                        className="ml-1 text-neutral-500 hover:text-neutral-950"
                      >
                        <Copy className="size-[9px]" />
                      </button>
                    }
                  >
                    {MODEL.publicName}
                  </OverviewMeta>
                  <div className="h-[23px] w-px bg-neutral-200" />
                  <OverviewMeta label="Knowledge cutoff">{MODEL.knowledgeCutoff}</OverviewMeta>
                  <div className="h-[23px] w-px bg-neutral-200" />
                  <OverviewMeta label="Published">{MODEL.published}</OverviewMeta>
                  <div className="h-[23px] w-px bg-neutral-200" />
                  <OverviewMeta label="Version">{MODEL.version}</OverviewMeta>
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <SectionTitle>Support Functionality</SectionTitle>
                <div className="flex items-stretch overflow-clip rounded-xl border border-neutral-200">
                  <CapabilityColumn title="Input Capabilities" rows={MODEL.inputCapabilities} />
                  <div className="w-px bg-neutral-200" />
                  <CapabilityColumn title="Output Capabilities" rows={MODEL.outputCapabilities} />
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <SectionTitle>Documentation</SectionTitle>
                <div className="flex min-h-[526px] flex-col overflow-clip rounded-xl border border-neutral-200">
                  <div className="flex flex-col gap-3 border-b border-neutral-200 bg-neutral-50 px-5 py-2.5">
                    <p className="font-mono text-[13px] font-medium text-black">SDK Type:</p>
                    <div className="flex items-center gap-4">
                      {SDK_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSdkType(type)}
                          className={cn(
                            "h-7 rounded-lg px-3 text-xs font-medium text-neutral-700",
                            sdkType === type
                              ? "bg-neutral-50 shadow-[inset_-1px_0_1px_0_var(--color-neutral-300),inset_1px_0_1px_0_var(--color-neutral-300),inset_0_2px_1px_0_var(--color-neutral-300)]"
                              : "hover:bg-neutral-100"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col bg-white">
                    <div className="flex items-center justify-end px-[11px] py-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            CODE_SNIPPET.map((line) => line.map((t) => t.text).join("")).join("\n"),
                            "Code"
                          )
                        }
                        className="flex items-center gap-1 text-[9px] text-neutral-500 hover:text-neutral-950"
                      >
                        <Copy className="size-[11px]" />
                        Copy code
                      </button>
                    </div>
                    <div className="flex-1 p-4">
                      <CodeBlock />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="flex w-[408px] shrink-0 flex-col gap-6 rounded-xl border border-neutral-200 bg-white px-5 pt-5 pb-[50px]">
              <div className="flex flex-col gap-2">
                <SectionTitle>Model Details</SectionTitle>
                <div className="flex flex-col gap-1.5">
                  <SpecRow label="Model Type">
                    <Mono>{MODEL.modelType}</Mono>
                  </SpecRow>
                  <SpecRow label="Max Token">
                    <Mono>{MODEL.maxToken}</Mono>
                  </SpecRow>
                  <SpecRow label="Max Completion Token">
                    <Mono>{MODEL.maxCompletionToken}</Mono>
                  </SpecRow>
                  <SpecRow label="Parameters" icon={<Info className="size-2.5" />}>
                    <Mono>{MODEL.parameters}</Mono>
                  </SpecRow>
                </div>
              </div>

              <div className="flex flex-col gap-0.5 border-b border-neutral-200">
                <SectionTitle>Allowed Customer</SectionTitle>
                <p className="border-b border-neutral-200 p-1 text-xs text-neutral-600">
                  {MODEL.allowedCustomer}
                </p>
              </div>

              <div className="flex flex-col gap-0.5 border-b border-neutral-200">
                <SectionTitle>Allowed Scopes</SectionTitle>
                <p className="border-b border-neutral-200 p-1 text-xs text-neutral-600">
                  {MODEL.allowedScopes}
                </p>
              </div>

              <div className="flex flex-col gap-0.5 border-b border-neutral-200 pb-3.5">
                <SectionTitle>API Access Guide</SectionTitle>
                <div className="flex items-center justify-between p-1">
                  <span className="w-[172.5px] text-xs text-neutral-600">Public Model Name</span>
                  <span className="flex items-center gap-1.5">
                    <Mono>{MODEL.publicName}</Mono>
                    <CopyButton value={MODEL.publicName} label="Public model name" />
                  </span>
                </div>
                <div className="flex items-center justify-between p-1">
                  <span className="w-[172.5px] text-xs text-neutral-600">Lite LLM Endpoint</span>
                  <span className="flex items-center gap-1.5">
                    <Mono>{MODEL.endpoint}</Mono>
                    <CopyButton value={MODEL.endpoint} label="Endpoint" />
                  </span>
                </div>
                {accessStatus === "subscribed" ? (
                  <div className="flex items-start justify-between p-1">
                    <span className="w-[172.5px] text-xs text-neutral-600">API Key</span>
                    <div className="flex w-[119px] flex-col gap-2.5">
                      <Button
                        variant="outline"
                        onClick={() => toast.info("This feature is under development")}
                        className="h-6 min-h-6 w-full border-neutral-300 bg-white px-2 text-xs font-medium text-neutral-950 shadow-xs"
                      >
                        Show my API Key
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toast.info("This feature is under development")}
                        className="h-6 min-h-6 w-full border-neutral-300 bg-white px-2 text-xs font-medium text-neutral-950 shadow-xs"
                      >
                        Get new API Key
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-8 items-center justify-between p-1">
                    <span className="w-[172.5px] text-xs text-neutral-600">API Key</span>
                    <Button
                      variant="outline"
                      disabled
                      className="h-6 min-h-6 border-neutral-300 bg-white px-2 text-xs font-medium text-neutral-950 opacity-50 shadow-xs"
                    >
                      Subscribe to get API Key
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <SectionTitle>Model Capabilities</SectionTitle>
                <div className="flex flex-col gap-1.5">
                  {MODEL.capabilities.map((capability) => (
                    <div
                      key={capability.title}
                      className="flex flex-col gap-0.5 border-b border-neutral-200 p-1"
                    >
                      <p className="text-xs font-medium text-neutral-950">{capability.title}</p>
                      <p className="text-xs text-neutral-600">{capability.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2.5">
                  <SectionTitle>Publisher Team</SectionTitle>
                  <PublisherAvatars
                    avatars={MODEL.publisherAvatars}
                    more={MODEL.publisherMore}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <SectionTitle>Classification</SectionTitle>
                  <div>
                    <Tag>Model</Tag>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <SectionTitle>Tags</SectionTitle>
                  <div className="flex gap-1.5">
                    {MODEL.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
      <SubscribeDialog
        open={subscribeOpen}
        onOpenChange={setSubscribeOpen}
        product={{ name: MODEL.name, type: "Model" }}
      />
    </div>
  )
}

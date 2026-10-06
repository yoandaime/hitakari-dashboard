import { CURRENT_USER } from "@/data/current-user"

export const REQUEST_TYPES = ["New Subscription", "Additional Key"]
export const PRODUCT_TYPES = ["Model", "REST"]

// Only New Subscription for Model and REST products is built end to end so far. Other rows
// still show, but disabled. Add a type here once its flow is developed.
const DEVELOPED_REQUEST_TYPES = ["New Subscription"]
const DEVELOPED_PRODUCT_TYPES = ["Model", "REST"]

export function isDeveloped(request) {
  return (
    DEVELOPED_REQUEST_TYPES.includes(request.requestType) &&
    DEVELOPED_PRODUCT_TYPES.includes(request.productType)
  )
}
export const STATUSES = ["Waiting Admin", "Waiting Owner", "Waiting Superior", "Approved", "Rejected"]

// Superior comes first: it is the first step of the approval chain.
export const APPROVAL_TABS = [
  { key: "superior", label: "Superior Approval" },
  { key: "admin", label: "Admin Approval" },
  { key: "owner", label: "Owner Approval" },
]

export const RESET_OPTIONS = [
  { value: "none", label: "No Reset" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
]

// Approval chain order. A request moves to the next stage once the current one approves.
export const STAGES = ["superior", "admin", "owner"]

export const WAITING_LABEL_BY_STAGE = {
  superior: "Waiting Superior",
  admin: "Waiting Admin",
  owner: "Waiting Owner",
}

const STATE_BY_LABEL = {
  "Waiting Superior": "waiting",
  "Waiting Admin": "waiting",
  "Waiting Owner": "waiting",
  Approved: "approved",
  Rejected: "rejected",
}

// A request that is approved at one stage is waiting at the next one.
export function initialStatuses(stage, state) {
  const statuses = { [stage]: state }
  const next = STAGES[STAGES.indexOf(stage) + 1]
  if (state === "approved" && next) statuses[next] = "waiting"
  return statuses
}

// Each product keeps one product type, so the same product never shows both.
const PRODUCTS = {
  "Claude Opus 5.5": "Model",
  "Claude Sonnet 5.5": "Model",
  "Claude Haiku 4.5": "Model",
  "Gemini 2.5 Pro": "Model",
  "Llama 4 Maverick": "Model",
  "Mistral Large 3": "Model",
  "Speech-to-Text API": "REST",
  "Document OCR API": "REST",
  "Sentiment Analysis API": "REST",
  "Text Embedding API": "REST",
  "Translation API": "REST",
}

const DEPARTMENTS = [
  "Department of Human Resources",
  "Department of Customer Care",
  "Department of Digital Business",
  "Department of Network Operations",
]

const USE_CASES = [
  "our internal customer support automation pipeline, classifying incoming tickets and drafting first responses",
  "summarising long operational reports so that managers can review them in minutes instead of hours",
  "an employee-facing knowledge assistant that answers HR and policy questions",
  "extracting structured data from scanned contracts and invoices for the finance team",
  "analysing customer feedback across channels to spot recurring complaints earlier",
]

// Seed dates are written as "2026-10-05T09:42" (local time) and stored as ISO strings.
function at(text) {
  return new Date(text).toISOString()
}

let nextId = 1

function row(stage, name, product, requestType, status, requestedDate) {
  const id = nextId++
  const handle = name.toLowerCase().replace(/[^a-z ]/g, "").split(" ")
  const hasRoiDocument = id % 3 !== 0
  return {
    id,
    statuses: initialStatuses(stage, STATE_BY_LABEL[status]),
    name,
    email: `${handle[0]}.${handle[handle.length - 1][0]}@telkomsel.co.id`,
    product,
    subscriptionId: `SUB-2026-${String(140 - id).padStart(4, "0")}`,
    requestType,
    productType: PRODUCTS[product],
    requestedAt: at(requestedDate),
    budgetRequest: [24, 48, 36, 60, 120][id % 5],
    budgetSource: id % 4 === 0 ? "Business Use" : "Personal Use",
    department: DEPARTMENTS[id % DEPARTMENTS.length],
    brNumber: `BR-2026-${String(100 + id).padStart(3, "0")}`,
    brDocument: { name: `proposal_${handle[0]}.pdf`, size: `${(1.2 + (id % 5) * 0.4).toFixed(1)} MB` },
    roiPeriod: id % 2 === 0 ? "month" : "year",
    roi: [78, 45, 120, 62, 90][id % 5],
    roiDocument: hasRoiDocument
      ? { name: `roi_calculation_${handle[0]}.pdf`, size: `${(0.6 + (id % 4) * 0.3).toFixed(1)} MB` }
      : null,
    objective: `We need access to ${product} to power ${USE_CASES[id % USE_CASES.length]}.`,
  }
}

const OTHER_SEED_REQUESTS = [
  // Superior approval
  row("superior", "Rizky Pratama", "Claude Sonnet 5.5", "New Subscription", "Waiting Superior", "2026-10-05T09:42"),
  row("superior", "Anisa Putri", "Speech-to-Text API", "New Subscription", "Waiting Superior", "2026-10-05T08:15"),
  row("superior", "Fajar Nugroho", "Claude Haiku 4.5", "Additional Key", "Waiting Superior", "2026-10-04T16:30"),
  row("superior", "Dewi Lestari", "Document OCR API", "New Subscription", "Waiting Superior", "2026-10-04T14:05"),
  row("superior", "Bayu Setiawan", "Gemini 2.5 Pro", "New Subscription", "Waiting Superior", "2026-10-03T11:20"),
  row("superior", "Intan Permata", "Sentiment Analysis API", "Additional Key", "Waiting Superior", "2026-10-02T15:48"),
  row("superior", "Hendra Wijaya", "Claude Opus 5.5", "New Subscription", "Approved", "2026-10-02T10:12"),
  row("superior", "Sari Wulandari", "Text Embedding API", "New Subscription", "Approved", "2026-10-01T13:36"),
  row("superior", "Dimas Saputro", "Llama 4 Maverick", "New Subscription", "Rejected", "2026-09-30T17:09"),
  row("superior", "Putri Maharani", "Translation API", "Additional Key", "Approved", "2026-09-30T09:27"),
  row("superior", "Agus Salim", "Mistral Large 3", "New Subscription", "Waiting Superior", "2026-09-29T14:51"),
  row("superior", "Lestari Handayani", "Claude Sonnet 5.5", "Additional Key", "Rejected", "2026-09-29T08:03"),
  row("superior", "Eko Prasetyo", "Speech-to-Text API", "New Subscription", "Approved", "2026-09-28T16:44"),

  // Admin approval
  row("admin", "Maya Anggraini", "Claude Sonnet 5.5", "Additional Key", "Waiting Admin", "2026-10-04T15:10"),
  row("admin", "Teguh Hidayat", "Llama 4 Maverick", "New Subscription", "Waiting Admin", "2026-10-03T08:40"),
  row("admin", "Wulan Cahyani", "Text Embedding API", "New Subscription", "Approved", "2026-10-01T14:18"),

  // Owner approval
  row("owner", "Citra Kirana", "Claude Opus 5.5", "New Subscription", "Waiting Owner", "2026-10-03T10:30"),
  row("owner", "Yoga Aditya", "Document OCR API", "Additional Key", "Waiting Owner", "2026-10-02T13:15"),
  row("owner", "Nadia Safitri", "Gemini 2.5 Pro", "New Subscription", "Approved", "2026-10-01T09:50"),
  row("owner", "Galih Ramadhan", "Translation API", "New Subscription", "Rejected", "2026-09-30T11:22"),
]

// Subscriptions the current user requested, with the decision made at each approval stage.
// A decision is [state, "who", "date", optional reason]; a stage without one hasn't been reached.
function mine(product, productType, budgetSource, reason, requestedDate, decisions, extra = {}) {
  const base = row("superior", CURRENT_USER.name, product, "New Subscription", "Waiting Superior", requestedDate)
  const statuses = {}
  const stamped = {}
  const approvals = {}
  Object.entries(decisions).forEach(([stage, [state, by, date, note]]) => {
    statuses[stage] = state
    if (state === "waiting") return
    stamped[stage] = { by, at: at(date) }
    if (state === "approved") approvals[stage] = { reason: note }
  })
  return {
    ...base,
    productType,
    budgetSource,
    objective: reason,
    email: CURRENT_USER.email,
    subscriptionId: `SUB-2026-${String(200 - base.id).padStart(4, "0")}`,
    statuses,
    decisions: stamped,
    approvals,
    ...extra,
  }
}

const SELF = CURRENT_USER.name

export const MY_SEED_SUBSCRIPTIONS = [
  mine("Infinity Insight", "REST", "Personal Use", "Subscribe product to power our reporting dashboards", "2026-09-04T13:31", {
    superior: ["approved", SELF, "2026-09-04T13:40", "Approved by myself, I own the team budget."],
    admin: ["waiting"],
  }),
  mine("Predictive Analytics", "REST", "Personal Use", "Test Subscribe Product for churn forecasting", "2026-09-02T09:33", {
    superior: ["approved", "Rina Kusuma", "2026-09-02T10:05", "Aligned with the team plan."],
    admin: ["approved", "Admin Hitakari", "2026-09-02T11:20", "Budget verified."],
    owner: ["approved", "Budi Santoso", "2026-09-02T14:02", "Access granted."],
  }),
  mine("Visionary AI (3)", "REST", "Business Use", "Subscribe for testing image understanding", "2026-08-27T16:24", {
    superior: ["waiting"],
  }),
  mine("Predictive Insights", "Model", "Personal Use", "Subscribe again for the next quarter", "2026-09-07T08:36", {
    superior: ["approved", "Rina Kusuma", "2026-09-07T09:10", "Approved."],
    admin: ["approved", "Admin Hitakari", "2026-09-07T10:00", "Budget verified."],
    owner: ["approved", "Budi Santoso", "2026-09-07T11:45", "Access granted."],
  }),
  mine("DeepLearn Analytics", "Model", "Personal Use", "Subscribe again for the next quarter", "2026-09-07T08:36", {
    superior: ["approved", "Rina Kusuma", "2026-09-07T09:12", "Approved."],
    admin: ["waiting"],
  }),
  mine("AutoCode Generator", "Model", "Business Use", "Subscribe again for developer tooling", "2026-09-07T08:36", {
    superior: ["approved", SELF, "2026-09-07T08:50", "Self-approved, within my approval limit."],
    admin: ["approved", "Admin Hitakari", "2026-09-07T09:30", "Budget verified."],
    owner: ["approved", "Budi Santoso", "2026-09-07T13:15", "Access granted."],
  }),
  mine("SmartChat Assistant", "Model", "Personal Use", "Subscribe again for customer care chat", "2026-09-07T08:36", {
    superior: ["approved", "Rina Kusuma", "2026-09-07T09:20", "Approved."],
    admin: ["approved", "Admin Hitakari", "2026-09-07T10:15", "Budget verified."],
    owner: ["waiting"],
  }),
  mine("QuantumText AI Writer", "Model", "Personal Use", "Subscribe again for drafting reports", "2026-09-07T08:36", {
    superior: ["waiting"],
  }),
  mine("NeuralNet Vision Pro", "Model", "Business Use", "Subscribe again for visual inspection", "2026-09-07T08:36", {
    superior: ["approved", "Rina Kusuma", "2026-09-07T09:25", "Approved."],
    admin: ["rejected", "Admin Hitakari", "2026-09-07T10:40"],
  }),
  mine("Cognitive Core", "Model", "Personal Use", "Subscribe for internal knowledge search", "2026-09-03T15:02", {
    superior: ["approved", "Rina Kusuma", "2026-09-03T15:30", "Approved."],
    admin: ["approved", "Admin Hitakari", "2026-09-03T16:10", "Budget verified."],
    owner: ["approved", "Budi Santoso", "2026-09-04T09:00", "Access granted."],
  }),
]

export const SEED_SUBSCRIPTION_REQUESTS = [...MY_SEED_SUBSCRIPTIONS, ...OTHER_SEED_REQUESTS]

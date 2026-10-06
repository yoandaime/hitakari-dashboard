import { MODEL_DETAILS } from "@/data/model-detail-data"
import { REST_DETAILS } from "@/data/rest-detail-data"
import logoDefault from "@/assets/portal/logo-default.svg"

export const CATEGORIES = [
  "Agent",
  "Apps",
  "Model",
  "Data Source",
  "Analytics",
  "Integration",
  "Automation",
  "Extension",
]

export const FILTER_SECTIONS = [
  {
    key: "domains",
    title: "Domains",
    options: ["Assistance", "Business", "Finance", "Governance", "Human Capital", "Technology"],
  },
  {
    key: "objectives",
    title: "Objectives",
    options: [
      "Conversational Chatbot / assistant",
      "Extraction and Insight",
      "Network Optimization",
      "Personalization",
    ],
  },
  { key: "targetCustomer", title: "Target Customer", options: [] },
  { key: "corporations", title: "Corporations", options: [] },
  { key: "businessImpact", title: "Business Impact", options: [] },
  { key: "stage", title: "Stage", options: [] },
  { key: "providers", title: "Providers", options: [] },
]

export const SORT_OPTIONS = [
  { value: "subscribed", label: "Most Subscribed" },
  { value: "rating", label: "Highest Rated" },
  { value: "name", label: "Name (A–Z)" },
]

const SEARCH_DESCRIPTION =
  "The next generation of real-time intelligent search engine for AI provides multi-channel and full-network content in a user-friendly format for your applications."

// Cards for products of type "Model" are derived from MODEL_DETAILS so the
// catalog and the detail page always show the same title, provider and summary.
function modelProduct(id, overrides = {}) {
  const d = MODEL_DETAILS[id]
  return product(id, d.name, {
    provider: d.slug,
    rating: d.rating,
    subscribers: d.subscriptions,
    description: d.summary,
    tags: d.tags,
    type: "Model",
    ...overrides,
  })
}

// Same idea for REST products, which live under the "Apps" category of the portal.
function restProduct(id, overrides = {}) {
  const d = REST_DETAILS[id]
  return product(id, d.name, {
    provider: d.provider,
    rating: d.rating,
    subscribers: d.subscriptions,
    description: d.summary,
    tags: d.tags,
    type: "Apps",
    ...overrides,
  })
}

function product(id, name, overrides = {}) {
  return {
    id,
    name,
    provider: "Anspire / anspire_search",
    rating: 5.0,
    subscribers: 400,
    description: SEARCH_DESCRIPTION,
    tags: ["#tags", "#tags"],
    labels: ["Live", "Models"],
    type: "Agent",
    domains: [],
    objectives: [],
    logo: logoDefault,
    bookmarked: false,
    top: false,
    ...overrides,
  }
}

export const PRODUCTS = [
  restProduct("veronica", {
    labels: ["Live", "Machine Learning"],
    domains: ["Business", "Finance"],
    objectives: ["Conversational Chatbot / assistant"],
    top: true,
  }),
  modelProduct("claude-haiku-6", {
    labels: ["Live", "Models"],
    domains: ["Finance", "Business"],
    bookmarked: true,
    top: true,
  }),
  product("deep-vision-ai", "Deep Vision AI", {
    labels: ["Dev", "Models"],
    type: "Analytics",
    top: true,
  }),
  product("verity-analytics", "Verity Analytics", {
    provider: "Gemini",
    type: "Analytics",
    bookmarked: true,
  }),
  modelProduct("gemini-flash-2-5", {
    domains: ["Business", "Technology"],
  }),
  modelProduct("llama-4-scout", {
    labels: ["Pre-Prod", "Models"],
    domains: ["Governance", "Technology"],
    objectives: ["Extraction and Insight"],
  }),
  modelProduct("mistral-large-3", {
    labels: ["Dev", "Models"],
    domains: ["Assistance", "Human Capital"],
    objectives: ["Conversational Chatbot / assistant"],
  }),
  restProduct("orion-credit-scoring", {
    labels: ["Live", "Machine Learning"],
    domains: ["Finance", "Governance"],
    objectives: ["Extraction and Insight"],
  }),
  restProduct("atlas-churn-predictor", {
    labels: ["Live", "Machine Learning"],
    domains: ["Business", "Technology"],
    objectives: ["Personalization"],
  }),
  product("sentient-systems", "Sentient Systems", { type: "Agent" }),
  product("pragma-labs", "Pragma Labs", { type: "Automation" }),
  product("foresight-ai", "Foresight AI", { type: "Analytics" }),
  product("clarity-ai", "Clarity AI", { type: "Data Source" }),
  product("innovision-ai", "Innovision AI", { type: "Integration" }),
]

export const PAGE_SIZE = 9

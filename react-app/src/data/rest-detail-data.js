import publisher1 from "@/assets/product-detail/rest/publisher-1.png"
import publisher2 from "@/assets/product-detail/rest/publisher-2.png"
import publisher3 from "@/assets/product-detail/rest/publisher-3.png"
import publisher4 from "@/assets/product-detail/rest/publisher-4.png"
import gallery1 from "@/assets/product-detail/rest/gallery-1.png"
import gallery2 from "@/assets/product-detail/rest/gallery-2.png"
import gallery3 from "@/assets/product-detail/rest/gallery-3.png"
import gallery4 from "@/assets/product-detail/rest/gallery-4.png"

const PUBLISHERS = [publisher1, publisher2, publisher3, publisher4]
const GALLERY = [gallery1, gallery2, gallery3, gallery4]

// How a REST product can be reached from the portal:
//   "open"       -> anyone can request it (subscribe -> waiting approval -> subscribed)
//   "restricted" -> the user's organizational scope is not allowed to subscribe
//   "takedown"   -> the product was withdrawn and can't be accessed anymore
export const REST_AVAILABILITY = {
  OPEN: "open",
  RESTRICTED: "restricted",
  TAKEDOWN: "takedown",
}

const HOW_TO_USE = [
  "Using our innovative AI product is simple! Just follow these six steps:",
  "",
  "1. Setup: Place the device on a flat surface and connect it to a power source.",
  "2. Connect: Use Wi-Fi or USB to link the device to your network.",
  "3. App Installation: Download the companion app on your smartphone or tablet.",
  "4. Content Upload: Transfer your files through the app or USB connection.",
  "5. Configuration: Adjust the settings to suit your preferences for optimal performance.",
  "6. Start: Power on the device and enjoy your enhanced experience!",
]

// Rich text block under "Additional Content". `size` picks the body text size of the section.
const ADDITIONAL_CONTENT = [
  {
    heading: "Key Capabilities",
    items: [
      {
        title: "1. Real-Time Performance Dashboard",
        description:
          "Provide interactive dashboards that visualize key business metrics across multiple data sources.",
        bullets: [
          "Customizable KPI widgets",
          "Drill-down capability (region, product, time period)",
          "Live data refresh from analytic and speed layers",
          "Responsive display for desktop and mobile",
        ],
      },
      {
        title: "2. Automated Data Integration",
        description:
          "Seamlessly connect and consolidate data from various internal systems into a unified view.",
        bullets: [
          "Integration with analytic and speed layers",
          "API-ready for external systems",
          "Structured dataset compatibility (SQL-based)",
          "Scheduled and on-demand data refresh",
        ],
      },
    ],
  },
  {
    heading: "Business Use Cases",
    items: [
      {
        title: "1. Executive Performance Monitoring",
        description: [
          "Enable leadership to monitor company-wide KPIs in real time, including revenue trends, operational efficiency, and regional performance.",
          "Provides a single source of truth for strategic decision-making.",
        ],
      },
      {
        title: "2. Operational Efficiency Tracking",
        description: [
          "Track daily operational metrics across departments to identify bottlenecks, SLA breaches, and performance gaps.",
          "Helps teams respond proactively before issues impact business outcomes.",
        ],
      },
      {
        title: "3. Revenue & Growth Analysis",
        bullets: [
          "Analyze revenue trends and customer segments",
          "Detect underperforming products or regions",
          "Support data-driven prioritization and investment decisions",
        ],
      },
    ],
  },
]

function restDetail(id, overrides) {
  return {
    id,
    gallery: GALLERY,
    price: "FREE",
    howToUse: HOW_TO_USE,
    corporation: "B2B",
    appCapabilities: "embed on MyTelkomsel, Telegram Bot",
    objective: "Objective",
    domains: "Governance",
    targetCustomer: "Internal",
    additionalContent: ADDITIONAL_CONTENT,
    classification: "Machine Learning",
    allowedCustomer: "Internal",
    allowedScopes: "All - All",
    publisherAvatars: PUBLISHERS,
    publisherMore: 5,
    availability: REST_AVAILABILITY.OPEN,
    ...overrides,
  }
}

// Detail data for every product of type "Apps" (REST). The catalog cards in
// product-catalog-data.js are derived from this, so card and detail page always agree.
export const REST_DETAILS = {
  veronica: restDetail("veronica", {
    name: "Veronica",
    provider: "Azure, Gemini",
    subscriptions: 30,
    rating: 5.0,
    reviews: 24,
    summary:
      "AI chatbot for product knowledge to end customer, complain handling, and customer profiling management",
    description:
      "An intelligent AI platform for business. Get the insights you need to work smarter and faster.",
    priceNote: "Subscribe and submit credential to unlock all feature",
    tags: ["#Business", "#Finance"],
  }),

  "orion-credit-scoring": restDetail("orion-credit-scoring", {
    name: "Orion Credit Scoring",
    provider: "Azure, OpenAI",
    subscriptions: 18,
    rating: 4.6,
    reviews: 11,
    summary:
      "Scoring service that rates the credit risk of postpaid applicants from usage and payment history in near real time.",
    description:
      "A risk scoring platform for the finance team. Rate postpaid applicants consistently and explain every score.",
    capabilities: "Conversational Chatbot / assistant",
    restrictedReason:
      "User organizational scope does not meet the allowed subscription criteria for this service.",
    allowedScopes: "Department - Finance",
    tags: ["#Finance", "#Governance"],
    availability: REST_AVAILABILITY.RESTRICTED,
  }),

  "atlas-churn-predictor": restDetail("atlas-churn-predictor", {
    name: "Atlas Churn Predictor",
    provider: "Gemini",
    subscriptions: 42,
    rating: 4.4,
    reviews: 17,
    summary:
      "Predicts which subscribers are likely to churn in the next 30 days so retention teams can act before they leave.",
    description:
      "A churn prediction service for retention campaigns. This product has been withdrawn from the marketplace.",
    tags: ["#Business", "#Technology"],
    availability: REST_AVAILABILITY.TAKEDOWN,
  }),
}

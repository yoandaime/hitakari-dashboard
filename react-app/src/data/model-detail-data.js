import publisher1 from "@/assets/product-detail/publisher-1.png"
import publisher2 from "@/assets/product-detail/publisher-2.png"
import publisher3 from "@/assets/product-detail/publisher-3.png"
import publisher4 from "@/assets/product-detail/publisher-4.png"

const PUBLISHERS = [publisher1, publisher2, publisher3, publisher4]

// Detail data for every product of type "Model". The catalog cards in
// product-catalog-data.js are derived from this, so card and detail page always agree.
export const MODEL_DETAILS = {
  "claude-haiku-6": {
    id: "claude-haiku-6",
    name: "Claude Haiku 6.0",
    slug: "anthropic/claude haiku-6.0",
    subscriptions: 30,
    rating: 5.0,
    reviews: 24,
    summary:
      "Fast and lightweight AI model optimized for quick responses, efficient reasoning, and cost-effective everyday tasks.",
    price: "FREE",
    overview:
      "Claude Haiku 6.0 is Anthropic's fastest model, tuned for near-instant responses. It pairs strong reasoning with a small footprint, making it a good fit for chat assistants, classification, and high-volume back-office automation.",
    provider: "Anthropic",
    publicName: "anthropic/haiku-6.0",
    knowledgeCutoff: "Jan 2026",
    published: "Mar 30, 2026",
    version: "v.1.1",
    modelType: "chat/completions",
    maxToken: "295,000 Tokens",
    maxCompletionToken: "350,000 Tokens",
    parameters: "7.24B",
    endpoint: "chat/completions",
    allowedCustomer: "Internal",
    allowedScopes: "Department - ALL",
    capabilities: [
      {
        title: "Function Calling (Tool Use)",
        description:
          "Model can invoke external tools or APIs by generating structured JSON calls during inference.",
      },
      {
        title: "File Upload",
        description:
          "Model supports uploading documents such as PDFs, spreadsheets, or text files as context.",
      },
    ],
    inputCapabilities: [
      { label: "Text", supported: true },
      { label: "Image", supported: true },
      { label: "Audio", supported: true },
      { label: "Video", supported: false },
    ],
    outputCapabilities: [
      { label: "Text", supported: true },
      { label: "Image", supported: true },
      { label: "Transcription", supported: true },
      { label: "Audio", supported: false },
    ],
    publisherAvatars: PUBLISHERS,
    publisherMore: 5,
    tags: ["#Finance", "#Business"],
  },

  "gemini-flash-2-5": {
    id: "gemini-flash-2-5",
    name: "Gemini Flash 2.5",
    slug: "google/gemini-flash-2.5",
    subscriptions: 128,
    rating: 4.9,
    reviews: 61,
    summary:
      "Multimodal model built for low-latency responses, handling text, image, and audio input at scale for high-volume workloads.",
    price: "Rp 150 / 1K Tokens",
    overview:
      "Gemini Flash 2.5 is Google's latency-optimized multimodal model. It accepts text, image, audio, and video input in a single request and streams answers back quickly, which suits contact-center tooling, document triage, and real-time summarization.",
    provider: "Google",
    publicName: "google/gemini-flash-2.5",
    knowledgeCutoff: "Aug 2025",
    published: "Feb 12, 2026",
    version: "v.2.5",
    modelType: "chat/completions",
    maxToken: "1,000,000 Tokens",
    maxCompletionToken: "65,000 Tokens",
    parameters: "Undisclosed",
    endpoint: "chat/completions",
    allowedCustomer: "Internal & Partner",
    allowedScopes: "Department - Technology, Business",
    capabilities: [
      {
        title: "Multimodal Understanding",
        description:
          "Model reasons over text, images, audio, and video supplied together in the same request.",
      },
      {
        title: "Streaming Responses",
        description:
          "Model streams tokens as they are generated so interfaces can respond with minimal delay.",
      },
      {
        title: "Function Calling (Tool Use)",
        description:
          "Model can invoke external tools or APIs by generating structured JSON calls during inference.",
      },
    ],
    inputCapabilities: [
      { label: "Text", supported: true },
      { label: "Image", supported: true },
      { label: "Audio", supported: true },
      { label: "Video", supported: true },
    ],
    outputCapabilities: [
      { label: "Text", supported: true },
      { label: "Image", supported: false },
      { label: "Transcription", supported: true },
      { label: "Audio", supported: false },
    ],
    publisherAvatars: PUBLISHERS.slice(0, 3),
    publisherMore: 12,
    tags: ["#Business", "#Technology"],
  },

  "llama-4-scout": {
    id: "llama-4-scout",
    name: "Llama 4 Scout",
    slug: "meta/llama-4-scout",
    subscriptions: 85,
    rating: 4.8,
    reviews: 37,
    summary:
      "Open-weight language model with a long context window, suited for document analysis, summarization, and internal knowledge search.",
    price: "FREE",
    overview:
      "Llama 4 Scout is Meta's open-weight model with an extended context window. Hosted inside Telkomsel's own infrastructure, it keeps sensitive documents on-premise while still supporting long-form summarization and retrieval-augmented question answering.",
    provider: "Meta",
    publicName: "meta/llama-4-scout",
    knowledgeCutoff: "Dec 2025",
    published: "Jan 20, 2026",
    version: "v.4.0",
    modelType: "chat/completions",
    maxToken: "512,000 Tokens",
    maxCompletionToken: "32,000 Tokens",
    parameters: "17B",
    endpoint: "chat/completions",
    allowedCustomer: "Internal",
    allowedScopes: "Department - Governance, Technology",
    capabilities: [
      {
        title: "Long Context",
        description:
          "Model keeps hundreds of thousands of tokens in context, so whole reports can be analysed in one pass.",
      },
      {
        title: "Retrieval Adapter",
        description:
          "Model pulls fresh context from connected indexes without inflating the prompt.",
      },
    ],
    inputCapabilities: [
      { label: "Text", supported: true },
      { label: "Image", supported: true },
      { label: "Audio", supported: false },
      { label: "Video", supported: false },
    ],
    outputCapabilities: [
      { label: "Text", supported: true },
      { label: "Image", supported: false },
      { label: "Transcription", supported: false },
      { label: "Audio", supported: false },
    ],
    publisherAvatars: PUBLISHERS.slice(1),
    publisherMore: 3,
    tags: ["#Governance", "#Technology"],
  },

  "mistral-large-3": {
    id: "mistral-large-3",
    name: "Mistral Large 3",
    slug: "mistral/mistral-large-3",
    subscriptions: 52,
    rating: 4.7,
    reviews: 19,
    summary:
      "General-purpose reasoning model with strong multilingual support, ideal for customer care assistants and content drafting.",
    price: "Rp 90 / 1K Tokens",
    overview:
      "Mistral Large 3 is a general-purpose reasoning model with solid Bahasa Indonesia and English performance. It follows long instructions reliably, which makes it a dependable choice for customer care assistants, email drafting, and HR knowledge helpers.",
    provider: "Mistral AI",
    publicName: "mistral/mistral-large-3",
    knowledgeCutoff: "Oct 2025",
    published: "Apr 08, 2026",
    version: "v.3.0",
    modelType: "chat/completions",
    maxToken: "128,000 Tokens",
    maxCompletionToken: "16,000 Tokens",
    parameters: "123B",
    endpoint: "chat/completions",
    allowedCustomer: "Internal",
    allowedScopes: "Department - Assistance, Human Capital",
    capabilities: [
      {
        title: "Multilingual Reasoning",
        description:
          "Model follows instructions and answers consistently across Bahasa Indonesia, English, and other major languages.",
      },
      {
        title: "JSON Mode",
        description:
          "Model can be constrained to return valid JSON so responses plug straight into downstream systems.",
      },
    ],
    inputCapabilities: [
      { label: "Text", supported: true },
      { label: "Image", supported: false },
      { label: "Audio", supported: false },
      { label: "Video", supported: false },
    ],
    outputCapabilities: [
      { label: "Text", supported: true },
      { label: "Image", supported: false },
      { label: "Transcription", supported: false },
      { label: "Audio", supported: false },
    ],
    publisherAvatars: PUBLISHERS.slice(0, 2),
    publisherMore: 8,
    tags: ["#Assistance", "#Human Capital"],
  },
}

import { useSyncExternalStore } from "react"

import { CURRENT_USER } from "@/data/current-user"
import {
  SEED_SUBSCRIPTION_REQUESTS,
  STAGES,
  WAITING_LABEL_BY_STAGE,
} from "@/data/subscription-request-data"

// Shared between the product detail page (which creates requests) and the
// Subscription Request page (which approves them). localStorage keeps it across reloads.
const STORAGE_KEY = "hitakari.subscription-requests.v6"

function load() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(stored)) return stored
  } catch {
    // Storage can be blocked or corrupted; fall back to the seed.
  }
  return SEED_SUBSCRIPTION_REQUESTS
}

let requests = load()
const listeners = new Set()

function commit(next) {
  requests = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Non-persistent session is fine.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSubscriptionRequests() {
  return useSyncExternalStore(subscribe, () => requests)
}

function nextSubscriptionId() {
  const highest = requests.reduce((max, r) => {
    const n = Number(r.subscriptionId.split("-").pop())
    return Number.isFinite(n) ? Math.max(max, n) : max
  }, 0)
  return `SUB-2026-${String(highest + 1).padStart(4, "0")}`
}

// New requests land at the top of the Superior Approval tab.
export function addSubscriptionRequest(request) {
  const created = {
    id: Date.now(),
    statuses: { superior: "waiting" },
    requestType: "New Subscription",
    requestedAt: new Date().toISOString(),
    subscriptionId: nextSubscriptionId(),
    ...request,
  }
  commit([created, ...requests])
  return created
}


// Who decided and when, so the requester can trace every step. Whoever is signed in decides.
function newDecision() {
  return { by: CURRENT_USER.name, at: new Date().toISOString() }
}

// Overall state of a request for its requester: any rejection ends it, the owner is the last step.
export function getOverallStatus(request) {
  const states = Object.values(request.statuses)
  if (states.includes("rejected")) return "Rejected"
  return request.statuses.owner === "approved" ? "Approved" : "Waiting"
}

// Label shown in the table for a request at the given stage.
export function getStageStatusLabel(request, stage) {
  const state = request.statuses[stage]
  if (state === "approved") return "Approved"
  if (state === "rejected") return "Rejected"
  return WAITING_LABEL_BY_STAGE[stage]
}

// Approves the request at `stage` and hands it to the next stage, if there is one.
export function approveAtStage(id, stage, approval) {
  commit(
    requests.map((r) => {
      if (r.id !== id) return r
      const next = STAGES[STAGES.indexOf(stage) + 1]
      return {
        ...r,
        statuses: { ...r.statuses, [stage]: "approved", ...(next && { [next]: "waiting" }) },
        approvals: { ...r.approvals, [stage]: approval },
        decisions: { ...r.decisions, [stage]: newDecision() },
      }
    })
  )
}

export function rejectAtStage(id, stage) {
  commit(
    requests.map((r) =>
      r.id === id
        ? {
            ...r,
            statuses: { ...r.statuses, [stage]: "rejected" },
            decisions: { ...r.decisions, [stage]: newDecision() },
          }
        : r
    )
  )
}

// The newest request of the current user for a product decides what its detail page shows.
// A rejected request goes back to "none" so the user can request again.
export function getAccessStatus(requests, productName) {
  const mine = requests.find(
    (r) =>
      r.name === CURRENT_USER.name &&
      r.product === productName &&
      r.requestType === "New Subscription" &&
      !Object.values(r.statuses).includes("rejected")
  )
  if (!mine) return "none"
  return mine.statuses.owner === "approved" ? "subscribed" : "waiting"
}

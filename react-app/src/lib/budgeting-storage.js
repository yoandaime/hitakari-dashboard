import { STORAGE_PREFIX } from "@/lib/demo-data"

const STORAGE_KEY = `${STORAGE_PREFIX}budgeting.v1`

// JSON turns history dates into strings; turn them back into Dates.
function reviveDates(key, value) {
  return key === "date" && typeof value === "string" ? new Date(value) : value
}

export function loadDivisions(seed) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY), reviveDates)
    if (Array.isArray(stored)) return stored
  } catch {
    // Storage can be blocked or corrupted; fall back to the seed.
  }
  return seed
}

export function saveDivisions(divisions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(divisions))
  } catch {
    // Non-persistent session is fine.
  }
}

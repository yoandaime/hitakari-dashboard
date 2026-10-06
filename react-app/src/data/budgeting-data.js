// Mock data for the Budgeting menu, generated bottom-up so parent totals are
// always internally consistent with their children:
//   division.totalBudget >= division.allocated == sum(team.totalBudget)
//   team.totalBudget      >= team.allocated      == sum(key.budget)
//   team.spend             == sum(key.spend)   (<= team.allocated)

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

let rngState = 1234567
function rng() {
  // mulberry32 — deterministic so the mock dataset is stable across renders
  rngState |= 0
  rngState = (rngState + 0x6d2b79f5) | 0
  let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function randInt(min, max) {
  return Math.floor(rng() * (max - min + 1)) + min
}

function pick(list, index) {
  return list[index % list.length]
}

function randomHex(length) {
  const chars = "abcdef0123456789"
  let out = ""
  for (let i = 0; i < length; i++) out += chars[randInt(0, chars.length - 1)]
  return out
}

const USERS = [
  { name: "Arif Rahman", email: "arif.rahman@telkomsel.co.id" },
  { name: "Dewi Anggraini", email: "dewi.anggraini@telkomsel.co.id" },
  { name: "Bagas Prasetyo", email: "bagas.prasetyo@telkomsel.co.id" },
  { name: "Nadia Kusuma", email: "nadia.kusuma@telkomsel.co.id" },
  { name: "Fajar Nugroho", email: "fajar.nugroho@telkomsel.co.id" },
  { name: "Siti Rahayu", email: "siti.rahayu@telkomsel.co.id" },
  { name: "Budi Santoso", email: "budi.santoso@telkomsel.co.id" },
  { name: "Rina Wijaya", email: "rina.wijaya@telkomsel.co.id" },
  { name: "Eko Prasetyo", email: "eko.prasetyo@telkomsel.co.id" },
  { name: "Maya Sari", email: "maya.sari@telkomsel.co.id" },
  { name: "Andi Saputra", email: "andi.saputra@telkomsel.co.id" },
  { name: "Lestari Wulandari", email: "lestari.wulandari@telkomsel.co.id" },
]

const MODELS = ["Claude Opus 4.8", "Claude Sonnet 5", "GPT-5.5", "Gemini 2.5 Pro"]

const KEY_NAMES = ["main key", "prod key", "dev key", "staging key", "backup key"]

const DEPARTMENT_NAMES = [
  "Department of Human Resources",
  "Department of Marketing",
  "Department of Finance",
  "Department of Operations",
  "Department of Legal",
  "Department of IT Support",
]

const PRODUCT_NAMES = [
  "Moana Chatbot",
  "Veronika Chatbot",
  "Atlas Assistant",
  "Nova Support Bot",
  "Sigma Insight",
  "Aurora Copilot",
  "Zenith Analyzer",
  "Helios Assistant",
  "Cascade Bot",
  "Orion Helper",
  "Halo Concierge",
  "Pulsar Advisor",
]

const DIVISION_NAMES = [
  "Marketing Division",
  "Sales Division",
  "Finance Division",
  "IT Infrastructure Division",
  "Customer Experience Division",
  "Human Resources Division",
  "Legal & Compliance Division",
  "Research & Development Division",
  "Engineering Division",
  "Operations Division",
]

const CHANGE_REASONS = [
  "Quarterly budget adjustment",
  "Increased usage forecast",
  "Reallocation from underused pocket",
  "New product rollout",
  "Year-end budget review",
]

function makeHistory(label, currentValue, count) {
  const entries = []
  let value = currentValue
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const previous = Math.round(value / randInt(105, 130) * 100 * 100) / 100
    const daysAgo = i === 0 ? 0 : randInt(3, 10) * (i + 1)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    date.setHours(randInt(0, 23), randInt(0, 59), 0, 0)
    entries.push({
      id: `${slugify(label)}-hist-${i}`,
      label,
      from: previous,
      to: value,
      date,
      by: pick(USERS, randInt(0, USERS.length - 1)).email,
      reason: pick(CHANGE_REASONS, i),
    })
    value = previous
  }
  return entries
}

function buildKeyRow(teamKey, index) {
  const user = pick(USERS, index)
  const model = pick(MODELS, index + teamKey.length)
  const budget = randInt(500, 900) + 0.5 * randInt(0, 1)
  const status = randInt(0, 9) < 8 ? "Active" : "Inactive"
  const spendPct = randInt(15, 95) / 100
  const spend = Math.round(budget * spendPct * 100) / 100
  const keyId = `key_prod_${randomHex(12)}`
  const keyName = pick(KEY_NAMES, index)

  return {
    id: `${teamKey}-key-${index}`,
    user,
    model,
    keyName,
    keyId,
    status,
    budget: Math.round(budget * 100) / 100,
    spend,
    history: makeHistory(`${model} · ${keyName}`, Math.round(budget * 100) / 100, randInt(1, 3)),
  }
}

function buildTeam(divisionKey, name, type, index) {
  const key = `${divisionKey}-${slugify(name)}`
  const rowCount = randInt(4, 6)
  const keys = Array.from({ length: rowCount }, (_, i) => buildKeyRow(key, i + index))

  const allocated = Math.round(keys.reduce((sum, k) => sum + k.budget, 0) * 100) / 100
  const spend = Math.round(keys.reduce((sum, k) => sum + k.spend, 0) * 100) / 100
  const totalBudget = Math.round(allocated * (1 + randInt(5, 35) / 100) * 100) / 100

  return {
    id: key,
    name,
    type, // "Department" | "Product Name"
    totalBudget,
    allocated,
    spend,
    reserved: spend,
    keys,
    history: makeHistory(name, totalBudget, randInt(1, 3)),
  }
}

function buildDivision(index) {
  const name = DIVISION_NAMES[index]
  const key = slugify(name)

  const deptCount = 2
  const prodCount = index % 3 === 0 ? 3 : 2

  const teams = []
  for (let i = 0; i < deptCount; i++) {
    teams.push(buildTeam(key, pick(DEPARTMENT_NAMES, index + i), "Department", i))
  }
  for (let i = 0; i < prodCount; i++) {
    teams.push(
      buildTeam(key, pick(PRODUCT_NAMES, index * 2 + i), "Product Name", deptCount + i)
    )
  }

  const allocated = Math.round(teams.reduce((sum, t) => sum + t.totalBudget, 0) * 100) / 100
  const spend = Math.round(teams.reduce((sum, t) => sum + t.spend, 0) * 100) / 100
  const totalBudget = Math.round(allocated * (1 + randInt(5, 25) / 100) * 100) / 100

  return {
    id: key,
    name,
    totalBudget,
    allocated,
    spend,
    reserved: spend,
    teams,
    history: makeHistory(name, totalBudget, randInt(1, 3)),
  }
}

export const DIVISIONS = DIVISION_NAMES.map((_, i) => buildDivision(i))

export function getDivision(divisionId) {
  return DIVISIONS.find((d) => d.id === divisionId)
}

export function getTeam(divisionId, teamId) {
  const division = getDivision(divisionId)
  return division?.teams.find((t) => t.id === teamId)
}

export function getKey(divisionId, teamId, keyId) {
  const team = getTeam(divisionId, teamId)
  return team?.keys.find((k) => k.id === keyId)
}

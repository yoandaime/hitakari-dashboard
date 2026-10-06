export const ROLE_INFO_CARDS = [
  {
    key: "super-admin",
    title: "Super Admin",
    subtitle: "AI Platform and Strategy",
    tone: "fuchsia",
    permissions: [
      { label: "Full system control*", strong: true },
      { label: "Review & register product and Ads" },
      { label: "Backend integration" },
      { label: "Integration to surrounding Apss" },
      { label: "Ticket handling" },
    ],
  },
  {
    key: "admin-product",
    title: "Admin Product",
    subtitle: "AI Platform and Strategy",
    tone: "blue",
    permissions: [
      { label: "Control Product Policies" },
      { label: "Subscribe product" },
      { label: "Rating product" },
      { label: "Overview product" },
    ],
  },
  {
    key: "admin-budget",
    title: "Admin Budget",
    subtitle: "AI Platform and Strategy",
    tone: "blue",
    permissions: [
      { label: "Control Budget Policies" },
      { label: "Subscribe product" },
      { label: "Rating product" },
      { label: "Overview product" },
    ],
  },
  {
    key: "product-owner",
    title: "Product Owner",
    subtitle: "AI Platform and Strategy",
    tone: "emerald",
    permissions: [
      { label: "Register product" },
      { label: "Follow up ticket" },
      { label: "Edit product description & overview" },
    ],
  },
  {
    key: "user",
    title: "User",
    subtitle: "All Telkomsel Employee",
    tone: "indigo",
    permissions: [
      { label: "Subscribe product" },
      { label: "Rating product" },
      { label: "Overview product" },
    ],
  },
]

// Assignable roles (popover options). `tone` drives the dot and badge colours.
export const ASSIGNABLE_ROLES = [
  { key: "budget-admin", label: "Budget Admin", tone: "blue" },
  { key: "product-admin", label: "Product Admin", tone: "blue" },
  { key: "product-owner", label: "Product Owner", tone: "emerald" },
  { key: "super-admin", label: "Super Admin", tone: "fuchsia" },
]

export const INITIAL_USERS = [
  {
    id: 1,
    name: "Hiroshi Tanaka",
    email: "hiroshi.t@telkomsel.co.id",
    department: "Engineering",
    roles: [],
  },
  {
    id: 2,
    name: "Li Wei",
    email: "li.wei@telkomsel.co.id",
    department: "Engineering",
    roles: ["budget-admin", "super-admin"],
  },
  {
    id: 3,
    name: "Ananya Gupta",
    email: "ananya.g@telkomsel.co.id",
    department: "Marketing",
    roles: ["product-owner"],
  },
  {
    id: 4,
    name: "Rajesh Kumar",
    email: "rajesh.k@telkomsel.co.id",
    department: "Human Resources",
    roles: ["super-admin"],
  },
]

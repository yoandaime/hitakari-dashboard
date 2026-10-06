// Every key the prototype persists starts with this prefix, so a reset clears them all.
export const STORAGE_PREFIX = "hitakari."
const RESET_FLAG = `${STORAGE_PREFIX}demo-reset`

export function resetDemoData() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key))
    sessionStorage.setItem(RESET_FLAG, "1")
  } catch {
    // Storage can be blocked; the reload below still restores the seed data.
  }
  window.location.reload()
}

// True once after a reset, so the app can confirm it with a toast.
export function consumeResetFlag() {
  try {
    if (sessionStorage.getItem(RESET_FLAG)) {
      sessionStorage.removeItem(RESET_FLAG)
      return true
    }
  } catch {
    // ignore
  }
  return false
}

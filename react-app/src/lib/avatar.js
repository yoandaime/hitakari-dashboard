const DICEBEAR_STYLE_URL = "https://api.dicebear.com/10.x/planets/svg"

export function getAvatarUrl(seed = "Felix") {
  return `${DICEBEAR_STYLE_URL}?seed=${encodeURIComponent(seed)}`
}

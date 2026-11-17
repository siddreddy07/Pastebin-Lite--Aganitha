// Short local time, e.g. "17 Nov, 3:30 pm" (year only when it isn't this year).
export function formatTime(iso: string) {
  const date = new Date(iso)
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: sameYear ? undefined : "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

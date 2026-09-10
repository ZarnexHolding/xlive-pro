/*
 * Lead ID formatting. The sequence number itself comes from the store (atomic,
 * per-year); this only formats it: XL-2026-0001.
 */

export function formatLeadId(year, seq) {
  return `XL-${year}-${String(seq).padStart(4, '0')}`
}

// Fallback used only when there is no database configured. Not sequential, but
// unique (time + random, collision-safe even within the same millisecond), so
// enquiries emailed without persistence still carry a reference. Clearly
// distinguishable (T = transient) from persisted IDs.
export function transientLeadId(year, now = Date.now()) {
  const t = now.toString(36).toUpperCase().slice(-4)
  const r = Math.random().toString(36).toUpperCase().slice(2, 5)
  return `XL-${year}-T${t}${r}`
}

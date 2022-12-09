export function getViewport() {
  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0,
  )

  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0,
  )

  return { vw, vh }
}

export function findQuater({ left, top }: { top: number; left: number }) {
  const { vh, vw } = getViewport()

  const q1 = top < vh / 2 && left < vw / 2
  const q2 = top < vh / 2 && left >= vw / 2
  const q3 = top >= vh / 2 && left < vw / 2
  const q4 = top >= vh / 2 && left >= vw / 2

  return { q1, q2, q3, q4 }
}

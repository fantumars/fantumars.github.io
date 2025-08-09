
export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

export const todayISO = () => new Date().toISOString().slice(0,10)

export const daysBetween = (aISO: string, bISO: string) => {
  const a = new Date(aISO + 'T00:00:00')
  const b = new Date(bISO + 'T00:00:00')
  return Math.abs(Math.round((+a - +b) / 86400000))
}

export const roundTo = (x: number, step: number) => Math.round(x / step) * step

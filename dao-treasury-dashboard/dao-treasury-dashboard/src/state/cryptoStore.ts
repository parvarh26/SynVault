export type CryptoSymbol = 'BTC' | 'ETH' | 'USDT' | 'SOL' | 'BAT' | 'SEPOLIA_ETH'

type Listener = (balances: Record<CryptoSymbol, number>) => void

const LS_KEY = 'crypto_balances_v1'

function loadInitial(): Record<CryptoSymbol, number> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  // Defaults: 4 famous + BAT + Sepolia ETH
  return {
    BTC: 1.0075985,
    ETH: 0.85448,
    USDT: 250,
    SOL: 1,
    BAT: 1.002448,
    SEPOLIA_ETH: 10,
  }
}

class CryptoStore {
  private balances: Record<CryptoSymbol, number>
  private listeners: Set<Listener> = new Set()

  constructor() {
    this.balances = loadInitial()
  }

  private persist() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(this.balances)) } catch {}
  }

  getAll(): Record<CryptoSymbol, number> {
    return { ...this.balances }
  }

  get(symbol: CryptoSymbol): number {
    return this.balances[symbol] ?? 0
  }

  set(symbol: CryptoSymbol, value: number) {
    this.balances[symbol] = value
    this.persist()
    this.emit()
  }

  delta(symbol: CryptoSymbol, change: number) {
    this.balances[symbol] = Math.max(0, (this.balances[symbol] ?? 0) + change)
    this.persist()
    this.emit()
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private emit() {
    const snap = this.getAll()
    this.listeners.forEach((l) => l(snap))
  }
}

export const cryptoStore = new CryptoStore()

// Dev helper: allow backend/console to update balances
declare global { interface Window { cryptoBalances?: any } }
if (typeof window !== 'undefined') {
  window.cryptoBalances = {
    get: (s?: CryptoSymbol) => (s ? cryptoStore.get(s) : cryptoStore.getAll()),
    set: (s: CryptoSymbol, v: number) => cryptoStore.set(s, v),
    delta: (s: CryptoSymbol, d: number) => cryptoStore.delta(s, d),
  }
}



export type PricePackageKey = 'basic' | 'business' | 'premium'

export interface PricePackageConfig {
  key: PricePackageKey
  variant: 'light' | 'featured'
  price: number
  featureCount: number
}

export const pricePackagesList: PricePackageConfig[] = [
  { key: 'basic', variant: 'light', price: 120, featureCount: 5 },
  { key: 'business', variant: 'featured', price: 200, featureCount: 6 },
  { key: 'premium', variant: 'light', price: 300, featureCount: 5 }
]

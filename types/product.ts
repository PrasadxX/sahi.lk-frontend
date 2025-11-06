export interface ProductVariant {
  _id: string
  name: string
  price: number
  stock: number
  sku?: string
  isActive?: boolean
  properties?: Record<string, string>
}

export interface Product {
  _id: string
  title: string
  slug?: string
  description: string
  price: number
  images: string[]
  videos?: Array<{
    _id: string
    title: string
    url: string
  }>
  category?: {
    _id: string
    name: string
    slug?: string
  }
  properties?: Record<string, string>
  inStock?: boolean
  featured?: boolean
  hasVariants?: boolean
  variants?: ProductVariant[]
  variantSelectionStyle?: 'dropdown' | 'quantity'
  stock?: number
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  _id: string
  name: string
  slug?: string
  parent?: Category
  properties?: CategoryProperty[]
}

export interface CategoryProperty {
  name: string
  values: string[]
}

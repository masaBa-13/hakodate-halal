export type HalalLevel = 'certified' | 'friendly' | 'pork_free' | 'inquire'
export type Category = 'food' | 'stay' | 'shop' | 'other'

export interface Shop {
  id: string
  owner_id: string
  name: string
  address: string
  lat: number
  lng: number
  category: Category
  halal_level: HalalLevel
  has_prayer_space: number
  opening_hours: string | null
  comment_ja: string | null
  comment_en: string | null
  comment_ms: string | null
  comment_id: string | null
  comment_bn: string | null
  main_photo_url: string | null
  place_id: string | null
  website_url: string | null
  instagram_url: string | null
  facebook_url: string | null
  contains_pork: number | null
  contains_alcohol: number | null
  uses_halal_meat: number | null
  contains_beef: number | null
  contains_chicken: number | null
  contains_seafood: number | null
  contains_dairy: number | null
  contains_egg: number | null
  contains_gluten: number | null
  is_vegetarian: number | null
  is_vegan: number | null
  menu_items: string | null
  submitter_rating: number | null
  is_active: number
  created_at: string
  photos?: string
}

export interface Photo {
  id: string
  photo_url: string
}

export interface Report {
  id: string
  target_type: 'shop' | 'photo'
  target_id: string
  reason: string | null
  resolved: number
  created_at: string
}

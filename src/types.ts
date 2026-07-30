export type City = 'Franconia' | 'Berlin';
export type Language = 'de' | 'en';
export type BeerType = 'hell' | 'dunkel' | 'alkoholfrei';

export interface TranslationOverride {
  de: string;
  en: string;
  autoTranslated: boolean;
}

export interface BeerStock {
  id: BeerType;
  name: string;
  stockLevel: 'full' | 'low' | 'empty';
}

export interface Venue {
  id: string;
  name: string;
  city: City;
  type: 'Kneipe' | 'Späti' | 'Biergarten' | 'Bar';
  address: string;
  district: string;
  amenities: {
    outdoor: boolean;
    dogFriendly: boolean;
    food: boolean;
  };
  stockLevel: 'full' | 'low' | 'empty'; // Legacy single stock level for backwards-compatibility or general indicator
  beers: BeerStock[]; // Multi-beer stock level tracking for the real-time system
  lastUpdated: string;
  longitude: number;
  latitude: number;
}

export interface MerchOption {
  label: string;
  values: string[];
}

export interface MerchItem {
  id: string;
  name: string;
  price: number;
  promoPrice?: number;
  image: string;
  images: string[];
  description: string;
  category: 'Apparel' | 'Drinkware' | 'Accessory';
  sizes?: string[];
  options?: MerchOption[];
  inStock: boolean;
  stock?: Record<string, number>;
}

export interface CartItem {
  item: MerchItem;
  quantity: number;
  selectedSize?: string;
  selectedOptions?: Record<string, string>;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';

export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  options?: Record<string, string>;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
  status: OrderStatus;
  stripeSessionId?: string;
  createdAt: string;
}

export interface StoryNode {
  id: number;
  year: string;
  title: string;
  titleEn: string;
  text: string;
  textEn: string;
  tagline: string;
  taglineEn: string;
  image: string;
  gifUrl?: string;
}

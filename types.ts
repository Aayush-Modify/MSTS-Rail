export type ProductCategory = 'routes' | 'locomotives' | 'coaches' | 'packs';

export type ProductStatus = 'Available' | 'Updated' | 'Popular' | 'New' | 'Featured';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  type: string;
  subType: string;
  description: string;
  features: string[];
  routeInfo?: {
    from?: string;
    to?: string;
    distanceKm?: string;
    zone?: string;
    trackType?: string;
    stations?: string[];
    era?: string;
  };
  locoSpecs?: {
    power?: string;
    traction?: string;
    maxSpeed?: string;
    shed?: string;
    cabView?: boolean;
    customSounds?: boolean;
  };
  coachSpecs?: {
    type?: string;
    livery?: string;
    capacity?: string;
    nightView?: boolean;
    soundPack?: boolean;
  };
  requirements: string[];
  installationGuide: string[];
  updates: {
    version: string;
    date: string;
    notes: string;
  }[];
  status: ProductStatus;
  featured: boolean;
  isLatest?: boolean;
  tags: string[];
  image: string;
  gallery?: string[];
}

export type PriceFilterRange = 'all' | 'under50' | '50-75' | '75-100' | '100plus';

export type SortOption = 
  | 'featured' 
  | 'price-asc' 
  | 'price-desc' 
  | 'name-asc' 
  | 'name-desc' 
  | 'newest';

export interface FilterState {
  category: 'all' | ProductCategory;
  priceRange: PriceFilterRange;
  subType: string;
  searchQuery: string;
  sortBy: SortOption;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  addedAt: number;
}

export interface StoredOrder {
  id: string;
  date: string;
  timestamp: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    category: string;
    subType?: string;
  }>;
  totalAmount: number;
  eBillMessage: string;
  status: 'Confirmed' | 'Dispatched';
}

export interface PilotProfile {
  name: string;
  photo?: string;
  age?: number | string;
  callSign: string;
  zone: string;
  bio?: string;
  upiId?: string;
  subscriptionTier?: 'free' | 'pro' | 'vip';
  soundMode: '3phase' | 'gto' | 'diesel';
  rendererMode: 'openrails-64' | 'msts-bin';
  textureQuality: '4k' | 'hd';
  notificationsEnabled?: boolean;
  isOnboarded?: boolean;
  updatedAt: number;
}

export interface DatabaseStats {
  status: 'Ready' | 'Synced' | 'Error';
  productsCount: number;
  ordersCount: number;
  wishlistCount: number;
  cartCount: number;
  storageSizeKB: string;
  lastUpdated: string;
}

export type BottomNavTab = 'home' | 'search' | 'cart' | 'profile' | 'offers';

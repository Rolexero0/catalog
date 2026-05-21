export type ProductStatus = "active" | "archived";

export type ProductCategory =
  | "Supplements"
  | "Fitness"
  | "Nutrition"
  | "Wellness"
  | "Recovery";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  stock: number;
  imageUrl: string;
  createdAt: string;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export type ProductFilterStatus = "all" | ProductStatus;

export interface ProductFilters {
  status: ProductFilterStatus;
  category: ProductCategory | "All";
  search: string;
}

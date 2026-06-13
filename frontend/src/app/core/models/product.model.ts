export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  inventoryValue: number;
  productsByCategory: { category: string; count: number }[];
}

export interface ProductFilter {
  search?: string;
  category?: string;
  active?: boolean;
  page: number;
  size: number;
  sort: string;
}

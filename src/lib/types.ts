export interface AuthToken {
  token: string;
  expire: number;
}

export interface SaleItem {
  _id: string;
  date: string;
  price: number;
  customerEmail: string;
  customerPhone: string;
  __v: number;
}

export interface TotalSaleData {
  day: string;
  totalSale: number;
}

export interface SalesResponse {
  results: {
    TotalSales: TotalSaleData[];
    Sales: SaleItem[];
  };
  pagination: {
    before: string | null;
    after: string | null;
  };
}

export interface Filters {
  startDate: string;
  endDate: string;
  priceMin: string;
  email: string;
  phone: string;
  sortBy: 'date' | 'price';
  sortOrder: 'asc' | 'desc';
  after?: string;
  before?: string;
}

export interface PaginationTokens {
  before: string | null;
  after: string | null;
}
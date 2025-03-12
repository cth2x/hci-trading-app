// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  portfolioValue: number;
}

// Authentication related types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Asset types (stocks, crypto, commodities)
export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto' | 'commodity';
  currentPrice: number;
  priceChange: number;
  priceChangePercentage: number;
}

// Portfolio item
export interface PortfolioItem {
  assetId: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto' | 'commodity';
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  assetId: string;
  type: 'buy' | 'sell';
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  timestamp: Date;
  notes?: string;
}

// News article
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  imageUrl?: string;
  url: string;
  publishedAt: Date;
  category: 'company' | 'market' | 'economic' | 'global' | 'industry';
  relatedSymbols?: string[];
}

// Market data for charts
export interface MarketData {
  timestamp: Date;
  price: number;
}

// Report data
export interface ReportData {
  totalTrades: number;
  profitLoss: number;
  profitLossPercentage: number;
  totalBuys: number;
  totalSells: number;
  mostTradedAsset: {
    symbol: string;
    name: string;
    trades: number;
  };
  assetDistribution: {
    type: 'stock' | 'crypto' | 'commodity';
    percentage: number;
  }[];
  performanceHistory: {
    date: Date;
    portfolioValue: number;
  }[];
}

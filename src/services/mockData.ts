import {
  Asset,
  PortfolioItem,
  Transaction,
  NewsArticle,
  MarketData,
  ReportData,
} from '../types';

// Mock assets data (stocks, crypto, commodities)
export const mockAssets: Asset[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    currentPrice: 175.34,
    priceChange: 2.45,
    priceChangePercentage: 1.42,
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    type: 'stock',
    currentPrice: 325.67,
    priceChange: -1.23,
    priceChangePercentage: -0.38,
  },
  {
    id: '3',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'stock',
    currentPrice: 2750.12,
    priceChange: 15.78,
    priceChangePercentage: 0.58,
  },
  {
    id: '4',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    type: 'stock',
    currentPrice: 3450.89,
    priceChange: 23.45,
    priceChangePercentage: 0.68,
  },
  {
    id: '5',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    currentPrice: 45678.9,
    priceChange: 1234.56,
    priceChangePercentage: 2.78,
  },
  {
    id: '6',
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'crypto',
    currentPrice: 3456.78,
    priceChange: -123.45,
    priceChangePercentage: -3.45,
  },
  {
    id: '7',
    symbol: 'XRP',
    name: 'Ripple',
    type: 'crypto',
    currentPrice: 1.23,
    priceChange: 0.05,
    priceChangePercentage: 4.23,
  },
  {
    id: '8',
    symbol: 'GOLD',
    name: 'Gold',
    type: 'commodity',
    currentPrice: 1845.67,
    priceChange: 12.34,
    priceChangePercentage: 0.67,
  },
  {
    id: '9',
    symbol: 'SLVR',
    name: 'Silver',
    type: 'commodity',
    currentPrice: 24.56,
    priceChange: -0.34,
    priceChangePercentage: -1.37,
  },
  {
    id: '10',
    symbol: 'OIL',
    name: 'Crude Oil',
    type: 'commodity',
    currentPrice: 78.9,
    priceChange: 1.23,
    priceChangePercentage: 1.58,
  },
];

// Mock portfolio data
export const mockPortfolio: PortfolioItem[] = [
  {
    assetId: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    quantity: 10,
    averageBuyPrice: 170.25,
    currentPrice: 175.34,
    totalValue: 1753.4,
    profitLoss: 50.9,
    profitLossPercentage: 2.99,
  },
  {
    assetId: '5',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    quantity: 0.5,
    averageBuyPrice: 44000.0,
    currentPrice: 45678.9,
    totalValue: 22839.45,
    profitLoss: 839.45,
    profitLossPercentage: 3.81,
  },
  {
    assetId: '8',
    symbol: 'GOLD',
    name: 'Gold',
    type: 'commodity',
    quantity: 2,
    averageBuyPrice: 1830.5,
    currentPrice: 1845.67,
    totalValue: 3691.34,
    profitLoss: 30.34,
    profitLossPercentage: 0.83,
  },
];

// Mock transaction history
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    assetId: '1',
    type: 'buy',
    symbol: 'AAPL',
    quantity: 5,
    price: 168.75,
    total: 843.75,
    timestamp: new Date('2023-03-15T10:30:00'),
    notes: 'Initial investment in Apple',
  },
  {
    id: '2',
    userId: '1',
    assetId: '1',
    type: 'buy',
    symbol: 'AAPL',
    quantity: 5,
    price: 171.75,
    total: 858.75,
    timestamp: new Date('2023-03-20T14:45:00'),
    notes: 'Buying the dip',
  },
  {
    id: '3',
    userId: '1',
    assetId: '5',
    type: 'buy',
    symbol: 'BTC',
    quantity: 0.5,
    price: 44000.0,
    total: 22000.0,
    timestamp: new Date('2023-03-18T09:15:00'),
    notes: 'Diversifying with crypto',
  },
  {
    id: '4',
    userId: '1',
    assetId: '8',
    type: 'buy',
    symbol: 'GOLD',
    quantity: 2,
    price: 1830.5,
    total: 3661.0,
    timestamp: new Date('2023-03-22T11:20:00'),
    notes: 'Hedge against inflation',
  },
];

// Mock news articles
export const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Apple Announces New iPhone Model',
    summary:
      'Apple Inc. has unveiled its latest iPhone model with revolutionary features.',
    content:
      'Apple Inc. has unveiled its latest iPhone model with revolutionary features including enhanced AI capabilities, improved camera system, and longer battery life. The new model is expected to hit the market next month.',
    source: 'Tech News',
    imageUrl: 'https://via.placeholder.com/300x200',
    url: 'https://example.com/news/1',
    publishedAt: new Date('2023-03-25T08:00:00'),
    category: 'company',
    relatedSymbols: ['AAPL'],
  },
  {
    id: '2',
    title: 'Bitcoin Surges Past $45,000',
    summary:
      'Bitcoin has surged past $45,000 amid growing institutional adoption.',
    content:
      'Bitcoin has surged past $45,000 amid growing institutional adoption and increasing interest from major financial institutions. Analysts predict further growth in the coming months as more companies add Bitcoin to their balance sheets.',
    source: 'Crypto Daily',
    imageUrl: 'https://via.placeholder.com/300x200',
    url: 'https://example.com/news/2',
    publishedAt: new Date('2023-03-24T14:30:00'),
    category: 'market',
    relatedSymbols: ['BTC'],
  },
  {
    id: '3',
    title: 'Federal Reserve Announces Interest Rate Decision',
    summary:
      'The Federal Reserve has announced its latest interest rate decision.',
    content:
      'The Federal Reserve has announced its latest interest rate decision, keeping rates unchanged but signaling potential increases later this year. The decision comes amid concerns about inflation and economic recovery.',
    source: 'Financial Times',
    imageUrl: 'https://via.placeholder.com/300x200',
    url: 'https://example.com/news/3',
    publishedAt: new Date('2023-03-23T16:45:00'),
    category: 'economic',
  },
  {
    id: '4',
    title: 'Gold Prices Stabilize Amid Market Uncertainty',
    summary: 'Gold prices have stabilized amid ongoing market uncertainty.',
    content:
      'Gold prices have stabilized amid ongoing market uncertainty and geopolitical tensions. The precious metal continues to be a safe haven for investors looking to hedge against inflation and market volatility.',
    source: 'Commodity Insights',
    imageUrl: 'https://via.placeholder.com/300x200',
    url: 'https://example.com/news/4',
    publishedAt: new Date('2023-03-22T10:15:00'),
    category: 'market',
    relatedSymbols: ['GOLD'],
  },
  {
    id: '5',
    title: 'Tech Sector Leads Market Rally',
    summary: 'The technology sector is leading a broad market rally.',
    content:
      'The technology sector is leading a broad market rally as investors bet on continued growth in digital services and products. Major tech companies have reported strong earnings, boosting investor confidence.',
    source: 'Market Watch',
    imageUrl: 'https://via.placeholder.com/300x200',
    url: 'https://example.com/news/5',
    publishedAt: new Date('2023-03-21T09:30:00'),
    category: 'industry',
    relatedSymbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN'],
  },
];

// Mock market data for charts
export const generateMarketData = (
  assetId: string,
  days: number
): MarketData[] => {
  const data: MarketData[] = [];
  const asset = mockAssets.find((a) => a.id === assetId);

  if (!asset) return [];

  const basePrice = asset.currentPrice * 0.9; // Start at 90% of current price
  const volatility =
    asset.type === 'crypto' ? 0.05 : asset.type === 'stock' ? 0.02 : 0.01;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Generate a random walk with trend
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    const trendFactor = 1 + ((days - i) / days) * 0.1; // Slight upward trend

    const price =
      i === 0 ? asset.currentPrice : basePrice * randomFactor * trendFactor;

    data.push({
      timestamp: date,
      price: Number(price.toFixed(2)),
    });
  }

  return data;
};

// Mock report data
export const mockReportData: ReportData = {
  totalTrades: 4,
  profitLoss: 920.69,
  profitLossPercentage: 3.45,
  totalBuys: 4,
  totalSells: 0,
  mostTradedAsset: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    trades: 2,
  },
  assetDistribution: [
    {
      type: 'stock',
      percentage: 6.2,
    },
    {
      type: 'crypto',
      percentage: 80.5,
    },
    {
      type: 'commodity',
      percentage: 13.3,
    },
  ],
  performanceHistory: [
    {
      date: new Date('2023-03-15'),
      portfolioValue: 843.75,
    },
    {
      date: new Date('2023-03-18'),
      portfolioValue: 22843.75,
    },
    {
      date: new Date('2023-03-20'),
      portfolioValue: 23702.5,
    },
    {
      date: new Date('2023-03-22'),
      portfolioValue: 27363.5,
    },
    {
      date: new Date('2023-03-25'),
      portfolioValue: 28284.19,
    },
  ],
};

// Function to simulate price updates
export const updateAssetPrices = (): Asset[] => {
  return mockAssets.map((asset) => {
    const volatility =
      asset.type === 'crypto' ? 0.02 : asset.type === 'stock' ? 0.01 : 0.005;
    const change = asset.currentPrice * (Math.random() - 0.5) * volatility;
    const newPrice = Number((asset.currentPrice + change).toFixed(2));
    const priceChange = Number(
      (newPrice - asset.currentPrice + asset.priceChange).toFixed(2)
    );
    const priceChangePercentage = Number(
      ((priceChange / (asset.currentPrice - asset.priceChange)) * 100).toFixed(
        2
      )
    );

    return {
      ...asset,
      currentPrice: newPrice,
      priceChange,
      priceChangePercentage,
    };
  });
};

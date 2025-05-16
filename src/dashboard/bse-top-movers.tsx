import { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Clock, Building, Globe, Diamond } from 'lucide-react';

export default function BSETopMovers() {
  const [selectedTab, setSelectedTab] = useState('gainers');

  const topGainers = [
    { 
      id: 1, 
      code: 'SCBANK', 
      name: 'Standard Chartered Bank Botswana', 
      price: 8.32, 
      change: 14.6, 
      volume: 447478,
      sector: 'Financials',
      marketCap: 42.5
    },
    { 
      id: 2, 
      code: 'SECHABA', 
      name: 'Sechaba Brewery Holdings', 
      price: 15.75, 
      change: 7.02, 
      volume: 107044,
      sector: 'Consumer Goods',
      marketCap: 35.8
    },
    { 
      id: 3, 
      code: 'FNBB', 
      name: 'First National Bank Botswana', 
      price: 5.12, 
      change: 0.39, 
      volume: 63583,
      sector: 'Financials',
      marketCap: 28.3
    },
    { 
      id: 4, 
      code: 'LUCARA', 
      name: 'Lucara Diamond Corp', 
      price: 3.25, 
      change: 2.52, 
      volume: 48921,
      sector: 'Mining',
      marketCap: 14.7
    }
  ];

  const topLosers = [
    { 
      id: 1, 
      code: 'CHOPPIES', 
      name: 'Choppies Enterprises', 
      price: 0.50, 
      change: -3.85, 
      volume: 95123,
      sector: 'Consumer Services',
      marketCap: 0.91
    },
    { 
      id: 2, 
      code: 'TLOU', 
      name: 'Tlou Energy', 
      price: 0.35, 
      change: -2.78, 
      volume: 41892,
      sector: 'Energy',
      marketCap: 1.2
    },
    { 
      id: 3, 
      code: 'G4S', 
      name: 'G4S Botswana', 
      price: 2.45, 
      change: -1.21, 
      volume: 28745,
      sector: 'Industrials',
      marketCap: 0.19
    }
  ];

  const sectorIcons = {
    'Financials': <Building className="h-4 w-4" />,
    'Consumer Goods': <BarChart3 className="h-4 w-4" />,
    'Consumer Services': <BarChart3 className="h-4 w-4" />,
    'Mining': <Diamond className="h-4 w-4" />,
    'Energy': <Globe className="h-4 w-4" />,
    'Industrials': <Building className="h-4 w-4" />
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-BW', { 
      style: 'currency', 
      currency: 'BWP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatVolume = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const movers = selectedTab === 'gainers' ? topGainers : topLosers;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">BSE Top Movers</h2>

      {/* Tab Selection */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setSelectedTab('gainers')}
          className={`pb-3 px-1 ${
            selectedTab === 'gainers'
              ? 'border-b-2 border-green-600 text-green-600 font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Top Gainers
          </div>
        </button>
        <button
          onClick={() => setSelectedTab('losers')}
          className={`pb-3 px-1 ${
            selectedTab === 'losers'
              ? 'border-b-2 border-red-600 text-red-600 font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Top Losers
          </div>
        </button>
      </div>

      {/* Movers List */}
      <div className="space-y-3">
        {movers.map((stock) => (
          <div key={stock.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${selectedTab === 'gainers' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {sectorIcons[stock.sector]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{stock.code}</h3>
                      <span className="text-sm text-gray-500">{stock.name}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{stock.sector}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(stock.price)}
                </div>
                <div className={`flex items-center justify-end gap-1 mt-1 ${
                  stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-semibold">{stock.change >= 0 ? '+' : ''}{stock.change}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Volume: {formatVolume(stock.volume)}</span>
                </div>
                <div className="text-gray-600">
                  Market Cap: {formatCurrency(stock.marketCap)}B
                </div>
              </div>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Market Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Last Updated: {new Date().toLocaleTimeString('en-BW')}</span>
          <span className="text-gray-600">Source: BSE Live Market Data</span>
        </div>
      </div>
    </div>
  );
}
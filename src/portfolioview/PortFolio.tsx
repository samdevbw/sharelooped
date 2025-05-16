import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  PieChart, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Filter,
  Download,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { auth, db } from './lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

type AssetAllocation = {
  type: string;
  percentage: number;
  value: number;
  color: string;
};

type PerformanceData = {
  period: string;
  return: number;
  benchmarkReturn: number;
};

type PortfolioSummary = {
  totalValue: number;
  cashBalance: number;
  totalReturn: number;
  todayChange: number;
  todayChangePercentage: number;
  assetAllocation: AssetAllocation[];
  performanceData: PerformanceData[];
  lastUpdated: string;
};

export default function PortfolioOverview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<PortfolioSummary | null>(null);
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!auth.currentUser) {
      navigate('/');
      return;
    }

    // In a real app, fetch portfolio data from Firestore
    // const fetchPortfolioData = async () => {
    //   const portfolioRef = collection(db, 'portfolios');
    //   const q = query(portfolioRef, where("userId", "==", auth.currentUser?.uid));
    //   const querySnapshot = await getDocs(q);
    //   if (!querySnapshot.empty) {
    //     const doc = querySnapshot.docs[0];
    //     setPortfolioData(doc.data() as PortfolioSummary);
    //   }
    //   setLoading(false);
    // };
    
    // fetchPortfolioData();

    // Mock data for demonstration
    const mockPortfolioData: PortfolioSummary = {
      totalValue: 187650.42,
      cashBalance: 12450.78,
      totalReturn: 32450.89,
      todayChange: 856.34,
      todayChangePercentage: 0.46,
      assetAllocation: [
        { type: 'Stocks', percentage: 45, value: 84442.69, color: 'bg-blue-500' },
        { type: 'ETFs', percentage: 30, value: 56295.13, color: 'bg-indigo-500' },
        { type: 'Crypto', percentage: 15, value: 28147.56, color: 'bg-green-500' },
        { type: 'Bonds', percentage: 8, value: 15012.03, color: 'bg-yellow-500' },
        { type: 'Cash', percentage: 7, value: 12450.78, color: 'bg-gray-300' }
      ],
      performanceData: [
        { period: '1M', return: 2.3, benchmarkReturn: 1.8 },
        { period: '3M', return: 5.7, benchmarkReturn: 4.9 },
        { period: '6M', return: 8.2, benchmarkReturn: 7.5 },
        { period: '1Y', return: 16.8, benchmarkReturn: 15.2 },
        { period: 'ALL', return: 32.4, benchmarkReturn: 28.7 }
      ],
      lastUpdated: '2025-05-01'
    };

    setPortfolioData(mockPortfolioData);
    setLoading(false);
  }, [navigate]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <PieChart className="h-full w-full" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No portfolio data</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any investments yet.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <span className="flex items-center text-sm text-gray-500">
                <Clock className="mr-1 h-4 w-4" />
                Last updated: {portfolioData.lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Portfolio Overview</h1>
              
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {showFilters && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                          All Assets
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                          Stocks Only
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                          ETFs Only
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                          Crypto Only
                        </a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                          Bonds Only
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Date Range
                </button>
                
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Portfolio Summary */}
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">Portfolio Summary</h2>
                
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Portfolio Value</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">${portfolioData.totalValue.toLocaleString()}</dd>
                      <div className="mt-1 flex items-baseline">
                        <span className={`${portfolioData.todayChange >= 0 ? 'text-green-600' : 'text-red-600'} text-sm font-semibold`}>
                          {portfolioData.todayChange >= 0 ? (
                            <ArrowUpRight className="inline h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="inline h-4 w-4 mr-1" />
                          )}
                          {portfolioData.todayChange >= 0 ? '+' : ''}
                          ${portfolioData.todayChange.toLocaleString()} ({portfolioData.todayChangePercentage.toFixed(2)}%)
                        </span>
                        <span className="ml-2 text-sm text-gray-500">Today</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Return</dt>
                      <dd className="mt-1 text-3xl font-semibold text-green-600">+${portfolioData.totalReturn.toLocaleString()}</dd>
                      <div className="mt-1 flex items-baseline">
                        <span className="text-green-600 text-sm font-semibold">
                          <ArrowUpRight className="inline h-4 w-4 mr-1" />
                          +{((portfolioData.totalReturn / (portfolioData.totalValue - portfolioData.totalReturn)) * 100).toFixed(2)}%
                        </span>
                        <span className="ml-2 text-sm text-gray-500">Since inception</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Cash Balance</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">${portfolioData.cashBalance.toLocaleString()}</dd>
                      <div className="mt-1 flex items-baseline">
                        <span className="text-sm text-gray-500">
                          {((portfolioData.cashBalance / portfolioData.totalValue) * 100).toFixed(2)}% of portfolio
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Performance vs Benchmark</dt>
                      <dd className="mt-1 text-3xl font-semibold text-green-600">
                        +{(portfolioData.performanceData.find(data => data.period === timeRange)?.return || 0).toFixed(2)}%
                      </dd>
                      <div className="mt-1 flex items-baseline">
                        <span className="text-sm text-gray-500">
                          S&P 500: +{(portfolioData.performanceData.find(data => data.period === timeRange)?.benchmarkReturn || 0).toFixed(2)}%
                        </span>
                        <span className="ml-2 text-sm font-semibold text-green-600">
                          {((portfolioData.performanceData.find(data => data.period === timeRange)?.return || 0) - 
                            (portfolioData.performanceData.find(data => data.period === timeRange)?.benchmarkReturn || 0)).toFixed(2)}% better
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Asset Allocation */}
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">Asset Allocation</h2>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pie Chart (Placeholder) */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="h-60 flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 text-indigo-400 mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">
                          Asset allocation chart would display here.
                        </p>
                        <p className="text-xs text-gray-400">
                          In a real app, integrate with Recharts or similar library.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Asset Allocation Table */}
                  <div>
                    <div className="flex flex-col">
                      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Asset Type
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Value
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Allocation
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {portfolioData.assetAllocation.map((asset) => (
                                  <tr key={asset.type}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className={`flex-shrink-0 h-4 w-4 rounded-full ${asset.color}`}></div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{asset.type}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">${asset.value.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">{asset.percentage}%</div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Performance */}
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Performance History</h2>
                  
                  <div className="flex space-x-2">
                    {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          timeRange === range 
                          ? 'bg-indigo-100 text-indigo-700 font-medium' 
                          : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Chart Placeholder */}
                <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-indigo-400 mx-auto" />
                      <p className="mt-2 text-sm text-gray-500">
                        Performance chart would display here for {timeRange} period.
                      </p>
                      <p className="text-xs text-gray-400">
                        In a real app, integrate with Recharts or similar library.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Performance Metrics */}
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Portfolio Return ({timeRange})</dt>
                      <dd className="mt-1 text-2xl font-semibold text-green-600">
                        +{(portfolioData.performanceData.find(data => data.period === timeRange)?.return || 0).toFixed(2)}%
                      </dd>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Benchmark Return ({timeRange})</dt>
                      <dd className="mt-1 text-2xl font-semibold text-gray-900">
                        +{(portfolioData.performanceData.find(data => data.period === timeRange)?.benchmarkReturn || 0).toFixed(2)}%
                      </dd>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Alpha ({timeRange})</dt>
                      <dd className="mt-1 text-2xl font-semibold text-green-600">
                        +{((portfolioData.performanceData.find(data => data.period === timeRange)?.return || 0) - 
                          (portfolioData.performanceData.find(data => data.period === timeRange)?.benchmarkReturn || 0)).toFixed(2)}%
                      </dd>
                    </div>
                  </div>
                  
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">Risk Score</dt>
                      <dd className="mt-1 text-2xl font-semibold text-yellow-600">
                        Medium (65/100)
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center">
            <div className="px-5 py-2">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Support
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Terms
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Contact
              </a>
            </div>
          </nav>
          <p className="mt-4 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} InvestEasy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
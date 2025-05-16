import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign,
  LineChart,
  Info,
  Clock,
  AlertCircle,
  Copy,
  BarChart3,
  FileText,
  ChevronDown,
  ChevronUp,
  PieChart
} from 'lucide-react';
import { auth } from '../lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useTranslation } from '../hooks/useTranslation';
import LoadingSpinner from '../components/common/LoadingSpinner';

type InvestmentData = {
  id: string;
  name: string;
  symbol: string;
  type: string;
  amount: number;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  returnPercentage: number;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  historicalData: { date: string; price: number }[];
  lastUpdated: string;
  sector?: string;
  dividendYield?: number;
  annualizedReturn?: number;
  assetClass?: string;
};

type Transaction = {
  id: string;
  date: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
};

type NewsItem = {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
};

export default function InvestmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [investment, setInvestment] = useState<InvestmentData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
  const [showTransactions, setShowTransactions] = useState(false);
  const [showNews, setShowNews] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) {
        navigate('/');
        return;
      }

      if (id) {
        setTimeout(() => {
          const mockInvestment: InvestmentData = {
            id: id,
            name: 'S&P 500 ETF',
            symbol: 'SPY',
            type: 'ETF',
            amount: 5000,
            shares: 10.25,
            purchasePrice: 420.73,
            currentPrice: 488.24,
            returnPercentage: 16.04,
            description: 'The SPDR S&P 500 ETF Trust tracks an index of 500 large-cap U.S. stocks, providing broad exposure to the U.S. equity market.',
            riskLevel: 'Medium',
            sector: 'Broad Market',
            dividendYield: 1.32,
            annualizedReturn: 9.8,
            assetClass: 'Equity',
            historicalData: [
              { date: '2025-01-01', price: 450.12 },
              { date: '2025-01-15', price: 455.68 },
              { date: '2025-02-01', price: 462.33 },
              { date: '2025-02-15', price: 458.92 },
              { date: '2025-03-01', price: 465.77 },
              { date: '2025-03-15', price: 472.18 },
              { date: '2025-04-01', price: 480.45 },
              { date: '2025-04-15', price: 484.63 },
              { date: '2025-05-01', price: 488.24 },
            ],
            lastUpdated: '2025-05-01'
          };

          const mockTransactions: Transaction[] = [
            { id: 't1', date: '2025-01-15', type: 'buy', shares: 5.25, price: 420.73, total: 2208.83 },
            { id: 't2', date: '2025-02-20', type: 'buy', shares: 2.5, price: 460.15, total: 1150.38 },
            { id: 't3', date: '2025-03-10', type: 'buy', shares: 2.5, price: 465.92, total: 1164.80 },
            { id: 't4', date: '2025-04-05', type: 'sell', shares: 1.0, price: 475.60, total: 475.60 },
            { id: 't5', date: '2025-04-22', type: 'buy', shares: 1.0, price: 486.25, total: 486.25 },
          ];

          const mockNews: NewsItem[] = [
            {
              id: 'n1',
              title: 'S&P 500 Reaches New All-Time High as Tech Rally Continues',
              source: 'Market News',
              date: '2025-05-01',
              summary: 'The S&P 500 index climbed to a new record high today, propelled by strong performance in technology and communication services sectors.',
              url: '#'
            },
            {
              id: 'n2',
              title: 'Federal Reserve Maintains Interest Rates, Signals Potential Cut Later This Year',
              source: 'Financial Times',
              date: '2025-04-28',
              summary: 'The Federal Reserve kept benchmark interest rates unchanged at its latest meeting but indicated it may consider cuts if inflation continues to moderate.',
              url: '#'
            },
            {
              id: 'n3',
              title: 'ETF Inflows Hit Record Numbers in Q1 2025',
              source: 'Investment Weekly',
              date: '2025-04-15',
              summary: 'Exchange-traded funds saw unprecedented inflows during the first quarter, with broad market ETFs like SPY leading the way.',
              url: '#'
            }
          ];

          setInvestment(mockInvestment);
          setTransactions(mockTransactions);
          setNews(mockNews);
          setLoading(false);
        }, 1000);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleTimeRangeChange = (range: '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL') => {
    setTimeRange(range);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? 
      <TrendingUp className="h-5 w-5 text-green-500" /> : 
      <TrendingDown className="h-5 w-5 text-red-500" />;
  };

  const getValueColor = (value: number): string => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getRiskLevelColor = (level: 'Low' | 'Medium' | 'High'): string => {
    switch(level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Stock':
        return <TrendingUp className="h-6 w-6 text-blue-500" />;
      case 'ETF':
        return <BarChart3 className="h-6 w-6 text-indigo-500" />;
      case 'Bond':
        return <FileText className="h-6 w-6 text-yellow-500" />;
      case 'Crypto':
        return <DollarSign className="h-6 w-6 text-green-500" />;
      default:
        return <PieChart className="h-6 w-6 text-gray-500" />;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading investment details..." />;
  }

  if (!investment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-2 text-xl font-medium text-gray-900">Investment Not Found</h2>
          <p className="mt-1 text-gray-500">The investment you're looking for doesn't exist or you don't have access.</p>
          <button
            onClick={handleBack}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Back to Dashboard
          </button>
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
                Last updated: {investment.lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      {getTypeIcon(investment.type)}
                      <span className="ml-2">{investment.name}</span>
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 flex items-center">
                      {investment.symbol} • {investment.type}
                      <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {investment.sector || investment.assetClass}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(investment.currentPrice)}
                    </p>
                    <p className={`mt-1 flex items-center justify-end text-sm ${getValueColor(investment.returnPercentage)}`}>
                      {investment.returnPercentage >= 0 ? (
                        <TrendingUp className="mr-1 h-4 w-4" />
                      ) : (
                        <TrendingDown className="mr-1 h-4 w-4" />
                      )}
                      {formatPercent(investment.returnPercentage)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                {/* Holdings Summary */}
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Holdings</h3>
                    <p className="mt-1 text-xl font-semibold text-gray-900">{investment.shares.toFixed(4)} shares</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Market Value</h3>
                    <p className="mt-1 text-xl font-semibold text-gray-900">{formatCurrency(investment.amount)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Avg. Purchase Price</h3>
                    <p className="mt-1 text-xl font-semibold text-gray-900">{formatCurrency(investment.purchasePrice)}</p>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3 border-t border-gray-200 pt-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Return</h3>
                    <p className={`mt-1 text-xl font-semibold ${getValueColor(investment.returnPercentage)}`}>
                      {formatPercent(investment.returnPercentage)}
                    </p>
                    <p className={`text-sm ${getValueColor(investment.returnPercentage)}`}>
                      {formatCurrency(investment.amount - (investment.purchasePrice * investment.shares))}
                    </p>
                  </div>
                  {investment.dividendYield && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Dividend Yield</h3>
                      <p className="mt-1 text-xl font-semibold text-gray-900">{investment.dividendYield}%</p>
                    </div>
                  )}
                  {investment.annualizedReturn && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Annualized Return</h3>
                      <p className="mt-1 text-xl font-semibold text-gray-900">{investment.annualizedReturn}%</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Risk Level</h3>
                    <p className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(investment.riskLevel)}`}>
                        {investment.riskLevel}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Chart */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Price History</h3>
                    <div className="flex space-x-2">
                      {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((range) => (
                        <button
                          key={range}
                          onClick={() => handleTimeRangeChange(range)}
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
                  
                  {/* Placeholder for chart */}
                  <div className="bg-white rounded-lg p-4 h-80 border border-gray-200">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="h-16 w-16 text-indigo-400 mx-auto" />
                        <p className="mt-2 text-sm text-gray-500">
                          Price chart would display here with {timeRange} data.
                        </p>
                        <p className="text-xs text-gray-400">
                          In a real app, integrate with Recharts or similar library
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Investment Description */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">About {investment.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{investment.description}</p>
                </div>
                
                {/* Transactions */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <button
                    onClick={() => setShowTransactions(!showTransactions)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
                    {showTransactions ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  
                  {showTransactions && (
                    <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Shares</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{transaction.date}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  transaction.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {transaction.type === 'buy' ? 'Buy' : 'Sell'}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.shares}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(transaction.price)}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(transaction.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                
                {/* Related News */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <button
                    onClick={() => setShowNews(!showNews)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-medium text-gray-900">Related News</h3>
                    {showNews ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  
                  {showNews && (
                    <div className="mt-4 space-y-4">
                      {news.map((item) => (
                        <div key={item.id} className="bg-white p-4 border border-gray-200 rounded-lg">
                          <h4 className="text-base font-medium text-gray-900">{item.title}</h4>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <span>{item.source}</span>
                            <span className="mx-2">•</span>
                            <span>{item.date}</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">{item.summary}</p>
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Read more
                            <ArrowLeft className="ml-1 h-4 w-4 rotate-180" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Actions Buttons */}
                <div className="mt-8 border-t border-gray-200 pt-6 flex flex-wrap gap-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Buy More
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sell
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Set Alert
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Research
                  </button>
                </div>
              </div>
            </div>
            
            {/* Similar Investments Suggestions */}
            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-900">Similar Investments</h3>
              <p className="mt-1 text-sm text-gray-500">Based on your portfolio and investment preferences.</p>
              
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Vanguard Total Market ETF</h4>
                        <p className="text-sm text-gray-500">VTI</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">Price</span>
                      <span className="text-sm font-medium text-gray-900">$248.92</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-gray-500">YTD Return</span>
                      <span className="text-sm font-medium text-green-600">+14.3%</span>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">SPDR MSCI EAFE ETF</h4>
                        <p className="text-sm text-gray-500">EFA</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <PieChart className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">Price</span>
                      <span className="text-sm font-medium text-gray-900">$78.34</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-gray-500">YTD Return</span>
                      <span className="text-sm font-medium text-green-600">+8.7%</span>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">iShares Core S&P Mid-Cap</h4>
                        <p className="text-sm text-gray-500">IJH</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">Price</span>
                      <span className="text-sm font-medium text-gray-900">$312.45</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-gray-500">YTD Return</span>
                      <span className="text-sm font-medium text-green-600">+10.8%</span>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Details
                      </button>
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
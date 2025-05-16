import { useState, useEffect } from 'react';
import { TrendingUp,PieChart,BarChart3,Clock,CreditCard,DollarSign,ArrowRight,Menu,X,LogOut} from 'lucide-react';
import { auth } from '../lib/firebase/config';
import { logOut } from '../lib/firebase/auth';

type Investment = {
  id: string;
  name: string;
  amount: number;
  type: string;
  returnPercentage: number;
  lastUpdated: string;
};

export default function Dashboard() {
  const [user, setUser] = useState(auth.currentUser);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [totalPortfolio, setTotalPortfolio] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        // Redirect to login if not authenticated
        window.location.href = '/';
      }
    });

    // Mock data - in a real app, you would fetch this from Firebase
    const mockInvestments: Investment[] = [
      { 
        id: '1', 
        name: 'S&P 500 ETF', 
        amount: 5000, 
        type: 'ETF', 
        returnPercentage: 12.5,
        lastUpdated: '2025-04-30'
      },
      { 
        id: '2', 
        name: 'Tesla Inc.', 
        amount: 3200, 
        type: 'Stock', 
        returnPercentage: -2.3,
        lastUpdated: '2025-05-01'
      },
      { 
        id: '3', 
        name: 'Bitcoin', 
        amount: 2800, 
        type: 'Crypto', 
        returnPercentage: 18.7,
        lastUpdated: '2025-05-01'
      },
      { 
        id: '4', 
        name: 'Corporate Bond Fund', 
        amount: 4500, 
        type: 'Bond', 
        returnPercentage: 3.2,
        lastUpdated: '2025-04-29'
      },
    ];

    // Calculate total portfolio value
    const total = mockInvestments.reduce((sum, investment) => sum + investment.amount, 0);
    
    setInvestments(mockInvestments);
    setTotalPortfolio(total);
    setLoading(false);

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      // Redirect handled by the auth state listener
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
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
                <CreditCard className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-indigo-600">ShareLooped</span>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Investments
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Markets
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Learn
                </a>
              </nav>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    {user?.displayName || user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Logout</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <a href="#" className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Dashboard
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Investments
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Markets
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Learn
              </a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium text-sm">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.displayName || 'User'}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogOut className="h-6 w-6" />
                  <span className="sr-only">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Overview */}
          <div className="px-4 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

            <div className="mt-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                    Portfolio Overview
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Current value and performance summary.
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Total Portfolio Value</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">${totalPortfolio.toLocaleString()}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Monthly Return</dt>
                      <dd className="mt-1 text-3xl font-semibold text-green-600">+8.2%</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Asset Diversification</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <div className="flex items-center space-x-1">
                          <div className="w-1/4 h-2 bg-indigo-600 rounded-l-full"></div>
                          <div className="w-1/4 h-2 bg-blue-500"></div>
                          <div className="w-1/6 h-2 bg-green-500"></div>
                          <div className="w-1/6 h-2 bg-yellow-500"></div>
                          <div className="w-1/6 h-2 bg-red-500 rounded-r-full"></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>Stocks</span>
                          <span>ETFs</span>
                          <span>Crypto</span>
                          <span>Bonds</span>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Investments */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Your Investments</h2>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {investments.map((investment) => (
                    <li key={investment.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`
                            h-10 w-10 rounded-full flex items-center justify-center
                            ${investment.type === 'ETF' ? 'bg-indigo-100 text-indigo-600' : ''}
                            ${investment.type === 'Stock' ? 'bg-blue-100 text-blue-600' : ''}
                            ${investment.type === 'Crypto' ? 'bg-green-100 text-green-600' : ''}
                            ${investment.type === 'Bond' ? 'bg-yellow-100 text-yellow-600' : ''}
                          `}>
                            {investment.type === 'ETF' && <BarChart3 className="h-5 w-5" />}
                            {investment.type === 'Stock' && <TrendingUp className="h-5 w-5" />}
                            {investment.type === 'Crypto' && <DollarSign className="h-5 w-5" />}
                            {investment.type === 'Bond' && <PieChart className="h-5 w-5" />}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{investment.name}</div>
                            <div className="text-sm text-gray-500">{investment.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              ${investment.amount.toLocaleString()}
                            </div>
                            <div className={`text-sm ${investment.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {investment.returnPercentage >= 0 ? '+' : ''}{investment.returnPercentage}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Last updated: {investment.lastUpdated}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Market Insights */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Market Insights</h2>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
                  More insights
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <TrendingUp className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-900">Market Trends</h3>
                        <p className="text-sm text-gray-500">Latest trends in global markets</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Major indices are showing positive momentum with tech stocks leading the recovery.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-900">Crypto Update</h3>
                        <p className="text-sm text-gray-500">Cryptocurrency market overview</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Bitcoin is stabilizing above $75,000 while Ethereum continues its upward trajectory.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                        <PieChart className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-900">Sector Performance</h3>
                        <p className="text-sm text-gray-500">Sector-by-sector breakdown</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Healthcare and renewable energy sectors outperforming traditional industries.
                      </p>
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
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center">
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                About
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Blog
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Jobs
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Support
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Contact
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Privacy
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Terms
              </a>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} InvestEasy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
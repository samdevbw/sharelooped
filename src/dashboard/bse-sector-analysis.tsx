import { useState } from 'react';
import { 
  BarChart3, 
  PieChart,
  TrendingUp,
  Building,
  Diamond,
  DollarSign,
  Globe,
  ShoppingCart,
  Factory,
  Heart
} from 'lucide-react';

export default function BSESectorAnalysis() {
  const [selectedSector, setSelectedSector] = useState('all');
  const [timeframe, setTimeframe] = useState('1M');

  const sectors = [
    {
      id: 'financials',
      name: 'Financials',
      icon: <Building className="h-5 w-5" />,
      performance: 8.2,
      marketCap: 342.5,
      color: 'indigo',
      companies: ['SCBANK', 'FNBB', 'ABSA', 'BIHL', 'LETSHEGO'],
      description: 'Banking and financial services sector shows strong growth',
      topPerformer: 'Standard Chartered Bank (+14.6%)'
    },
    {
      id: 'consumer-goods',
      name: 'Consumer Goods',
      icon: <ShoppingCart className="h-5 w-5" />,
      performance: 5.7,
      marketCap: 128.4,
      color: 'green',
      companies: ['SECHABA', 'SEFALANA'],
      description: 'Steady performance driven by Sechaba Brewery',
      topPerformer: 'Sechaba Brewery (+7.02%)'
    },
    {
      id: 'mining',
      name: 'Mining',
      icon: <Diamond className="h-5 w-5" />,
      performance: 2.1,
      marketCap: 95.3,
      color: 'blue',
      companies: ['LUCARA', 'MINERGY', 'SHUMBA'],
      description: 'Mixed results with diamond sector recovery',
      topPerformer: 'Lucara Diamond Corp (+2.52%)'
    },
    {
      id: 'consumer-services',
      name: 'Consumer Services',
      icon: <Heart className="h-5 w-5" />,
      performance: -0.8,
      marketCap: 45.7,
      color: 'red',
      companies: ['CHOPPIES', 'CRESTA', 'CHOBE'],
      description: 'Retail sector facing challenges',
      topPerformer: 'Chobe Holdings (+0.23%)'
    },
    {
      id: 'energy',
      name: 'Energy',
      icon: <Globe className="h-5 w-5" />,
      performance: -1.2,
      marketCap: 38.9,
      color: 'orange',
      companies: ['TLOU', 'ENGEN'],
      description: 'Energy sector under pressure',
      topPerformer: 'Engen Botswana (-0.15%)'
    },
    {
      id: 'industrials',
      name: 'Industrials',
      icon: <Factory className="h-5 w-5" />,
      performance: 0.5,
      marketCap: 71.2,
      color: 'purple',
      companies: ['G4S', 'TURNSTAR', 'OLYMPIA'],
      description: 'Modest growth in industrial sector',
      topPerformer: 'Turnstar Holdings (+1.2%)'
    }
  ];

  const filteredSectors = selectedSector === 'all' 
    ? sectors 
    : sectors.filter(s => s.id === selectedSector);

  const timeframes = [
    { value: '1D', label: 'Today' },
    { value: '1W', label: '1 Week' },
    { value: '1M', label: '1 Month' },
    { value: 'YTD', label: 'YTD' }
  ];

  const sectorDistribution = sectors.map(s => ({
    name: s.name,
    value: s.marketCap,
    percentage: (s.marketCap / sectors.reduce((sum, sector) => sum + sector.marketCap, 0) * 100).toFixed(1)
  }));

  const getColorClass = (color, type = 'bg') => {
    const colorMap = {
      'indigo': type === 'bg' ? 'bg-indigo-100' : 'text-indigo-600',
      'green': type === 'bg' ? 'bg-green-100' : 'text-green-600',
      'blue': type === 'bg' ? 'bg-blue-100' : 'text-blue-600',
      'red': type === 'bg' ? 'bg-red-100' : 'text-red-600',
      'orange': type === 'bg' ? 'bg-orange-100' : 'text-orange-600',
      'purple': type === 'bg' ? 'bg-purple-100' : 'text-purple-600'
    };
    return colorMap[color] || 'bg-gray-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">BSE Sector Analysis</h2>
        
        {/* Timeframe Selection */}
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                timeframe === tf.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Market Composition */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Composition</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sector Performance Chart */}
          <div className="space-y-3">
            {sectorDistribution.map((sector) => (
              <div key={sector.name} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">{sector.name}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-8">
                    <div 
                      className={`${getColorClass(sectors.find(s => s.name === sector.name)?.color)} h-8 rounded-full flex items-center justify-end pr-2`}
                      style={{ width: `${sector.percentage}%` }}
                    >
                      <span className="text-xs font-semibold text-gray-700">{sector.percentage}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 w-20 text-right">
                  BWP{sector.value}B
                </div>
              </div>
            ))}
          </div>

          {/* Performance Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Performance Summary</h4>
            <div className="space-y-2">
              {sectors.map((sector) => (
                <div key={sector.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${getColorClass(sector.color)}`}>
                      {sector.icon}
                    </div>
                    <span className="text-sm text-gray-700">{sector.name}</span>
                  </div>
                  <div className={`text-sm font-semibold ${
                    sector.performance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {sector.performance >= 0 ? '+' : ''}{sector.performance}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sector Filter */}
      <div className="mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedSector('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedSector === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Sectors
          </button>
          {sectors.map((sector) => (
            <button
              key={sector.id}
              onClick={() => setSelectedSector(sector.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                selectedSector === sector.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {sector.icon}
              {sector.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sector Details */}
      <div className="space-y-4">
        {filteredSectors.map((sector) => (
          <div key={sector.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${getColorClass(sector.color)}`}>
                  {sector.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{sector.name}</h3>
                  <p className="text-sm text-gray-600">{sector.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${
                  sector.performance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {sector.performance >= 0 ? '+' : ''}{sector.performance}%
                </div>
                <div className="text-sm text-gray-500">Market Cap: BWP{sector.marketCap}B</div>
              </div>
            </div>
            
            {/* Companies in Sector */}
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-600">Companies: </span>
                  <span className="font-medium text-gray-900">{sector.companies.join(', ')}</span>
                </div>
                <div className="text-indigo-600">
                  Top: {sector.topPerformer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Investment Insight</h4>
            <p className="text-sm text-blue-800 mt-1">
              The Financials sector continues to dominate BSE with strong performance from banking stocks. 
              Consider diversifying across sectors, with emphasis on dividend-paying stocks in Consumer Goods 
              and selective opportunities in the recovering Mining sector.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
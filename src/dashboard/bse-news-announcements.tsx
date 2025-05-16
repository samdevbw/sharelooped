import { useState } from 'react';
import { FileText, Calendar, Download, Filter, Search, TrendingUp, Building, AlertCircle, ChevronRight } from 'lucide-react';

export default function BSENewsAndAnnouncements() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const newsItems = [
    {
      id: 1,
      title: 'Sechaba Brewery Holdings Declares Final and Special Dividends',
      category: 'dividend',
      company: 'SECHABA',
      date: new Date('2025-04-17'),
      content: 'Sechaba Brewery Holdings Ltd declares a final dividend of 194.63 thebe per share and special dividend of 133.98 thebe per share.',
      important: true,
      document: 'SECHABA_Dividend_2025.pdf'
    },
    {
      id: 2,
      title: 'Standard Chartered Bank Reports Strong Q1 Results',
      category: 'results',
      company: 'SCBANK',
      date: new Date('2025-04-15'),
      content: 'Standard Chartered Bank Botswana reports 32.3% increase in share price YTD, leading the banking sector.',
      important: true,
      document: 'SCBANK_Q1_2025.pdf'
    },
    {
      id: 3,
      title: 'BSE Market Update: DCI Reaches 10,228.33',
      category: 'market',
      company: 'BSE',
      date: new Date('2025-04-17'),
      content: 'BSE Domestic Companies Index increases by 1.14% to close at 10,228.33, with year-to-date gain of 1.78%.',
      important: false,
      document: null
    },
    {
      id: 4,
      title: 'FNB Botswana Announces New Digital Banking Services',
      category: 'announcement',
      company: 'FNBB',
      date: new Date('2025-04-10'),
      content: 'First National Bank Botswana launches new mobile banking platform with enhanced security features.',
      important: false,
      document: 'FNBB_Digital_Update.pdf'
    },
    {
      id: 5,
      title: 'Lucara Diamond Corp Recovers Exceptional Stone',
      category: 'operational',
      company: 'LUCARA',
      date: new Date('2025-04-08'),
      content: 'Lucara announces recovery of 421-carat diamond from Karowe mine, expected to boost Q2 revenues.',
      important: true,
      document: null
    },
    {
      id: 6,
      title: 'Choppies Enterprises Issues Profit Warning',
      category: 'warning',
      company: 'CHOPPIES',
      date: new Date('2025-04-05'),
      content: 'Choppies Enterprises warns of expected 20% decline in H1 2025 profits due to challenging retail environment.',
      important: true,
      document: 'CHOPPIES_Warning_2025.pdf'
    },
    {
      id: 7,
      title: 'BSE Introduces New Market Surveillance System',
      category: 'regulatory',
      company: 'BSE',
      date: new Date('2025-04-01'),
      content: 'Botswana Stock Exchange implements advanced market surveillance technology to enhance market integrity.',
      important: false,
      document: 'BSE_Surveillance_System.pdf'
    },
    {
      id: 8,
      title: 'Government Bond Auction Results',
      category: 'bonds',
      company: 'GOV',
      date: new Date('2025-03-28'),
      content: 'Government of Botswana successfully raises BWP 500 million in latest bond auction at 4.75% yield.',
      important: false,
      document: 'GOV_Bond_Results.pdf'
    }
  ];

  const categories = [
    { value: 'all', label: 'All News', icon: <FileText className="h-4 w-4" /> },
    { value: 'dividend', label: 'Dividends', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'results', label: 'Results', icon: <Building className="h-4 w-4" /> },
    { value: 'market', label: 'Market', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'announcement', label: 'Announcements', icon: <AlertCircle className="h-4 w-4" /> },
    { value: 'regulatory', label: 'Regulatory', icon: <FileText className="h-4 w-4" /> },
    { value: 'warning', label: 'Warnings', icon: <AlertCircle className="h-4 w-4" /> },
  ];

  const filteredNews = newsItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category) => {
    const colors = {
      dividend: 'bg-green-100 text-green-800',
      results: 'bg-blue-100 text-blue-800',
      market: 'bg-purple-100 text-purple-800',
      announcement: 'bg-yellow-100 text-yellow-800',
      operational: 'bg-indigo-100 text-indigo-800',
      warning: 'bg-red-100 text-red-800',
      regulatory: 'bg-gray-100 text-gray-800',
      bonds: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-BW', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">BSE News & Announcements</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === category.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.icon}
            {category.label}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No news items found matching your criteria.
          </div>
        ) : (
          filteredNews.map((item) => (
            <div key={item.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
              item.important ? 'border-l-4 border-l-indigo-500' : ''
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                      {item.category.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-600">{item.company}</span>
                    {item.important && (
                      <span className="text-red-500 text-sm font-medium">• Important</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(item.date)}
                    </div>
                    {item.document && (
                      <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
                        <Download className="h-4 w-4" />
                        Download PDF
                      </button>
                    )}
                  </div>
                </div>
                <button className="ml-4 text-indigo-600 hover:text-indigo-700">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredNews.length > 0 && (
        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Load More News
          </button>
        </div>
      )}

      {/* Subscribe Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Subscribe to BSE Alerts</h4>
            <p className="text-sm text-gray-600 mt-1">Get real-time updates on market movements and announcements</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
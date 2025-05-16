 import { useState } from 'react';
import { 
  Bot, 
  Send, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  ChevronRight,
  Building,
  Briefcase,
  Shield,
  BookOpen,
  DollarSign,
  PieChart,
  BarChart3
} from 'lucide-react';

export default function AIInvestmentAdvisor() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your BSE Investment Advisor. I can help you with investment insights, portfolio recommendations, and market analysis for the Botswana Stock Exchange. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestions = [
    { icon: <PieChart className="h-4 w-4" />, text: "Analyze my portfolio", topic: "portfolio" },
    { icon: <TrendingUp className="h-4 w-4" />, text: "BSE market trends", topic: "trends" },
    { icon: <Building className="h-4 w-4" />, text: "Best performing sectors", topic: "sectors" },
    { icon: <Shield className="h-4 w-4" />, text: "Risk assessment", topic: "risk" },
    { icon: <BookOpen className="h-4 w-4" />, text: "Investment education", topic: "education" },
    { icon: <DollarSign className="h-4 w-4" />, text: "Dividend opportunities", topic: "dividends" },
  ];

  const marketInsights = {
    portfolio: {
      response: "Based on your current portfolio, I notice you have a good mix of domestic equities. However, you might benefit from more diversification in the mining sector. Lucara Diamond Corp (LUCARA) has shown strong performance lately with a 2.52% gain. Consider also looking at government bonds for stability.",
      recommendations: [
        { stock: 'LUCARA', action: 'Buy', reason: 'Strong diamond market recovery' },
        { stock: 'SECHABA', action: 'Hold', reason: 'Consistent dividend payouts' },
        { stock: 'CHOPPIES', action: 'Sell', reason: 'Declining retail sector performance' }
      ]
    },
    trends: {
      response: "The BSE market is showing positive momentum with the DCI up 1.14% today and 1.78% YTD. Banking sector leads with Standard Chartered up 14.6%. The market capitalization has reached BWP 721.6 billion, indicating strong investor confidence.",
      insights: [
        "Banking sector outperforming other sectors",
        "Foreign companies index showing steady growth",
        "Increased trading volumes suggest growing liquidity"
      ]
    },
    sectors: {
      response: "Currently, the Financials sector is leading the market with banks like Standard Chartered (+14.6%) and FNB Botswana (+0.39%) showing gains. Consumer Goods sector, led by Sechaba Brewery (+7.02%), is also performing well. Mining sector shows mixed results.",
      topSectors: [
        { name: 'Financials', performance: '+8.2%', outlook: 'Positive' },
        { name: 'Consumer Goods', performance: '+5.7%', outlook: 'Stable' },
        { name: 'Mining', performance: '+2.1%', outlook: 'Volatile' }
      ]
    },
    risk: {
      response: "Your portfolio shows moderate risk with 65% in equities and 35% in bonds. Consider your risk tolerance: Conservative investors should increase bond allocation to 40-50%. Your current exposure to single stocks like Tesla carries higher risk.",
      riskMetrics: {
        portfolioVolatility: 'Medium',
        diversificationScore: '7/10',
        riskAdjustedReturn: '12.5%'
      }
    },
    education: {
      response: "Here are key investment principles for BSE: 1) Diversify across sectors and asset classes. 2) Monitor the DCI and FCI indices for market trends. 3) Consider dividend-paying stocks like banks and breweries. 4) Use licensed BSE brokers for transactions. 5) Keep informed about economic policies affecting Botswana markets.",
      topics: [
        "Understanding BSE indices (DCI, FCI, All Company)",
        "How to buy shares through BSE brokers",
        "Tax implications of investments in Botswana",
        "Reading company financial statements"
      ]
    },
    dividends: {
      response: "Several BSE-listed companies offer attractive dividends. Sechaba Brewery recently declared a final dividend of 194.63 thebe and special dividend of 133.98 thebe per share. Banks like FNB Botswana and Standard Chartered also have consistent dividend histories.",
      highDividendStocks: [
        { stock: 'SECHABA', yield: '5.8%', payoutRatio: '65%' },
        { stock: 'SCBANK', yield: '4.2%', payoutRatio: '45%' },
        { stock: 'FNBB', yield: '3.9%', payoutRatio: '55%' }
      ]
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: chat.length + 1,
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setChat([...chat, userMessage]);
    setMessage('');
    setIsTyping(true);
    setShowSuggestions(false);

    setTimeout(() => {
      const assistantMessage = {
        id: chat.length + 2,
        role: 'assistant',
        content: getAIResponse(message),
        data: getResponseData(message),
        timestamp: new Date()
      };
      setChat(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('analyze')) {
      return marketInsights.portfolio.response;
    } else if (lowerMessage.includes('trend') || lowerMessage.includes('market')) {
      return marketInsights.trends.response;
    } else if (lowerMessage.includes('sector') || lowerMessage.includes('performing')) {
      return marketInsights.sectors.response;
    } else if (lowerMessage.includes('risk') || lowerMessage.includes('assessment')) {
      return marketInsights.risk.response;
    } else if (lowerMessage.includes('education') || lowerMessage.includes('learn')) {
      return marketInsights.education.response;
    } else if (lowerMessage.includes('dividend') || lowerMessage.includes('yield')) {
      return marketInsights.dividends.response;
    }
    
    return "I can help you analyze BSE investments, understand market trends, assess risks, and identify opportunities. What specific area would you like to explore?";
  };

  const getResponseData = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('portfolio')) return marketInsights.portfolio.recommendations;
    if (lowerMessage.includes('trend')) return marketInsights.trends.insights;
    if (lowerMessage.includes('sector')) return marketInsights.sectors.topSectors;
    if (lowerMessage.includes('risk')) return marketInsights.risk.riskMetrics;
    if (lowerMessage.includes('education')) return marketInsights.education.topics;
    if (lowerMessage.includes('dividend')) return marketInsights.dividends.highDividendStocks;
    
    return null;
  };

  const handleSuggestionClick = (text) => {
    setMessage(text);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">BSE AI Investment Advisor</h2>
            <p className="text-sm text-indigo-200">Powered by market intelligence</p>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '500px' }}>
        {chat.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
              <p className="text-sm">{msg.content}</p>
              
              {/* Show data if available */}
              {msg.data && Array.isArray(msg.data) && msg.data[0]?.stock && (
                <div className="mt-3 space-y-2">
                  {msg.data.map((item, idx) => (
                    <div key={idx} className={`p-2 rounded ${msg.role === 'user' ? 'bg-indigo-700' : 'bg-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{item.stock}</span>
                        <span className={`text-sm ${item.action === 'Buy' ? 'text-green-600' : item.action === 'Sell' ? 'text-red-600' : 'text-yellow-600'}`}>
                          {item.action}
                        </span>
                      </div>
                      <p className="text-xs mt-1">{item.reason}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-xs mt-2 opacity-70">
                {msg.timestamp.toLocaleTimeString('en-BW', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="p-4 border-t">
          <p className="text-sm text-gray-600 mb-2">Quick actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="flex items-center gap-2 p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
              >
                <div className="text-indigo-600">{suggestion.icon}</div>
                <span className="text-gray-700">{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about BSE investments..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle, ArrowLeft, HelpCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Page Not Found
          </h2>
          
          <p className="mt-2 text-center text-sm text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => navigate('/')}
              className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Home className="mr-2 h-5 w-5" />
              Go to Home
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team.
            </p>
            
            <a 
              href="/support" 
              className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Contact Support
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a
            href="/dashboard"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
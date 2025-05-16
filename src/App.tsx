import { useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import { Toaster } from 'react-hot-toast'; // For notifications, you would need to install react-hot-toast
import { LanguageProvider } from './context/LanguageContext';

// Initialize Firebase app
import './lib/firebase/config';

export default function App() {
  useEffect(() => {
    // Any app-wide initialization can go here
    document.title = 'InvestEasy - Smart Investing Platform';
  }, []);

  return (
    <>
       <LanguageProvider>
      <AppRouter />
      <Toaster position="top-right"/>
    </LanguageProvider>
    </>
  );
}


import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

// Type definitions
export type Language = 'english' | 'setswana';

// Translation data
const translations = {
  english: {
    common: {
      dashboard: 'Dashboard',
      portfolio: 'Portfolio',
      investments: 'Investments',
      markets: 'Markets',
      learn: 'Learn',
      settings: 'Settings',
      logout: 'Logout',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success!',
      save: 'Save',
      cancel: 'Cancel',
      back: 'Back',
      next: 'Next',
      close: 'Close'
    },
    auth: {
      login: 'Sign in',
      register: 'Create Account',
      email: 'Email Address',
      password: 'Password',
      forgotPassword: 'Forgot your password?',
      rememberMe: 'Remember me',
      fullName: 'Full Name',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: 'Don\'t have an account?',
      createAccount: 'Create account',
      signIn: 'Sign in',
      signInWithGoogle: 'Sign in with Google',
      registerWithGoogle: 'Register with Google',
      resetPassword: 'Reset Password',
      sendResetLink: 'Send Password Reset Link',
      resetLinkSent: 'Password reset link has been sent to your email',
      resetSuccess: 'Your password has been reset successfully',
      weakPassword: 'Password should be at least 6 characters',
      invalidEmail: 'Please enter a valid email address',
      emailInUse: 'This email is already in use'
    },
    dashboard: {
      welcomeBack: 'Welcome back',
      totalPortfolioValue: 'Total Portfolio Value',
      availableCash: 'Available Cash',
      holdingsValue: 'Holdings Value',
      performance: 'Performance',
      todayChange: 'Today\'s Change',
      insights: 'Market Insights',
      learningProgress: 'Learning Progress',
      viewAll: 'View all',
      continueEducation: 'Continue Education',
      featuredInvestments: 'Featured Investments'
    },
    investments: {
      holdings: 'Holdings',
      transactions: 'Transactions',
      watchlist: 'Watchlist',
      marketValue: 'Market Value',
      purchasePrice: 'Purchase Price',
      currentPrice: 'Current Price',
      change: 'Change',
      dividendYield: 'Dividend Yield',
      marketCap: 'Market Cap',
      buy: 'Buy',
      sell: 'Sell',
      setAlert: 'Set Alert',
      addToWatchlist: 'Add to Watchlist',
      removeFromWatchlist: 'Remove from Watchlist'
    },
    learning: {
      aiAdvisor: 'AI Investment Advisor',
      learningCenter: 'Learning Center',
      practiceTrading: 'Practice Trading',
      modules: 'Learning Modules',
      progress: 'Progress',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      articles: 'Articles',
      videos: 'Videos',
      quizzes: 'Quizzes',
      savedLessons: 'Saved Lessons'
    },
    profile: {
      personalInfo: 'Personal Information',
      notifications: 'Notifications',
      preferences: 'Preferences',
      security: 'Security',
      payment: 'Payment Methods',
      language: 'Language',
      theme: 'Theme',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      accountSettings: 'Account Settings',
      emailNotifications: 'Email Notifications',
      pushNotifications: 'Push Notifications'
    }
  },
  setswana: {
    common: {
      dashboard: 'Tafole ya Taolo',
      portfolio: 'Dipeeletso',
      investments: 'Dipeeletso',
      markets: 'Mebaraka',
      learn: 'Ithuta',
      settings: 'Dipeakanyo',
      logout: 'Tswa',
      loading: 'E a laisa...',
      error: 'Go nnile le phoso',
      success: 'Go atlega!',
      save: 'Boloka',
      cancel: 'Khansela',
      back: 'Boela morago',
      next: 'E e latelang',
      close: 'Tswala'
    },
    auth: {
      login: 'Tsena',
      register: 'Tlhama Akhaonto',
      email: 'Aterese ya Imeile',
      password: 'Lefoko la Sephiri',
      forgotPassword: 'A o lebetse lefoko la sephiri?',
      rememberMe: 'Nkgopola',
      fullName: 'Maina ka Botlalo',
      alreadyHaveAccount: 'O setse o na le akhaonto?',
      dontHaveAccount: 'Ga o na akhaonto?',
      createAccount: 'Tlhama akhaonto',
      signIn: 'Tsena',
      signInWithGoogle: 'Tsena ka Google',
      registerWithGoogle: 'Ikwadise ka Google',
      resetPassword: 'Fetola Lefoko la Sephiri',
      sendResetLink: 'Romela Kgokaganyo ya go Fetola Lefoko la Sephiri',
      resetLinkSent: 'Kgokaganyo ya go fetola lefoko la sephiri e rometse mo imeileng ya gago',
      resetSuccess: 'Lefoko la gago la sephiri le fetotse ka katlego',
      weakPassword: 'Lefoko la sephiri le tshwanetse go nna le ditlhaka di le 6 bonnye',
      invalidEmail: 'Tsenya aterese ya imeile e e nepagetseng',
      emailInUse: 'Imeile e e setse e diriswa'
    },
    dashboard: {
      welcomeBack: 'O amogetswe gape',
      totalPortfolioValue: 'Boleng jwa Dipeeletso Tsotlhe',
      availableCash: 'Madi a a Leng Teng',
      holdingsValue: 'Boleng jwa Dipeeletso',
      performance: 'Tiragatso',
      todayChange: 'Phetogo ya Gompieno',
      insights: 'Kitso ya Mebaraka',
      learningProgress: 'Kgatelopele ya Go Ithuta',
      viewAll: 'Bona tsotlhe',
      continueEducation: 'Tswelela ka Thuto',
      featuredInvestments: 'Dipeeletso tse di Kgethilweng'
    },
    investments: {
      holdings: 'Dipeeletso',
      transactions: 'Dikgwebisano',
      watchlist: 'Lenaneo la go Lebelela',
      marketValue: 'Boleng jwa Mmaraka',
      purchasePrice: 'Tlhwatlhwa ya Theko',
      currentPrice: 'Tlhwatlhwa ya Jaanong',
      change: 'Phetogo',
      dividendYield: 'Poelo ya Dikarolwana',
      marketCap: 'Boleng jwa Mmaraka',
      buy: 'Reka',
      sell: 'Rekisa',
      setAlert: 'Baya Tsiboso',
      addToWatchlist: 'Tsenya mo Lenaneo la go Lebelela',
      removeFromWatchlist: 'Tlosa mo Lenaneo la go Lebelela'
    },
    learning: {
      aiAdvisor: 'Mogakolodi wa AI wa Dipeeletso',
      learningCenter: 'Lefelo la Go Ithuta',
      practiceTrading: 'Ikatiso ya go Gweba',
      modules: 'Dikarolo tsa Go Ithuta',
      progress: 'Kgatelopele',
      beginner: 'Moithuti',
      intermediate: 'Magareng',
      advanced: 'Ya Maemo a a Kwa godimo',
      articles: 'Diathikele',
      videos: 'Dibidio',
      quizzes: 'Dipotso',
      savedLessons: 'Dithuto tse di Bolokilweng'
    },
    profile: {
      personalInfo: 'Tshedimosetso ya Sebele',
      notifications: 'Dikitsiso',
      preferences: 'Dikgatlhego',
      security: 'Tshireletso',
      payment: 'Mekgwa ya Tuelo',
      language: 'Puo',
      theme: 'Thimi',
      changePassword: 'Fetola Lefoko la Sephiri',
      currentPassword: 'Lefoko la Sephiri la Jaanong',
      newPassword: 'Lefoko la Sephiri le Lesha',
      confirmPassword: 'Tlhomamisa Lefoko la Sephiri le Lesha',
      accountSettings: 'Dipeelo tsa Akhaonto',
      emailNotifications: 'Dikitsiso tsa Imeile',
      pushNotifications: 'Dikitsiso tsa Push'
    }
  }
};

/**
 * Custom hook for translation functionality
 * @returns Object with translation function, current language, and language setter
 */
export function useTranslation() {
  // Try to use the language from context if available
  const context = useContext(LanguageContext);
  
  // Fallback to local state if context is not available
  const [language, setLocalLanguage] = useState<Language>(() => {
    // Initialize from localStorage if available
    const storedLanguage = localStorage.getItem('preferredLanguage') as Language;
    return (storedLanguage && (storedLanguage === 'english' || storedLanguage === 'setswana')) 
      ? storedLanguage 
      : 'english';
  });

  // Use context language if available, otherwise use local state
  const currentLanguage = context?.language || language;
  const setLanguage = context?.setLanguage || setLocalLanguage;

  // Update localStorage when language changes (only if not using context)
  useEffect(() => {
    if (!context) {
      localStorage.setItem('preferredLanguage', language);
    }
  }, [language, context]);

  /**
   * Translate a key to the current language
   * @param key Translation key in format "section.key"
   * @returns Translated string or the key itself if not found
   */
  const t = (key: string): string => {
    // Split the key into sections (e.g., 'dashboard.totalPortfolioValue')
    const sections = key.split('.');
    
    if (sections.length !== 2) {
      console.warn(`Invalid translation key format: ${key}. Expected format: "section.key"`);
      return key;
    }
    
    const [section, subKey] = sections;
    
    try {
      // @ts-ignore - Using dynamic access here
      const translation = translations[currentLanguage]?.[section]?.[subKey];
      
      if (!translation) {
        console.warn(`Missing translation for key: ${key} in language: ${currentLanguage}`);
        
        // Try to fall back to English if not found in current language and current language is not English
        if (currentLanguage !== 'english') {
          // @ts-ignore - Using dynamic access here
          const englishFallback = translations['english']?.[section]?.[subKey];
          if (englishFallback) {
            return englishFallback;
          }
        }
        
        return key;
      }
      
      return translation;
    } catch (error) {
      console.error(`Error translating key: ${key}`, error);
      return key;
    }
  };

  /**
   * Get all translations for a specific section
   * @param section Section name
   * @returns Object containing all translations for the section
   */
  const getSection = (section: string): Record<string, string> => {
    try {
      // @ts-ignore - Using dynamic access here
      return translations[currentLanguage][section] || {};
    } catch (error) {
      console.error(`Error getting translations for section: ${section}`, error);
      return {};
    }
  };

  return { 
    t,                // Translation function 
    getSection,       // Get all translations for a section
    language: currentLanguage,  // Current language
    setLanguage,      // Function to change language
    availableLanguages: ['english', 'setswana'] as const // Available languages
  };
}

export default useTranslation;
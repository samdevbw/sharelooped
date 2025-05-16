import React, { createContext, useState, useEffect } from 'react';
import { Language } from '../hooks/useTranslation';

// Context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

// Create context with default values
export const LanguageContext = createContext<LanguageContextType | null>(null);

// Props interface
interface LanguageProviderProps {
  children: React.ReactNode;
}

// Language provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize language state from localStorage
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage') as Language;
    return (storedLanguage && (storedLanguage === 'english' || storedLanguage === 'setswana')) 
      ? storedLanguage 
      : 'english';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  // Function to update language
  const handleSetLanguage = (newLanguage: Language) => {
    if (newLanguage === 'english' || newLanguage === 'setswana') {
      setLanguage(newLanguage);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
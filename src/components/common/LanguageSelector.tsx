// src/components/common/LanguageSelector.tsx

import * as React from 'react';

import { useTranslation } from '../../hooks/useTranslation';

const LanguageSelector = () => {
  const { language, setLanguage } = useTranslation();
  
  return (
    <div className="inline-block">
      <select 
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        value={language} 
        onChange={(e) => setLanguage(e.target.value as 'english' | 'setswana')}
        aria-label="Select language"
      >
        <option value="english">English</option>
        <option value="setswana">Setswana</option>
      </select>
    </div>
  );
};

// Add this default export
export default LanguageSelector;
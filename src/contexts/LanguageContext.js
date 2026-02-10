// src/contexts/LanguageContext.js - FIXED
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// REMOVE THIS IMPORT: import { strings } from '../i18n/strings';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('appLanguage');
        if (savedLang) {
          setLang(savedLang);
        }
      } catch (error) {
        console.log('Error loading language:', error);
      }
    };
    loadLanguage();
  }, []);

  const toggleLanguage = async () => {
    const newLang = lang === 'en' ? 'am' : 'en';
    setLang(newLang);
    await AsyncStorage.setItem('appLanguage', newLang);
  };

  const changeLanguage = async (newLang) => {
    setLang(newLang);
    await AsyncStorage.setItem('appLanguage', newLang);
  };

  const t = (path) => {
    const keys = path.split('.');
    let value = strings[lang]; // This uses the strings object defined below
    
    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        console.warn(`Translation not found: ${path}`);
        return path;
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ 
      lang, 
      toggleLanguage, 
      changeLanguage,
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Export the context itself
export default LanguageContext;

// KEEP THIS strings object here (it's already in your file)
export const strings = {
  en: {
    // ... all your English strings ...
  },
  am: {
    // ... all your Amharic strings ...
  }
};
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'de' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-6 right-6 z-50 px-4 py-2 text-sm font-black uppercase tracking-widest text-brand-dark-900 bg-brand-accent rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      aria-label="Toggle language"
    >
      {i18n.language === 'en' ? 'DE' : 'EN'}
    </button>
  );
};

export default LanguageSwitcher;

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Check } from 'lucide-react';
import { languages, useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageSelector({ isOpen, onClose }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-sm bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden p-6 pb-12 sm:pb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif">{t('profile.language')}</h3>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Select Preference</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    onClose();
                  }}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl transition-all group",
                    language === lang.code 
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                      : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                  )}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">{lang.nativeName}</span>
                    <span className={cn(
                      "text-[10px] font-medium opacity-60",
                      language === lang.code ? "text-white" : "text-zinc-400"
                    )}>
                      {lang.name}
                    </span>
                  </div>
                  {language === lang.code && (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Regional Support Enabled</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
